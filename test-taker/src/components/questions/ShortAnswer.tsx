import { Box, TextField, Typography } from '@mui/material';
import { LaTeXPreview } from '../LaTeXPreview';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ShortAnswer({ value, onChange }: Props) {
  return (
    <Box>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your answer (LaTeX supported: $x^2$, $$\frac{a}{b}$$)"
        slotProps={{ htmlInput: { 'aria-label': 'Short answer' } }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
        Use $...$ for inline math or $$...$$ for display math.
      </Typography>
      <LaTeXPreview content={value} />
    </Box>
  );
}
