import { LaTeXPreview } from '../LaTeXPreview';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ShortAnswer({ value, onChange }: Props) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your answer (LaTeX supported: $x^2$, $$\frac{a}{b}$$)"
        aria-label="Short answer"
      />
      <p className="utility-text" style={{ marginTop: '0.5rem' }}>
        Use $...$ for inline math or $$...$$ for display math.
      </p>
      <LaTeXPreview content={value} />
    </div>
  );
}
