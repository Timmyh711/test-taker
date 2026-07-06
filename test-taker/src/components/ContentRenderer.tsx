import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ContentRendererProps {
  content: string;
  latexEnabled?: boolean;
  compact?: boolean;
}

export function ContentRenderer({ content, latexEnabled = true, compact = false }: ContentRendererProps) {
  return (
    <div className={`content-renderer ${compact ? 'content-renderer--compact' : ''}`}>
      <ReactMarkdown
        remarkPlugins={latexEnabled ? [remarkGfm, remarkMath] : [remarkGfm]}
        rehypePlugins={latexEnabled ? [rehypeKatex] : []}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

interface MediaProps {
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

export function QuestionMedia({ imageUrl, audioUrl, videoUrl }: MediaProps) {
  if (!imageUrl && !audioUrl && !videoUrl) return null;

  return (
    <div style={{ margin: '1.5rem 0' }}>
      {imageUrl && (
        <img src={imageUrl} alt="Question illustration" style={{ maxWidth: '100%', display: 'block', marginBottom: '0.75rem' }} />
      )}
      {audioUrl && (
        <audio controls style={{ width: '100%', marginBottom: '0.75rem' }}>
          <source src={audioUrl} />
        </audio>
      )}
      {videoUrl && (
        <video controls style={{ maxWidth: '100%', marginBottom: '0.75rem' }}>
          <source src={videoUrl} />
        </video>
      )}
    </div>
  );
}

interface HintProps {
  hint: string;
  latexEnabled?: boolean;
}

export function QuestionHint({ hint, latexEnabled = true }: HintProps) {
  return (
    <aside className="hint-block" role="region" aria-label="Question hint">
      <div className="hint-block__title">Hint</div>
      <ContentRenderer content={hint} latexEnabled={latexEnabled} />
    </aside>
  );
}
