/**
 * The visitor's IP address, for rate limiting.
 *
 * The website calls the API through a Vercel rewrite (/api/* on
 * securitymarketingcompany.com -> this server), so the connection comes from
 * Vercel, not the visitor. Vercel passes the visitor's address in
 * `x-vercel-forwarded-for` / `x-real-ip`; without those (direct calls),
 * Express's req.ip (trust proxy = Render's load balancer) is used.
 * Only used to key rate limits, never for authentication.
 */
export function clientIp(req) {
  const fromVercel = req.get('x-vercel-forwarded-for') || req.get('x-real-ip') || '';
  return fromVercel.split(',')[0].trim() || req.ip;
}

/** Where the client IP came from, without revealing it (shown by /api/health). */
export const ipSource = (req) => (req.get('x-vercel-forwarded-for') || req.get('x-real-ip') ? 'vercel' : 'direct');
