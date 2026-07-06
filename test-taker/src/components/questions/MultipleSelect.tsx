import { Check } from 'lucide-react';
import { ChoiceLabel } from '../ChoiceLabel';

interface Props {
  choices: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

function choiceLetter(index: number): string {
  return String.fromCharCode(65 + index);
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
    <ul className="choice-list" role="group" aria-label="Answer choices">
      {choices.map((choice, i) => {
        const selected = value.includes(choice);
        return (
          <li key={i}>
            <label className={`choice-item${selected ? ' choice-item--selected' : ''}`}>
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggle(choice)}
                className="sr-only"
              />
              <span className="choice-marker choice-marker--multi" aria-hidden="true">
                {selected ? (
                  <Check size={15} strokeWidth={2.25} />
                ) : (
                  <span className="choice-marker__letter">{choiceLetter(i)}</span>
                )}
              </span>
              <span className="choice-text">
                <ChoiceLabel content={choice} />
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
