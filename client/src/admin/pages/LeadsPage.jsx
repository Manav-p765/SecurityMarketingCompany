import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, formatDateTime } from '../api.js';
import { Notice, PageHead, Pager } from '../components.jsx';

function LeadDetail({ id, onClose }) {
  const [lead, setLead] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api(`/leads/${id}`)
      .then((data) => setLead(data.lead))
      .catch((err) => setError(err.message));
  }, [id]);
  return (
    <aside className="admin-card admin-lead" aria-label="Lead details">
      <div className="admin-card__head">
        <h2>{lead?.name || 'Lead'}</h2>
        <button type="button" className="admin-btn admin-btn--small admin-btn--ghost" onClick={onClose}>
          Close
        </button>
      </div>
      <Notice kind="error">{error}</Notice>
      {lead && (
        <dl className="admin-dl">
          <dt>Received</dt>
          <dd>{formatDateTime(lead.createdAt)}</dd>
          <dt>Company</dt>
          <dd>{lead.company}</dd>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${lead.email}`}>{lead.email}</a>
          </dd>
          <dt>Service</dt>
          <dd>{lead.service}</dd>
          <dt>Message</dt>
          <dd className="admin-lead__message">{lead.message || <span className="admin-muted">No message.</span>}</dd>
        </dl>
      )}
    </aside>
  );
}

export default function LeadsPage() {
  const [params, setParams] = useSearchParams();
  const filters = { search: params.get('search') || '', from: params.get('from') || '', to: params.get('to') || '' };
  const page = Number(params.get('page')) || 1;
  const open = params.get('open');
  const [form, setForm] = useState(filters);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const query = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))).toString();

  useEffect(() => {
    api(`/leads?${query}${query ? '&' : ''}page=${page}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [query, page]);

  const setParam = (next) => {
    const merged = { ...filters, page: String(page), ...(open && { open }), ...next };
    const clean = {};
    for (const [key, value] of Object.entries(merged)) {
      if (value && !(key === 'page' && value === '1')) clean[key] = value;
    }
    setParams(clean);
  };

  return (
    <>
      <PageHead title="Leads">
        <a className="admin-btn" href={`/api/admin/leads/export.csv${query ? `?${query}` : ''}`}>
          Export CSV
        </a>
      </PageHead>
      <Notice kind="error">{error}</Notice>

      <form
        className="admin-filters"
        onSubmit={(event) => {
          event.preventDefault();
          setParam({ ...form, page: '' });
        }}
      >
        <input
          type="search"
          aria-label="Search leads"
          placeholder="Search name, company, email, message…"
          value={form.search}
          onChange={(e) => setForm({ ...form, search: e.target.value })}
        />
        <label>
          From <input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
        </label>
        <label>
          To <input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
        </label>
        <button type="submit" className="admin-btn">
          Filter
        </button>
        {(filters.search || filters.from || filters.to) && (
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => {
              setForm({ search: '', from: '', to: '' });
              setParams({});
            }}
          >
            Clear
          </button>
        )}
      </form>

      <div className={`admin-split${open ? ' has-detail' : ''}`}>
        <div className="admin-card admin-card--flush">
          {data &&
            (data.leads.length === 0 ? (
              <p className="admin-empty">No leads found.</p>
            ) : (
              <table className="admin-table admin-table--clickable">
                <thead>
                  <tr>
                    <th>Received</th>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Service</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leads.map((lead) => (
                    <tr key={lead.id} className={open === lead.id ? 'is-selected' : undefined}>
                      <td>{formatDateTime(lead.createdAt)}</td>
                      <td>
                        <button type="button" className="admin-linkbutton" onClick={() => setParam({ open: lead.id })}>
                          {lead.name}
                        </button>
                      </td>
                      <td>{lead.company}</td>
                      <td>{lead.email}</td>
                      <td>{lead.service}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          {data && <p className="admin-hint admin-card__foot">{data.total} lead{data.total === 1 ? '' : 's'}</p>}
        </div>
        {open && <LeadDetail id={open} onClose={() => setParam({ open: '' })} />}
      </div>
      {data && <Pager page={data.page} pages={data.pages} onPage={(p) => setParam({ page: String(p) })} />}
    </>
  );
}
