import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState } from 'react';
import { LaTeXPreview } from '../LaTeXPreview';
import { htmlToPlainText } from '../../utils/latex';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  autosaveInterval?: number;
  fillHeight?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter your response...',
  minHeight = 200,
  autosaveInterval = 3000,
  fillHeight = false,
}: Props) {
  const [previewText, setPreviewText] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(html);
      setPreviewText(htmlToPlainText(html));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== editor.getText()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
    setPreviewText(htmlToPlainText(value));
  }, [value, editor]);

  useEffect(() => {
    if (!editor || !autosaveInterval) return;
    const id = setInterval(() => onChange(editor.getHTML()), autosaveInterval);
    return () => clearInterval(id);
  }, [editor, autosaveInterval, onChange]);

  if (!editor) return null;

  const insertLatex = (display: boolean) => {
    const latex = window.prompt(display ? 'Enter display LaTeX (without $$)' : 'Enter inline LaTeX (without $)');
    if (!latex) return;
    const wrapped = display ? `$$${latex}$$` : `$${latex}$`;
    editor.chain().focus().insertContent(display ? `<p>${wrapped}</p>` : wrapped).run();
    setPreviewText(htmlToPlainText(editor.getHTML()));
  };

  const toolBtn = (active: boolean, onClick: () => void, label: string, text: string) => (
    <button
      type="button"
      className={active ? 'is-active' : ''}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {text}
    </button>
  );

  return (
    <div className={fillHeight ? 'editor-wrap editor-wrap--fill' : 'editor-wrap'}>
      <div className="editor-shell">
        <div className="editor-toolbar">
          {toolBtn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'Bold', 'B')}
          {toolBtn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'Italic', 'I')}
          {toolBtn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), 'Underline', 'U')}
          <span style={{ borderLeft: '1px solid var(--border-color)', margin: '0 0.25rem' }} />
          {toolBtn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), 'Bullet list', '•')}
          {toolBtn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), 'Numbered list', '1.')}
          {toolBtn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), 'Blockquote', '❝')}
          {toolBtn(editor.isActive('codeBlock'), () => editor.chain().focus().toggleCodeBlock().run(), 'Code block', '</>')}
          {toolBtn(false, () => {
            const url = window.prompt('Enter URL');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }, 'Link', '🔗')}
          <span style={{ borderLeft: '1px solid var(--border-color)', margin: '0 0.25rem' }} />
          {toolBtn(false, () => insertLatex(false), 'Insert inline LaTeX', '$x$')}
          {toolBtn(false, () => insertLatex(true), 'Insert display LaTeX', '$$')}
        </div>
        <div className="editor-body" style={fillHeight ? undefined : { minHeight }}>
          <EditorContent editor={editor} />
        </div>
      </div>
      {!fillHeight && <LaTeXPreview content={previewText} />}
    </div>
  );
}
