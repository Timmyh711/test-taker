import { Check } from 'lucide-react';
import { ChoiceLabel } from '../ChoiceLabel';

interface Props {
  choices: string[];
  value: string;
  onChange: (value: string) => void;
}

function choiceLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

export function MultipleChoice({ choices, value, onChange }: Props) {
  return (
    <ul className="choice-list" role="radiogroup" aria-label="Answer choices">
      {choices.map((choice, i) => {
        const selected = value === choice;
        return (
          <li key={i}>
            <label className={`choice-item${selected ? ' choice-item--selected' : ''}`}>
              <input
                type="radio"
                name="mc-choice"
                value={choice}
                checked={selected}
                onChange={() => onChange(choice)}
                className="sr-only"
              />
              <span className="choice-marker" aria-hidden="true">
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
