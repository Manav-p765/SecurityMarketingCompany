import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { ConfirmButton, Notice, PageHead } from '../components.jsx';

function CategoryRow({ category, onSaved, onError }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [error, setError] = useState('');

  const rename = async (event) => {
    event.preventDefault();
    try {
      await api(`/categories/${category.id}`, { method: 'PUT', body: { name } });
      setEditing(false);
      setError('');
      onSaved(`Renamed to "${name}".${category.posts ? ' Posts using it were updated.' : ''}`);
    } catch (err) {
      setError(err.errors?.name || err.message);
    }
  };

  const remove = async () => {
    try {
      await api(`/categories/${category.id}`, { method: 'DELETE' });
      onSaved(`Deleted "${category.name}".`);
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <tr>
      <td>
        {editing ? (
          <form className="admin-inline-form" onSubmit={rename}>
            <input aria-label="Category name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            <button type="submit" className="admin-btn admin-btn--small admin-btn--primary">
              Save
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--small admin-btn--ghost"
              onClick={() => {
                setEditing(false);
                setName(category.name);
                setError('');
              }}
            >
              Cancel
            </button>
            {error && <span className="admin-error">{error}</span>}
          </form>
        ) : (
          category.name
        )}
      </td>
      <td>{category.posts}</td>
      <td className="admin-table__actions">
        {!editing && (
          <button type="button" className="admin-btn admin-btn--small" onClick={() => setEditing(true)}>
            Rename
          </button>
        )}
        <ConfirmButton
          className="admin-btn admin-btn--small admin-btn--danger"
          disabled={category.posts > 0}
          message={`Delete the category "${category.name}"?`}
          onConfirm={remove}
        >
          Delete
        </ConfirmButton>
      </td>
    </tr>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState({ kind: 'info', text: '' });

  const load = useCallback(() => {
    api('/categories')
      .then((data) => setCategories(data.categories))
      .catch((err) => setNotice({ kind: 'error', text: err.message }));
  }, []);
  useEffect(load, [load]);

  const add = async (event) => {
    event.preventDefault();
    try {
      await api('/categories', { method: 'POST', body: { name } });
      setNotice({ kind: 'success', text: `Added "${name.trim()}".` });
      setName('');
      setError('');
      load();
    } catch (err) {
      setError(err.errors?.name || err.message);
    }
  };

  return (
    <>
      <PageHead title="Categories" />
      <Notice kind={notice.kind} onClose={() => setNotice({ kind: 'info', text: '' })}>
        {notice.text}
      </Notice>
      <form className="admin-card admin-inline-form" onSubmit={add}>
        <label htmlFor="new-category">New category</label>
        <input id="new-category" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Paid Ads" />
        <button type="submit" className="admin-btn admin-btn--primary" disabled={!name.trim()}>
          Add
        </button>
        {error && <span className="admin-error">{error}</span>}
      </form>
      <div className="admin-card admin-card--flush">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Posts</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onSaved={(text) => {
                  setNotice({ kind: 'success', text });
                  load();
                }}
                onError={(text) => setNotice({ kind: 'error', text })}
              />
            ))}
          </tbody>
        </table>
        <p className="admin-hint admin-card__foot">
          A category that is used by posts cannot be deleted — move those posts to another category first. A
          category appears on the blog once a published post uses it.
        </p>
      </div>
    </>
  );
}
