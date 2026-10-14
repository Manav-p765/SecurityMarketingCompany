import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { ACCEPT_IMAGES, Field, Notice, PageHead, uploadImage } from '../components.jsx';

const EMPTY = { name: '', role: '', bio: '', photo: null, linkedinUrl: '', xUrl: '', websiteUrl: '' };
const BIO_MAX = 600;

const pick = (author) => Object.fromEntries(Object.keys(EMPTY).map((key) => [key, author[key] ?? EMPTY[key]]));

/** "Jane Doe" -> "JD" (same as the site's avatar fallback). */
const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

export function Avatar({ author, size = 40 }) {
  return (
    <span className="admin-avatar" style={{ width: size, height: size }} aria-hidden="true">
      {author.photo?.url ? <img src={author.photo.url} alt="" /> : initials(author.name || '?')}
    </span>
  );
}

/** Square photo upload, previewed as a circle like on the site. */
function PhotoField({ value, name, onChange }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pickFile = async (file) => {
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const image = await uploadImage(file, { square: true });
      onChange({ url: image.url, publicId: image.publicId });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <Field
      label="Photo (optional)"
      htmlFor="author-photo"
      hint="JPG, PNG or WebP, up to 5 MB. Cropped to a square and shown as a circle. Without one, the initials are shown."
      error={error}
    >
      <div className="admin-photo">
        <Avatar author={{ name, photo: value }} size={88} />
        <div className="admin-cover__actions">
          <input
            ref={input}
            id="author-photo"
            type="file"
            accept={ACCEPT_IMAGES}
            hidden
            onChange={(event) => pickFile(event.target.files?.[0])}
          />
          <button type="button" className="admin-btn" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? 'Uploading…' : value?.url ? 'Replace photo' : 'Upload photo'}
          </button>
          {value?.url && (
            <button type="button" className="admin-btn admin-btn--ghost" disabled={busy} onClick={() => onChange(null)}>
              Remove
            </button>
          )}
        </div>
      </div>
    </Field>
  );
}

