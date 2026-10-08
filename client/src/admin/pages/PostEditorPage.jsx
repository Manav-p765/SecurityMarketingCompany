import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { api, formatDateTime, slugify } from '../api.js';
import { ConfirmButton, CoverImageField, Field, Notice, PageHead, StatusBadge } from '../components.jsx';
import RichEditor from '../RichEditor.jsx';
import { useAdmin } from '../AdminApp.jsx';
import { PostArticle } from '../../pages/BlogPostPage.jsx';

const SITE = 'Security Marketing Company';
const AUTOSAVE_MS = 30_000;
const LIVE_SOON = 'about 2–3 minutes';

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  category: '',
  coverImage: null,
  contentHtml: '',
  author: 'Security Marketing Company Team',
  seoTitle: '',
  seoDescription: '',
};

const pick = (post) => Object.fromEntries(Object.keys(EMPTY).map((key) => [key, post[key] ?? EMPTY[key]]));
const today = () => new Date().toISOString().slice(0, 10);
const words = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

/** How the post would look in a Google result. */
function SnippetPreview({ form }) {
  const title = form.seoTitle || `${form.title || 'Post title'} | ${SITE}`;
  const description = form.seoDescription || form.excerpt || 'The excerpt is shown here unless you write an SEO description.';
  return (
    <div className="admin-snippet" aria-label="Google search preview">
      <p className="admin-snippet__url">www.securitymarketingcompany.com › blog › {form.slug || 'post'}</p>
      <p className="admin-snippet__title">{title.length > 60 ? `${title.slice(0, 59)}…` : title}</p>
      <p className="admin-snippet__desc">{description.length > 160 ? `${description.slice(0, 159)}…` : description}</p>
    </div>
  );
}

