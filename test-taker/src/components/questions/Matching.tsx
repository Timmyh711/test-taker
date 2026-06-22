import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ChoiceLabel } from '../ChoiceLabel';

interface Props {
  leftItems: string[];
  rightItems: string[];
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

export function Matching({ leftItems, rightItems, value, onChange }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {leftItems.map((left) => (
        <Box
          key={left}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            alignItems: 'center',
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <ChoiceLabel content={left} />
          <FormControl fullWidth size="small">
            <InputLabel id={`match-${left}`}>Match to</InputLabel>
            <Select
              labelId={`match-${left}`}
              value={value[left] ?? ''}
              label="Match to"
              onChange={(e) => onChange({ ...value, [left]: e.target.value })}
            >
              <MenuItem value="">
                <em>Select...</em>
              </MenuItem>
              {rightItems.map((right) => (
                <MenuItem key={right} value={right}>
                  <ChoiceLabel content={right} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ))}
    </Box>
  );
}