/** Create / edit form. `author` is null for a new author. */
function AuthorForm({ author, onSaved, onCancel }) {
  const [form, setForm] = useState(author ? pick(author) : EMPTY);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const change = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { author: saved } = author
        ? await api(`/authors/${author.id}`, { method: 'PUT', body: form })
        : await api('/authors', { method: 'POST', body: form });
      onSaved(saved, author ? `Saved ${saved.name}.${author.published ? ' The blog updates in about 2–3 minutes.' : ''}` : `Added ${saved.name}.`);
    } catch (err) {
      setErrors(err.errors || {});
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-card admin-author-form" onSubmit={save} noValidate>
      <div className="admin-card__head">
        <h2>{author ? `Edit ${author.name}` : 'New author'}</h2>
      </div>
      {error && <p className="admin-error">{error}</p>}
      <PhotoField value={form.photo} name={form.name} onChange={(value) => change('photo', value)} />
      <Field label="Name" htmlFor="author-name" error={errors.name}>
        <input id="author-name" value={form.name} onChange={(e) => change('name', e.target.value)} placeholder="e.g. Jane Doe" />
      </Field>
      <Field label="Role or title" htmlFor="author-role" error={errors.role} hint="Shown under the name, e.g. Head of SEO.">
        <input id="author-role" value={form.role} onChange={(e) => change('role', e.target.value)} />
      </Field>
      <Field
        label="Bio"
        htmlFor="author-bio"
        error={errors.bio}
        count={form.bio.length}
        max={BIO_MAX}
        hint="Plain text, two to four sentences: who they are and what they know about security marketing."
      >
        <textarea id="author-bio" rows={5} value={form.bio} onChange={(e) => change('bio', e.target.value)} />
      </Field>
      <Field label="LinkedIn (optional)" htmlFor="author-linkedin" error={errors.linkedinUrl}>
        <input
          id="author-linkedin"
          type="url"
          value={form.linkedinUrl}
          onChange={(e) => change('linkedinUrl', e.target.value)}
          placeholder="https://www.linkedin.com/in/…"
        />
      </Field>
      <Field label="X (optional)" htmlFor="author-x" error={errors.xUrl}>
        <input id="author-x" type="url" value={form.xUrl} onChange={(e) => change('xUrl', e.target.value)} placeholder="https://x.com/…" />
      </Field>
      <Field label="Website (optional)" htmlFor="author-website" error={errors.websiteUrl}>
        <input
          id="author-website"
          type="url"
          value={form.websiteUrl}
          onChange={(e) => change('websiteUrl', e.target.value)}
          placeholder="https://…"
        />
      </Field>
      <div className="admin-head__actions">
        <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
          {saving ? 'Saving…' : author ? 'Save author' : 'Add author'}
        </button>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/**
 * One author's table row. Delete asks first. An author with posts cannot
 * simply be deleted: a row below opens where the admin picks who takes over
 * their posts, then deletes.
 */
function AuthorRows({ author, authors, selected, onEdit, onDeleted, onError }) {
  const [moving, setMoving] = useState(false);
  const others = authors.filter((other) => other.id !== author.id);
  const [target, setTarget] = useState(() => (others.find((other) => other.isTeam) ?? others[0])?.id ?? '');

  const remove = async (reassignTo) => {
    try {
      const query = reassignTo ? `?reassignTo=${encodeURIComponent(reassignTo)}` : '';
      const { moved } = await api(`/authors/${author.id}${query}`, { method: 'DELETE' });
      const to = others.find((other) => other.id === reassignTo);
      onDeleted(`Deleted ${author.name}.${moved ? ` ${moved} post${moved === 1 ? '' : 's'} moved to ${to?.name}.` : ''}`);
    } catch (err) {
      onError(err.message);
    }
  };

  const plural = author.posts === 1 ? '' : 's';

  return (
    <>
      <tr className={selected ? 'is-selected' : undefined}>
        <td>
          <div className="admin-author-cell">
            <Avatar author={author} />
            <div>
              <span className="admin-table__title">{author.name}</span>
              <small className="admin-muted">
                {author.role || 'No role set'}
                {author.isTeam && ' · default author'}
              </small>
            </div>
          </div>
        </td>
        <td className="admin-nowrap">
          {author.posts}
          {author.posts > 0 && <small className="admin-muted"> ({author.published} live)</small>}
        </td>
        <td className="admin-table__actions">
          {author.published > 0 && (
            <a
              className="admin-btn admin-btn--small admin-btn--ghost"
              href={`/blog/author/${author.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View ↗
            </a>
          )}
          <button type="button" className="admin-btn admin-btn--small" onClick={onEdit}>
            Edit
          </button>
          {!author.isTeam && (
            <button
              type="button"
              className="admin-btn admin-btn--small admin-btn--danger"
              title={author.posts ? `${author.name} has posts. Move them to another author to delete.` : undefined}
              disabled={moving}
              onClick={() => {
                if (author.posts) setMoving(true);
                else if (window.confirm(`Delete ${author.name}? This cannot be undone.`)) remove(null);
              }}
            >
              {author.posts ? 'Delete…' : 'Delete'}
            </button>
          )}
        </td>
      </tr>
      {moving && (
        <tr className="admin-reassign-row">
          <td colSpan={3}>
            <form
              className="admin-inline-form"
              onSubmit={(event) => {
                event.preventDefault();
                const to = others.find((other) => other.id === target);
                if (to && window.confirm(`Move ${author.posts} post${plural} to ${to.name} and delete ${author.name}?`)) {
                  remove(target);
                }
              }}
            >
              <label htmlFor={`reassign-${author.id}`}>
                {author.name} has {author.posts} post{plural}. Move them to
              </label>
              <select id={`reassign-${author.id}`} value={target} onChange={(e) => setTarget(e.target.value)}>
                {others.map((other) => (
                  <option key={other.id} value={other.id}>
                    {other.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="admin-btn admin-btn--small admin-btn--danger" disabled={!target}>
                Move posts &amp; delete
              </button>
              <button type="button" className="admin-btn admin-btn--small admin-btn--ghost" onClick={() => setMoving(false)}>
                Cancel
              </button>
            </form>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [editing, setEditing] = useState(null); // null: closed, 'new', or an author
  const [notice, setNotice] = useState({ kind: 'info', text: '' });

  const load = useCallback(() => {
    api('/authors')
      .then((data) => setAuthors(data.authors))
      .catch((err) => setNotice({ kind: 'error', text: err.message }));
  }, []);
  useEffect(load, [load]);

  return (
    <>
      <PageHead title="Authors">
        <button type="button" className="admin-btn admin-btn--primary" onClick={() => setEditing('new')}>
          New author
        </button>
      </PageHead>
      <Notice kind={notice.kind} onClose={() => setNotice({ kind: 'info', text: '' })}>
        {notice.text}
      </Notice>

      <div className={`admin-split${editing ? ' has-detail' : ''}`}>
        <div className="admin-card admin-card--flush">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Posts</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <AuthorRows
                  key={`${author.id}-${author.posts}`}
                  author={author}
                  authors={authors}
                  selected={editing?.id === author.id}
                  onEdit={() => setEditing(author)}
                  onDeleted={(text) => {
                    setNotice({ kind: 'success', text });
                    if (editing?.id === author.id) setEditing(null);
                    load();
                  }}
                  onError={(text) => setNotice({ kind: 'error', text })}
                />
              ))}
            </tbody>
          </table>
          <p className="admin-hint admin-card__foot">
            Every post shows its author&apos;s bio, and each author with a published post gets a page on the blog. An
            author with posts can only be deleted after moving those posts to someone else. The team author is the
            default for posts and cannot be deleted.
          </p>
        </div>

        {editing && (
          <AuthorForm
            key={editing === 'new' ? 'new' : editing.id}
            author={editing === 'new' ? null : editing}
            onCancel={() => setEditing(null)}
            onSaved={(_saved, text) => {
              setNotice({ kind: 'success', text });
              setEditing(null);
              load();
            }}
          />
        )}
      </div>
    </>
  );
}