/** Full-screen preview using the public post styles. */
function Preview({ form, meta, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const date = meta.publishedAt ? meta.publishedAt.slice(0, 10) : today();
  const post = {
    ...form,
    slug: form.slug || 'preview',
    title: form.title || 'Untitled post',
    date,
    updated: date,
    coverImage: form.coverImage?.url || null,
    html: form.contentHtml || '<p><em>No content yet.</em></p>',
    readingTime: Math.max(1, Math.ceil(words(form.contentHtml) / 225)),
    service: null,
  };
  return createPortal(
    <div className="admin-preview" role="dialog" aria-modal="true" aria-label="Post preview">
      <div className="admin-preview__bar">
        <span>Preview — {meta.status === 'published' ? 'unsaved changes are not live yet' : 'not published'}</span>
        <button type="button" className="admin-btn admin-btn--primary" onClick={onClose}>
          Close preview
        </button>
      </div>
      <div className="page detail-page admin-preview__page">
        <PostArticle post={post} />
      </div>
    </div>,
    document.body
  );
}

export default function PostEditorPage() {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const { setDirty: setGlobalDirty } = useAdmin();

  const [id, setId] = useState(routeId || null);
  const [form, setForm] = useState(EMPTY);
  const [meta, setMeta] = useState({ status: 'draft', slugLocked: false, publishedAt: null, updatedAt: null });
  const [loaded, setLoaded] = useState(!routeId);
  const [editorKey, setEditorKey] = useState(routeId || 'new');
  const [slugTouched, setSlugTouched] = useState(Boolean(routeId));
  const [dirty, setDirtyState] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState({ kind: 'info', text: '' });
  const [savedAt, setSavedAt] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const createdId = useRef(null);

  const setDirty = useCallback(
    (value) => {
      setDirtyState(value);
      setGlobalDirty(value);
    },
    [setGlobalDirty]
  );

  useEffect(() => () => setGlobalDirty(false), [setGlobalDirty]);

  useEffect(() => {
    api('/categories')
      .then((data) => setCategories(data.categories))
      .catch(() => {});
  }, []);

  // Load the post for /admin/posts/:id; reset for /admin/posts/new.
  useEffect(() => {
    if (routeId && routeId === createdId.current) return; // just created here
    setErrors({});
    setNotice({ kind: 'info', text: '' });
    setDirty(false);
    if (!routeId) {
      setId(null);
      setForm(EMPTY);
      setMeta({ status: 'draft', slugLocked: false, publishedAt: null, updatedAt: null });
      setSlugTouched(false);
      setEditorKey(`new-${Date.now()}`);
      setLoaded(true);
      return;
    }
    setLoaded(false);
    api(`/posts/${routeId}`)
      .then(({ post }) => {
        setId(post.id);
        setForm(pick(post));
        setMeta({ status: post.status, slugLocked: post.slugLocked, publishedAt: post.publishedAt, updatedAt: post.updatedAt });
        setSlugTouched(true);
        setEditorKey(post.id);
        setLoaded(true);
      })
      .catch((err) => setNotice({ kind: 'error', text: err.message }));
  }, [routeId, setDirty]);

  // Warn before closing or reloading the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const change = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && !meta.slugLocked && !slugTouched) next.slug = slugify(value);
      return next;
    });
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    setDirty(true);
  };

  /** Saves the form. Resolves the saved post, or null on failure. */
  const save = useCallback(
    async ({ silent = false } = {}) => {
      setSaving(true);
      try {
        const body = { ...form };
        if (meta.slugLocked) delete body.slug;
        const { post } = id
          ? await api(`/posts/${id}`, { method: 'PUT', body })
          : await api('/posts', { method: 'POST', body });
        if (!id) {
          createdId.current = post.id;
          setId(post.id);
          navigate(`/admin/posts/${post.id}`, { replace: true });
        }
        setForm((prev) => ({ ...prev, slug: post.slug, contentHtml: prev.contentHtml }));
        setMeta({ status: post.status, slugLocked: post.slugLocked, publishedAt: post.publishedAt, updatedAt: post.updatedAt });
        setSlugTouched(true);
        setErrors({});
        setDirty(false);
        setSavedAt(new Date());
        if (!silent) {
          setNotice({
            kind: 'success',
            text: post.status === 'published' ? `Saved. The changes will be live in ${LIVE_SOON}.` : 'Draft saved.',
          });
        }
        return post;
      } catch (err) {
        setErrors(err.errors || {});
        if (!silent || err.status !== 400) setNotice({ kind: 'error', text: err.message });
        return null;
      } finally {
        setSaving(false);
      }
    },
    [form, id, meta.slugLocked, navigate, setDirty]
  );

  // Autosave drafts every 30 seconds while there are unsaved changes.
  const autosaveRef = useRef(null);
  autosaveRef.current = () => {
    if (dirty && !saving && meta.status === 'draft' && form.title.trim()) save({ silent: true });
  };
  useEffect(() => {
    const timer = setInterval(() => autosaveRef.current(), AUTOSAVE_MS);
    return () => clearInterval(timer);
  }, []);

  const publish = async () => {
    const saved = dirty || !id ? await save({ silent: true }) : { id };
    if (!saved) return;
    try {
      const { post } = await api(`/posts/${saved.id}/publish`, { method: 'POST' });
      setMeta({ status: post.status, slugLocked: post.slugLocked, publishedAt: post.publishedAt, updatedAt: post.updatedAt });
      setNotice({ kind: 'success', text: `Published. The post will be live in ${LIVE_SOON}.` });
    } catch (err) {
      setErrors(err.errors || {});
      setNotice({ kind: 'error', text: err.message });
    }
  };

  const unpublish = async () => {
    if (!window.confirm('Unpublish this post? It will be removed from the website and kept as a draft.')) return;
    if (dirty && !(await save({ silent: true }))) return;
    try {
      const { post } = await api(`/posts/${id}/unpublish`, { method: 'POST' });
      setMeta({ status: post.status, slugLocked: post.slugLocked, publishedAt: post.publishedAt, updatedAt: post.updatedAt });
      setNotice({ kind: 'success', text: `Unpublished. It will be removed from the website in ${LIVE_SOON}.` });
    } catch (err) {
      setNotice({ kind: 'error', text: err.message });
    }
  };

  const remove = async () => {
    try {
      await api(`/posts/${id}`, { method: 'DELETE' });
      setDirty(false);
      navigate('/admin/posts', { replace: true });
    } catch (err) {
      setNotice({ kind: 'error', text: err.message });
    }
  };

  if (!loaded) {
    return (
      <>
        <Notice kind={notice.kind}>{notice.text}</Notice>
        {!notice.text && <p className="admin-muted">Loading…</p>}
      </>
    );
  }

  const published = meta.status === 'published';

  return (
    <>
      <PageHead title={id ? 'Edit post' : 'New post'}>
        <StatusBadge status={meta.status} />
        <span className="admin-muted admin-savestate" aria-live="polite">
          {saving ? 'Saving…' : dirty ? 'Unsaved changes' : savedAt ? `Saved ${formatDateTime(savedAt)}` : ''}
        </span>
        <button type="button" className="admin-btn" onClick={() => setShowPreview(true)}>
          Preview
        </button>
        <button type="button" className="admin-btn" disabled={saving} onClick={() => save()}>
          {published ? 'Save changes' : 'Save draft'}
        </button>
        {published ? (
          <button type="button" className="admin-btn admin-btn--ghost" disabled={saving} onClick={unpublish}>
            Unpublish
          </button>
        ) : (
          <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={publish}>
            Publish
          </button>
        )}
      </PageHead>

      <Notice kind={notice.kind} onClose={() => setNotice({ kind: 'info', text: '' })}>
        {notice.text}
      </Notice>

      <div className="admin-editor-layout">
        <div className="admin-editor-main">
          <div className="admin-card">
            <Field label="Title" htmlFor="post-title" error={errors.title} count={form.title.length} max={200}>
              <input
                id="post-title"
                className="admin-input--title"
                value={form.title}
                onChange={(e) => change('title', e.target.value)}
                placeholder="e.g. How to Win More Commercial Guard Contracts"
              />
            </Field>

            <Field
              label="Web address"
              htmlFor="post-slug"
              error={errors.slug}
              hint={
                meta.slugLocked
                  ? 'Fixed once a post has been published, so links to it keep working.'
                  : 'Made from the title. You can edit it until the post is first published.'
              }
            >
              <div className="admin-slug">
                <span>securitymarketingcompany.com/blog/</span>
                <input
                  id="post-slug"
                  value={form.slug}
                  disabled={meta.slugLocked}
                  onChange={(e) => {
                    setSlugTouched(true);
                    change('slug', slugify(e.target.value, 120));
                  }}
                />
              </div>
            </Field>

            <Field
              label="Excerpt"
              htmlFor="post-excerpt"
              error={errors.excerpt}
              count={form.excerpt.length}
              recommended={160}
              hint="One or two sentences. Shown on the blog page and in Google results (about 160 characters fit)."
            >
              <textarea id="post-excerpt" rows={3} value={form.excerpt} onChange={(e) => change('excerpt', e.target.value)} />
            </Field>
          </div>

          <div className="admin-card">
            <Field label="Article" htmlFor="post-content" error={errors.contentHtml}>
              <RichEditor
                key={editorKey}
                title={form.title}
                initialHtml={form.contentHtml}
                invalid={Boolean(errors.contentHtml)}
                onChange={(html) => change('contentHtml', html)}
              />
            </Field>
            <p className="admin-hint">
              The title is the page's main heading. Start sections with <b>Heading</b>, use <b>Subheading</b> inside a
              section and <b>Small heading</b> below that.
            </p>
          </div>

          <details className="admin-card admin-seo" open={Boolean(form.seoTitle || form.seoDescription)}>
            <summary>Search engine settings (optional)</summary>
            <Field
              label="SEO title"
              htmlFor="post-seo-title"
              error={errors.seoTitle}
              count={form.seoTitle.length}
              recommended={60}
              hint={`Leave empty to use "${form.title || 'Post title'} | ${SITE}".`}
            >
              <input id="post-seo-title" value={form.seoTitle} onChange={(e) => change('seoTitle', e.target.value)} />
            </Field>
            <Field
              label="SEO description"
              htmlFor="post-seo-description"
              error={errors.seoDescription}
              count={form.seoDescription.length}
              recommended={160}
              hint="Leave empty to use the excerpt."
            >
              <textarea id="post-seo-description" rows={3} value={form.seoDescription} onChange={(e) => change('seoDescription', e.target.value)} />
            </Field>
            <p className="admin-label">Google preview</p>
            <SnippetPreview form={form} />
          </details>
        </div>

        <aside className="admin-editor-side">
          <div className="admin-card">
            <Field
              label="Category"
              htmlFor="post-category"
              error={errors.category}
              hint={categories.length ? null : 'No categories yet — an admin can add them under Categories.'}
            >
              <select id="post-category" value={form.category} onChange={(e) => change('category', e.target.value)}>
                <option value="">Choose a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Author" htmlFor="post-author" error={errors.author}>
              <input id="post-author" value={form.author} onChange={(e) => change('author', e.target.value)} />
            </Field>
          </div>

          <div className="admin-card">
            <CoverImageField value={form.coverImage} onChange={(value) => change('coverImage', value)} />
          </div>

          <div className="admin-card admin-postinfo">
            <p>
              Status: <StatusBadge status={meta.status} />
            </p>
            {meta.publishedAt && <p>Published: {formatDateTime(meta.publishedAt)}</p>}
            {meta.updatedAt && <p>Last saved: {formatDateTime(meta.updatedAt)}</p>}
            {meta.status === 'draft' && <p className="admin-muted">Drafts save automatically every 30 seconds.</p>}
            {published && (
              <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer">
                View live post ↗
              </a>
            )}
            {id && (
              <ConfirmButton message={`Delete "${form.title || 'this post'}"? This cannot be undone.`} onConfirm={remove}>
                Delete post
              </ConfirmButton>
            )}
          </div>
        </aside>
      </div>

      {showPreview && <Preview form={form} meta={meta} onClose={() => setShowPreview(false)} />}
    </>
  );
}
