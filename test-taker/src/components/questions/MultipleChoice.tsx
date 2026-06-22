import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { ChoiceLabel } from '../ChoiceLabel';

interface Props {
  choices: string[];
  value: string;
  onChange: (value: string) => void;
}

export function MultipleChoice({ choices, value, onChange }: Props) {
  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      <RadioGroup value={value} onChange={(_, v) => onChange(v)}>
        {choices.map((choice, i) => (
          <FormControlLabel
            key={i}
            value={choice}
            control={<Radio />}
            label={<ChoiceLabel content={choice} />}
            sx={{
              mb: 1,
              mx: 0,
              px: 2,
              py: 1,
              borderRadius: 1,
              border: '1px solid',
              borderColor: value === choice ? 'primary.main' : 'divider',
              bgcolor: value === choice ? 'action.selected' : 'transparent',
              alignItems: 'flex-start',
              '& .MuiFormControlLabel-label': { mt: 0.75 },
              '&:hover': { bgcolor: 'action.hover' },
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
