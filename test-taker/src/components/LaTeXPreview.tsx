import { Box, Typography } from '@mui/material';
import { ContentRenderer } from './ContentRenderer';
import { containsLatex } from '../utils/latex';

interface Props {
  content: string;
  label?: string;
}

export function LaTeXPreview({ content, label = 'Preview' }: Props) {
  if (!content.trim() || !containsLatex(content)) return null;

  return (
    <Box
      sx={{
        mt: 1.5,
        p: 1.5,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'action.hover',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <ContentRenderer content={content} />
    </Box>
  );
}
