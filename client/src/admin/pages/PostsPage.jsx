import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, formatDay } from '../api.js';
import { ConfirmButton, Notice, PageHead, Pager, StatusBadge } from '../components.jsx';

export default function PostsPage() {
  const [params, setParams] = useSearchParams();
  const status = params.get('status') || '';
  const search = params.get('search') || '';
  const page = Number(params.get('page')) || 1;
  const [query, setQuery] = useState(search);
  const [data, setData] = useState(null);
  const [notice, setNotice] = useState({ kind: 'info', text: '' });

  /** Updates the URL's filters (empty values and page 1 are left out). */
  const update = (next) => {
    const merged = { status, search, page: String(page), ...next };
    const clean = {};
    for (const [key, value] of Object.entries(merged)) {
      if (value && !(key === 'page' && value === '1')) clean[key] = value;
    }
    setParams(clean);
  };

  const load = useCallback(() => {
    const qs = new URLSearchParams({ ...(status && { status }), ...(search && { search }), page: String(page) });
    api(`/posts?${qs}`)
      .then(setData)
      .catch((err) => setNotice({ kind: 'error', text: err.message }));
  }, [status, search, page]);

  useEffect(load, [load]);

  const remove = async (post) => {
    try {
      await api(`/posts/${post.id}`, { method: 'DELETE' });
      setNotice({
        kind: 'success',
        text:
          post.status === 'published'
            ? `"${post.title}" was deleted. It will disappear from the website in about 2–3 minutes.`
            : `"${post.title}" was deleted.`,
      });
      load();
    } catch (err) {
      setNotice({ kind: 'error', text: err.message });
    }
  };

  return (
    <>
      <PageHead title="Blog posts">
        <Link className="admin-btn admin-btn--primary" to="/admin/posts/new">
          New post
        </Link>
      </PageHead>
      <Notice kind={notice.kind} onClose={() => setNotice({ kind: 'info', text: '' })}>
        {notice.text}
      </Notice>

      <form
        className="admin-filters"
        onSubmit={(event) => {
          event.preventDefault();
          update({ search: query.trim(), page: '' });
        }}
      >
        <input
          type="search"
          placeholder="Search titles, excerpts, categories…"
          aria-label="Search posts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select aria-label="Status" value={status} onChange={(e) => update({ status: e.target.value, page: '' })}>
          <option value="">All posts</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <button type="submit" className="admin-btn">
          Search
        </button>
      </form>

      {data && (
        <div className="admin-card admin-card--flush">
          {data.posts.length === 0 ? (
            <p className="admin-empty">No posts found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {data.posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <Link className="admin-table__title" to={`/admin/posts/${post.id}`}>
                        {post.title}
                      </Link>
                      <small className="admin-muted">/blog/{post.slug}</small>
                    </td>
                    <td>
                      <StatusBadge status={post.status} />
                    </td>
                    <td>{post.category || '—'}</td>
                    <td>
                      {post.status === 'published' ? formatDay(post.publishedAt) : `Edited ${formatDay(post.updatedAt)}`}
                    </td>
                    <td className="admin-table__actions">
                      <Link className="admin-btn admin-btn--small" to={`/admin/posts/${post.id}`}>
                        Edit
                      </Link>
                      {post.status === 'published' && (
                        <a className="admin-btn admin-btn--small admin-btn--ghost" href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                          View live
                        </a>
                      )}
                      <ConfirmButton
                        className="admin-btn admin-btn--small admin-btn--danger"
                        message={`Delete "${post.title}"? This cannot be undone.`}
                        onConfirm={() => remove(post)}
                      >
                        Delete
                      </ConfirmButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {data && <Pager page={data.page} pages={data.pages} onPage={(p) => update({ page: String(p) })} />}
    </>
  );
}
