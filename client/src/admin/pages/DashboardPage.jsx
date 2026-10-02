import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDateTime } from '../api.js';
import { Notice, PageHead } from '../components.jsx';
import { useAdmin } from '../AdminApp.jsx';

function DeployCard({ deploy }) {
  let body;
  if (!deploy.configured) body = <p className="admin-muted">The deploy hook is not set up on the server (VERCEL_DEPLOY_HOOK_URL).</p>;
  else if (deploy.pending) body = <p>A deploy is scheduled — it starts about a minute after the last change.</p>;
  else if (!deploy.at) body = <p className="admin-muted">No deploy triggered yet.</p>;
  else {
    body = (
      <>
        <p className="admin-stat__value admin-stat__value--small">{formatDateTime(deploy.at)}</p>
        <p className="admin-muted">
          {deploy.ok ? 'Triggered' : `Failed: ${deploy.error}`} — {deploy.reason}
        </p>
      </>
    );
  }
  return (
    <div className="admin-card admin-stat">
      <p className="admin-stat__label">Last deploy triggered</p>
      {body}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAdmin();
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
            <DeployCard deploy={data.deploy} />
          </div>

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
