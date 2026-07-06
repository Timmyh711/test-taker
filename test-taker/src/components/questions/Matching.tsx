import { ChoiceLabel } from '../ChoiceLabel';

interface Props {
  leftItems: string[];
  rightItems: string[];
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

export function Matching({ leftItems, rightItems, value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {leftItems.map((left) => (
        <div
          key={left}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            alignItems: 'center',
            padding: '1rem 0',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <ChoiceLabel content={left} />
          <select
            value={value[left] ?? ''}
            onChange={(e) => onChange({ ...value, [left]: e.target.value })}
            aria-label={`Match for ${left}`}
          >
            <option value="">Select…</option>
            {rightItems.map((right) => (
              <option key={right} value={right}>
                {right.replace(/[*_`#\[\]]/g, '')}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
