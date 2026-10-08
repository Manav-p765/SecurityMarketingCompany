import { useRef, useState } from 'react';
import { api } from './api.js';

/** Page heading row with optional actions on the right. */
export function PageHead({ title, children }) {
  return (
    <header className="admin-head">
      <h1>{title}</h1>
      {children && <div className="admin-head__actions">{children}</div>}
    </header>
  );
}

/** Success / error banner. */
export function Notice({ kind = 'info', children, onClose }) {
  if (!children) return null;
  return (
    <div className={`admin-notice admin-notice--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <span>{children}</span>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}

/** Labelled form field with an optional hint, counter and error. */
export function Field({ label, htmlFor, hint, error, count, max, recommended, children }) {
  const over = typeof count === 'number' && ((max && count > max) || (recommended && count > recommended));
  return (
    <div className={`admin-field${error ? ' has-error' : ''}`}>
      <div className="admin-field__top">
        <label htmlFor={htmlFor}>{label}</label>
        {typeof count === 'number' && (
          <span className={`admin-count${over ? ' is-over' : ''}`}>
            {count}
            {recommended ? ` / ${recommended} recommended` : max ? ` / ${max}` : ''}
          </span>
        )}
      </div>
      {children}
      {hint && !error && <p className="admin-hint">{hint}</p>}
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}

export function StatusBadge({ status }) {
  return <span className={`admin-badge admin-badge--${status}`}>{status === 'published' ? 'Published' : 'Draft'}</span>;
}

/** A delete button that asks first. */
export function ConfirmButton({ children, message, onConfirm, className = 'admin-btn admin-btn--danger', disabled }) {
  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={() => {
        if (window.confirm(message)) onConfirm();
      }}
    >
      {children}
    </button>
  );
}

export const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp';
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Uploads one image to /api/admin/uploads; resolves { url, publicId }.
 * Errors carry the server's reason; a reply without one (e.g. the proxy's
 * own 413 or 504 page) gets a reason from its status.
 */
export async function uploadImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Only JPG, PNG or WebP images are allowed.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`Image is larger than 5 MB (this one is ${(file.size / 1024 / 1024).toFixed(1)} MB). Use a smaller image.`);
  }
  const form = new FormData();
  form.append('image', file);
  try {
    const { image } = await api('/uploads', { method: 'POST', form });
    return image;
  } catch (err) {
    if (!/^Something went wrong \(/.test(err.message)) throw err;
    if (err.status === 413) throw new Error('Image is larger than the server accepts. Use an image under 5 MB.');
    if (err.status >= 502) throw new Error('The server did not respond in time (it may be starting up). Wait a minute and try again.');
    throw err;
  }
}

/** Cover image picker with preview. `value` is { url, publicId } or null. */
export function CoverImageField({ value, onChange }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (file) => {
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const image = await uploadImage(file);
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
      label="Cover image (optional)"
      htmlFor="cover-image"
      hint="JPG, PNG or WebP, up to 5 MB. A wide image works best (16:9). Without one, the post gets a generated graphic."
      error={error}
    >
      <div className="admin-cover">
        {value?.url ? (
          <img src={value.url} alt="Cover preview" />
        ) : (
          <div className="admin-cover__empty">No cover image</div>
        )}
        <div className="admin-cover__actions">
          <input
            ref={input}
            id="cover-image"
            type="file"
            accept={ACCEPT_IMAGES}
            hidden
            onChange={(event) => pick(event.target.files?.[0])}
          />
          <button type="button" className="admin-btn" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? 'Uploading…' : value?.url ? 'Replace image' : 'Upload image'}
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

/** Simple pager. */
export function Pager({ page, pages, onPage }) {
  if (pages <= 1) return null;
  return (
    <nav className="admin-pager" aria-label="Pages">
      <button type="button" className="admin-btn admin-btn--ghost" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </button>
      <span>
        Page {page} of {pages}
      </span>
      <button type="button" className="admin-btn admin-btn--ghost" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        Next
      </button>
    </nav>
  );
}
