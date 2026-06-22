import { MultipleChoice } from './MultipleChoice';

interface Props {
  choices: string[];
  value: string;
  onChange: (value: string) => void;
}

export function TrueFalse({ choices, value, onChange }: Props) {
  return <MultipleChoice choices={choices} value={value} onChange={onChange} />;
}
