import { useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { ACCEPT_IMAGES, uploadImage } from './components.jsx';

/**
 * WYSIWYG editor for the article body (TipTap). Offers only what the
 * server's sanitizer keeps: headings 2–3, paragraphs, bold, italic, lists,
 * quotes, links, images and code. `initialHtml` is read once (remount with a
 * new key to load another post); every change calls onChange(html).
 */
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

export default function RichEditor({ initialHtml, onChange, invalid }) {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        underline: false, // not part of the site's allowed formatting
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Image.configure({ inline: false }),
    ],
    content: initialHtml || '',
    shouldRerenderOnTransaction: true,
    editorProps: { attributes: { class: 'prose-text admin-editor__content', 'aria-label': 'Article' } },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? '' : e.getHTML()),
  });

  if (!editor) return null;
  const chain = () => editor.chain().focus();

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
      <div className="admin-editor__toolbar" role="toolbar" aria-label="Formatting">
        <ToolButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolButton>
        <ToolButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
          H3
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
      <EditorContent editor={editor} />
    </div>
  );
}
