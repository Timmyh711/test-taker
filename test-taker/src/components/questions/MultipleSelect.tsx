import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { ChoiceLabel } from '../ChoiceLabel';

interface Props {
  choices: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultipleSelect({ choices, value, onChange }: Props) {
  const toggle = (choice: string) => {
    if (value.includes(choice)) {
      onChange(value.filter((v) => v !== choice));
    } else {
      onChange([...value, choice]);
    }
  };

  return (
    <FormGroup>
      {choices.map((choice, i) => (
        <FormControlLabel
          key={i}
          control={
            <Checkbox
              checked={value.includes(choice)}
              onChange={() => toggle(choice)}
            />
          }
          label={<ChoiceLabel content={choice} />}
          sx={{
            mb: 1,
            mx: 0,
            px: 2,
            py: 1,
            borderRadius: 1,
            border: '1px solid',
            borderColor: value.includes(choice) ? 'primary.main' : 'divider',
            bgcolor: value.includes(choice) ? 'action.selected' : 'transparent',
            alignItems: 'flex-start',
            '& .MuiFormControlLabel-label': { mt: 0.5 },
          }}
        />
      ))}
    </FormGroup>
  );
}
