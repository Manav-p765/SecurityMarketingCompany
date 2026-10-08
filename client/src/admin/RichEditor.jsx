import { useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { ACCEPT_IMAGES, uploadImage } from './components.jsx';

/**
 * WYSIWYG editor for the article body (TipTap). Offers only what the
 * server's sanitizer keeps: headings 2–4, paragraphs, bold, italic, lists,
 * quotes, links, images and code. The post title is the page's H1, so the
 * body never has one: the title is shown above the editor, and pasted H1s
 * become H2s. `initialHtml` is read once (remount with a new key to load
 * another post); every change calls onChange(html).
 */

/** h1 → h2 and h5/h6 → h4, so pasted headings keep their place in the outline. */
const fixHeadings = (html) =>
  html.replace(/<(\/?)h1(?=[\s>])/gi, '<$1h2').replace(/<(\/?)h[56](?=[\s>])/gi, '<$1h4');

const sameText = (a, b) => {
  const norm = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  return Boolean(norm(a)) && norm(a) === norm(b);
};
function ToolButton({ label, active, onClick, disabled, children }) {
  return (
    <button
      type="button"
      className={`admin-tool${active ? ' is-active' : ''}`}
      aria-label={label}
      aria-pressed={active ?? undefined}
      title={label}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()} // keep the editor's selection
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function RichEditor({ initialHtml, onChange, invalid, title = '' }) {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        underline: false, // not part of the site's allowed formatting
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Image.configure({ inline: false }),
    ],
    content: fixHeadings(initialHtml || ''),
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: { class: 'prose-text admin-editor__content', 'aria-label': 'Article' },
      transformPastedHTML: fixHeadings,
    },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? '' : e.getHTML()),
  });

  if (!editor) return null;
  const chain = () => editor.chain().focus();

  // The first line repeats the title (common when pasting a whole document).
  const first = editor.state.doc.firstChild;
  const titleRepeated = Boolean(first?.isTextblock && sameText(first.textContent, title));
  const removeFirstLine = () =>
    chain()
      .command(({ tr, state }) => {
        tr.delete(0, state.doc.firstChild.nodeSize);
        return true;
      })
      .run();

  const setLink = () => {
    const previous = editor.getAttributes('link').href || '';
    const url = window.prompt('Link address (leave empty to remove the link):', previous || 'https://');
    if (url === null) return;
    if (!url.trim() || url.trim() === 'https://') chain().extendMarkRange('link').unsetLink().run();
    else chain().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const insertImage = async (file) => {
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const image = await uploadImage(file);
      const alt = window.prompt('Describe the image for people who cannot see it (alt text):', '') ?? '';
      chain().setImage({ src: image.url, alt }).run();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  return (
    <div className={`admin-editor${invalid ? ' has-error' : ''}`}>
      <p className={`admin-editor__title${title.trim() ? '' : ' is-empty'}`} aria-hidden="true">
        <span className="admin-editor__title-tag">Title — the page's main heading (H1)</span>
        {title.trim() || 'Your title appears here'}
      </p>
      <div className="admin-editor__toolbar" role="toolbar" aria-label="Formatting">
        <ToolButton label="Heading (H2): starts a section" active={editor.isActive('heading', { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
          Heading
        </ToolButton>
        <ToolButton label="Subheading (H3): a part of a section" active={editor.isActive('heading', { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
          Subheading
        </ToolButton>
        <ToolButton label="Small heading (H4)" active={editor.isActive('heading', { level: 4 })} onClick={() => chain().toggleHeading({ level: 4 }).run()}>
          Small heading
        </ToolButton>
        <span className="admin-tool__sep" />
        <ToolButton label="Bold" active={editor.isActive('bold')} onClick={() => chain().toggleBold().run()}>
          <b>B</b>
        </ToolButton>
        <ToolButton label="Italic" active={editor.isActive('italic')} onClick={() => chain().toggleItalic().run()}>
          <i>I</i>
        </ToolButton>
        <span className="admin-tool__sep" />
        <ToolButton label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => chain().toggleBulletList().run()}>
          • List
        </ToolButton>
        <ToolButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => chain().toggleOrderedList().run()}>
          1. List
        </ToolButton>
        <ToolButton label="Quote" active={editor.isActive('blockquote')} onClick={() => chain().toggleBlockquote().run()}>
          “ Quote
        </ToolButton>
        <span className="admin-tool__sep" />
        <ToolButton label="Link" active={editor.isActive('link')} onClick={setLink}>
          Link
        </ToolButton>
        <ToolButton label="Insert image" disabled={uploading} onClick={() => fileInput.current?.click()}>
          {uploading ? 'Uploading…' : 'Image'}
        </ToolButton>
        <input ref={fileInput} type="file" accept={ACCEPT_IMAGES} hidden onChange={(e) => insertImage(e.target.files?.[0])} />
        <span className="admin-tool__sep" />
        <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => chain().undo().run()}>
          ↶
        </ToolButton>
        <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => chain().redo().run()}>
          ↷
        </ToolButton>
      </div>
      {uploadError && <p className="admin-error admin-editor__error">{uploadError}</p>}
      {titleRepeated && (
        <p className="admin-editor__dupe" role="status">
          The title is already shown at the top. You can remove this line.
          <button type="button" className="admin-btn admin-btn--ghost" onClick={removeFirstLine}>
            Remove line
          </button>
        </p>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
