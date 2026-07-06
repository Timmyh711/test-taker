import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Alert, AlertTitle, Box } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import 'katex/dist/katex.min.css';

interface ContentRendererProps {
  content: string;
  latexEnabled?: boolean;
  compact?: boolean;
}

export function ContentRenderer({ content, latexEnabled = true, compact = false }: ContentRendererProps) {
  return (
    <Box
      className="content-renderer"
      component={compact ? 'span' : 'div'}
      sx={{
        display: compact ? 'inline' : 'block',
        '& p': { mb: compact ? 0 : 1.5, lineHeight: compact ? 1.4 : 1.7, display: compact ? 'inline' : 'block' },
        '& h1, & h2, & h3': { mt: 2, mb: 1, fontWeight: 600 },
        '& ul, & ol': { pl: 3, mb: 1.5 },
        '& blockquote': {
          borderLeft: '3px solid',
          borderColor: 'primary.main',
          pl: 2,
          ml: 0,
          color: 'text.secondary',
          fontStyle: 'italic',
        },
        '& table': { width: '100%', borderCollapse: 'collapse', mb: 2 },
        '& th, & td': {
          border: '1px solid',
          borderColor: 'divider',
          p: 1,
          textAlign: 'left',
        },
        '& th': { bgcolor: 'action.hover' },
        '& code': {
          bgcolor: 'action.selected',
          px: 0.5,
          borderRadius: 0.5,
          fontFamily: 'monospace',
          fontSize: '0.9em',
        },
        '& pre': {
          bgcolor: '#0d1117',
          p: 2,
          borderRadius: 1,
          overflow: 'auto',
        },
        '& .katex-display': { my: compact ? 0.5 : 2, overflowX: 'auto', display: compact ? 'inline-block' : 'block' },
        '& .katex': { fontSize: compact ? '1em' : undefined },
      }}
    >
      <ReactMarkdown
        remarkPlugins={latexEnabled ? [remarkGfm, remarkMath] : [remarkGfm]}
        rehypePlugins={latexEnabled ? [rehypeKatex] : []}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}

interface MediaProps {
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

export function QuestionMedia({ imageUrl, audioUrl, videoUrl }: MediaProps) {
  return (
    <Box sx={{ my: 2 }}>
      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt="Question illustration"
          sx={{ maxWidth: '100%', borderRadius: 1, mb: 1 }}
        />
      )}
      {audioUrl && (
        <Box component="audio" controls sx={{ width: '100%', mb: 1 }}>
          <source src={audioUrl} />
        </Box>
      )}
      {videoUrl && (
        <Box
          component="video"
          controls
          sx={{ maxWidth: '100%', borderRadius: 1, mb: 1 }}
        >
          <source src={videoUrl} />
        </Box>
      )}
    </Box>
  );
}

interface HintProps {
  hint: string;
  latexEnabled?: boolean;
}

export function QuestionHint({ hint, latexEnabled = true }: HintProps) {
  return (
    <Alert
      severity="info"
      icon={<LightbulbOutlinedIcon fontSize="inherit" />}
      sx={{ mt: 2 }}
      role="region"
      aria-label="Question hint"
    >
      <AlertTitle sx={{ mb: 0.5 }}>Hint</AlertTitle>
      <ContentRenderer content={hint} latexEnabled={latexEnabled} />
    </Alert>
  );
}
