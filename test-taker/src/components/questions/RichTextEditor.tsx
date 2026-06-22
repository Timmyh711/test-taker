import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, IconButton, Divider, Tooltip } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import FunctionsIcon from '@mui/icons-material/Functions';
import { useEffect, useState, type ReactNode } from 'react';
import { LaTeXPreview } from '../LaTeXPreview';
import { htmlToPlainText } from '../../utils/latex';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  autosaveInterval?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter your response...',
  minHeight = 200,
  autosaveInterval = 3000,
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

  const btn = (active: boolean, onClick: () => void, icon: ReactNode, label: string) => (
    <Tooltip title={label}>
      <IconButton
        size="small"
        onClick={onClick}
        color={active ? 'primary' : 'default'}
        aria-label={label}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );

  return (
    <Box>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 1, bgcolor: 'action.hover' }}>
          {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <FormatBoldIcon fontSize="small" />, 'Bold')}
          {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <FormatItalicIcon fontSize="small" />, 'Italic')}
          {btn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), <FormatUnderlinedIcon fontSize="small" />, 'Underline')}
          <Divider orientation="vertical" flexItem />
          {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), <FormatListBulletedIcon fontSize="small" />, 'Bullet list')}
          {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), <FormatListNumberedIcon fontSize="small" />, 'Numbered list')}
          {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), <FormatQuoteIcon fontSize="small" />, 'Blockquote')}
          {btn(editor.isActive('codeBlock'), () => editor.chain().focus().toggleCodeBlock().run(), <CodeIcon fontSize="small" />, 'Code block')}
          {btn(false, () => {
            const url = window.prompt('Enter URL');
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }, <LinkIcon fontSize="small" />, 'Link')}
          <Divider orientation="vertical" flexItem />
          {btn(false, () => insertLatex(false), <FunctionsIcon fontSize="small" />, 'Insert inline LaTeX')}
          {btn(false, () => insertLatex(true), <FunctionsIcon fontSize="small" />, 'Insert display LaTeX')}
        </Box>
        <Box
          sx={{
            p: 2,
            minHeight,
            '& .ProseMirror': {
              outline: 'none',
              minHeight: minHeight - 32,
              '& p': { mb: 1 },
              '& ul, & ol': { pl: 3 },
              '& blockquote': {
                borderLeft: '3px solid',
                borderColor: 'primary.main',
                pl: 2,
                color: 'text.secondary',
              },
              '& pre': {
                bgcolor: '#0d1117',
                p: 1.5,
                borderRadius: 1,
                overflow: 'auto',
              },
              '& p.is-editor-empty:first-of-type::before': {
                color: 'text.disabled',
                content: 'attr(data-placeholder)',
                float: 'left',
                height: 0,
                pointerEvents: 'none',
              },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>
      <LaTeXPreview content={previewText} />
    </Box>
  );
}
