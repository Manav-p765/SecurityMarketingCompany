import crypto from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * GitHub OAuth for the blog admin (Sveltia CMS at /admin on the website).
 *
 *   GET /api/auth            -> redirects to GitHub's sign-in page
 *   GET /api/auth/callback   -> exchanges the code for a token, checks the
 *                               user can push to the repo, and hands the
 *                               token to the CMS window
 *
 * The CMS opens /api/auth in a popup (config.yml: base_url + auth_endpoint).
 * The callback page talks to the CMS window with postMessage, the protocol
 * Decap/Sveltia CMS expect: it sends "authorizing:github", the CMS echoes it
 * back, and the page replies with "authorization:github:success:{token}" —
 * but only to an allowed website origin.
 *
 * Environment (Render):
 *   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET  GitHub OAuth App credentials
 *   GITHUB_REPO      owner/name of the repo the CMS edits
 *                    (default Manav-p765/SecurityMarketingCompany)
 *   CMS_ORIGINS      optional, comma-separated website origins allowed to
 *                    receive the token (default: the live site, plus
 *                    CORS_ORIGIN)
 * The GitHub OAuth App's callback URL must be
 *   https://<this API's host>/api/auth/callback
 */

const STATE_COOKIE = 'smc_oauth_state';
const DEFAULT_REPO = 'Manav-p765/SecurityMarketingCompany';
const LIVE_ORIGINS = ['https://www.securitymarketingcompany.com', 'https://securitymarketingcompany.com'];

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
});

function readCookie(req, name) {
  const pairs = (req.headers.cookie || '').split(';').map((part) => part.trim().split('='));
  const match = pairs.find(([key]) => key === name);
  return match ? decodeURIComponent(match.slice(1).join('=')) : '';
}

/** Callback URL registered on the GitHub OAuth App: this host + /api/auth/callback. */
const callbackUrl = (req) => `${req.protocol}://${req.get('host')}/api/auth/callback`;

/**
 * The page the popup ends on. It never sends the token to an origin outside
 * `allowedOrigins`; anything else gets nothing.
 */
function handshakePage(res, { allowedOrigins, status, content }) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  // JSON in a script: escape "<" so the payload can never close the tag.
  const data = JSON.stringify({ message, allowedOrigins }).replace(/</g, '\\u003c');
  const note = status === 'success' ? 'Signed in. You can close this window.' : content.error;
  res
    .status(status === 'success' ? 200 : 403)
    .set('Cache-Control', 'no-store')
    .set('X-Robots-Tag', 'noindex, nofollow')
    .type('html').send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow">
<title>Blog admin sign-in</title></head>
<body style="font-family:Arial,sans-serif;padding:2rem">
<p>${note.replace(/[<>&]/g, '')}</p>
<script>
  (function () {
    var data = ${data};
    if (!window.opener) return;
    window.addEventListener('message', function (event) {
      if (data.allowedOrigins.indexOf(event.origin) === -1) return;
      if (event.data !== 'authorizing:github') return;
      window.opener.postMessage(data.message, event.origin);
    });
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body></html>`);
}

export default function authRoutes({ corsOrigins = [] } = {}) {
  const router = Router();
  const allowedOrigins = (process.env.CMS_ORIGINS
    ? process.env.CMS_ORIGINS.split(',')
    : [...LIVE_ORIGINS, ...corsOrigins]
  )
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  const repo = process.env.GITHUB_REPO || DEFAULT_REPO;
  const configured = () => Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
  const fail = (res, error) => handshakePage(res, { allowedOrigins, status: 'error', content: { error } });

  router.get('/auth', authLimiter, (req, res) => {
    if (req.query.provider && req.query.provider !== 'github') return fail(res, 'Only GitHub sign-in is supported.');
    if (!configured()) {
      return fail(res, 'Blog admin sign-in is not set up yet: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are missing on the server.');
    }

    const state = crypto.randomBytes(24).toString('hex');
    res.cookie(STATE_COOKIE, state, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 10 * 60 * 1000,
    });
    // A private repo needs `repo`; the CMS asks for it by default.
    const scope = req.query.scope === 'public_repo' ? 'public_repo' : 'repo';
    const url = new URL('https://github.com/login/oauth/authorize');
    url.search = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: callbackUrl(req),
      scope,
      state,
      allow_signup: 'false',
    }).toString();
    return res.redirect(url.toString());
  });

  router.get('/auth/callback', authLimiter, async (req, res) => {
    const expected = readCookie(req, STATE_COOKIE);
    res.clearCookie(STATE_COOKIE, { path: '/api/auth' });
    if (req.query.error) return fail(res, `GitHub sign-in was cancelled (${req.query.error}).`);
    const { code, state } = req.query;
    if (!code || !state || !expected || state !== expected) {
      return fail(res, 'Sign-in expired or was started elsewhere. Close this window and try again.');
    }
    if (!configured()) return fail(res, 'Blog admin sign-in is not set up on the server.');

    try {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: callbackUrl(req),
        }),
      });
      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) {
        return fail(res, `GitHub did not return a token (${tokenData.error || tokenResponse.status}).`);
      }

      // Only people who can push to the repo may use the admin. GitHub would
      // refuse their commits anyway; this stops them at the door instead.
      const repoResponse = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'smc-blog-admin',
        },
      });
      const repoData = repoResponse.ok ? await repoResponse.json() : null;
      if (!repoData?.permissions?.push) {
        return fail(
          res,
          'Your GitHub account does not have write access to the website repository. Ask the site owner to add you as a collaborator.'
        );
      }

      return handshakePage(res, {
        allowedOrigins,
        status: 'success',
        content: { token: tokenData.access_token, provider: 'github' },
      });
    } catch (err) {
      console.error('[auth] GitHub sign-in failed:', err.message);
      return fail(res, 'Could not reach GitHub. Please try again.');
    }
  });

  return router;
}
