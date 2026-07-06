import { ContentRenderer } from './ContentRenderer';
import { containsLatex } from '../utils/latex';

interface Props {
  content: string;
  label?: string;
}

export function LaTeXPreview({ content, label = 'Preview' }: Props) {
  if (!content.trim() || !containsLatex(content)) return null;

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '1rem',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
      }}
    >
      <p className="utility-text" style={{ margin: '0 0 0.5rem' }}>
        {label}
      </p>
      <ContentRenderer content={content} />
    </div>
  );
}
