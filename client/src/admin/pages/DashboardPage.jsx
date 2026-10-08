import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDateTime } from '../api.js';
import { Notice, PageHead } from '../components.jsx';
import { useAdmin } from '../AdminApp.jsx';

/** Last deploy, with a "Rebuild site now" button for admins. */
function DeployCard({ deploy, isAdmin, onRebuilt }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const rebuild = async () => {
    setBusy(true);
    setResult(null);
    try {
      const data = await api('/deploy', { method: 'POST' });
      setResult({ kind: 'success', text: data.message });
      onRebuilt(data.deploy);
    } catch (err) {
      setResult({ kind: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const failed = Boolean(deploy.problem || (deploy.at && !deploy.ok));
  let body;
  if (!deploy.configured) body = <p className="admin-muted">The deploy hook is not set up on the server (VERCEL_DEPLOY_HOOK_URL).</p>;
  else if (deploy.pending) body = <p>A deploy is scheduled — it starts about a minute after the last change.</p>;
  else if (!deploy.at) body = <p className="admin-muted">No deploy triggered yet.</p>;
  else {
    body = (
      <>
        <p className="admin-stat__value admin-stat__value--small">{formatDateTime(deploy.at)}</p>
        <p className={deploy.ok ? 'admin-muted' : 'admin-error'}>
          {deploy.ok ? 'Triggered' : `Failed: ${deploy.error}`}
        </p>
        <p className="admin-muted admin-deploy__reason">{deploy.reason}</p>
      </>
    );
  }
  return (
    <div className={`admin-card admin-stat${failed ? ' admin-stat--failed' : ''}`}>
      <p className="admin-stat__label">Last deploy triggered</p>
      {body}
      {deploy.problem && deploy.configured && <p className="admin-error">{deploy.problem}</p>}
      {failed && !isAdmin && <p className="admin-muted">Published changes may not be on the website yet. Please tell an admin.</p>}
      {isAdmin && (
        <button type="button" className={`admin-btn${failed ? ' admin-btn--primary' : ''} admin-deploy__btn`} disabled={busy} onClick={rebuild}>
          {busy ? 'Starting…' : 'Rebuild site now'}
        </button>
      )}
      {result && <p className={result.kind === 'error' ? 'admin-error' : 'admin-hint'}>{result.text}</p>}
    </div>
  );
}

const CHECKS = [
  ['database', 'Database'],
  ['cloudinary', 'Image uploads (Cloudinary)'],
  ['deployHook', 'Site rebuilds (Vercel deploy hook)'],
];

/** Admin only: are the services the blog depends on configured and answering? */
function HealthPanel() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api('/health')
      .then(setHealth)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  return (
    <section className="admin-card">
      <div className="admin-card__head">
        <h2>System status</h2>
        <button type="button" className="admin-btn admin-btn--ghost" disabled={loading} onClick={load}>
          {loading ? 'Checking…' : 'Check again'}
        </button>
      </div>
      {error && <p className="admin-error">{error}</p>}
      {health && (
        <ul className="admin-health">
          {CHECKS.map(([key, label]) => {
            const check = health[key];
            return (
              <li key={key}>
                <span className={`admin-health__dot${check.ok ? ' is-ok' : ''}`} aria-hidden="true" />
                <span>
                  <b>{label}</b> — {check.ok ? 'OK' : check.configured === false ? 'Not configured' : 'Problem'}
                  {!check.ok && check.error && <span className="admin-health__detail">{check.error}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function DashboardPage() {
  const { user } = useAdmin();
  const isAdmin = user.role === 'admin';
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/dashboard')
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <PageHead title={`Welcome, ${user.name.split(' ')[0]}`}>
        <Link className="admin-btn admin-btn--primary" to="/admin/posts/new">
          New post
        </Link>
      </PageHead>
      <Notice kind="error">{error}</Notice>
      {data && (
        <>
          <div className="admin-stats">
            <Link className="admin-card admin-stat" to="/admin/posts?status=published">
              <p className="admin-stat__label">Published posts</p>
              <p className="admin-stat__value">{data.posts.published}</p>
            </Link>
            <Link className="admin-card admin-stat" to="/admin/posts?status=draft">
              <p className="admin-stat__label">Drafts</p>
              <p className="admin-stat__value">{data.posts.drafts}</p>
            </Link>
            <DeployCard deploy={data.deploy} isAdmin={isAdmin} onRebuilt={(deploy) => setData((prev) => ({ ...prev, deploy }))} />
          </div>

          {isAdmin && <HealthPanel />}

          {data.latestLeads && (
            <section className="admin-card">
              <div className="admin-card__head">
                <h2>Latest leads</h2>
                <Link to="/admin/leads">All leads →</Link>
              </div>
              {data.latestLeads.length === 0 ? (
                <p className="admin-muted">No leads yet.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Received</th>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Service</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.latestLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{formatDateTime(lead.createdAt)}</td>
                        <td>
                          <Link to={`/admin/leads?open=${lead.id}`}>{lead.name}</Link>
                        </td>
                        <td>{lead.company}</td>
                        <td>{lead.service}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}
        </>
      )}
    </>
  );
}
