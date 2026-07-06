interface Props {
  value: string;
  onChange: (value: string) => void;
  integerOnly?: boolean;
  decimalPlaces?: number;
}

export function Numeric({ value, onChange, integerOnly, decimalPlaces }: Props) {
  const handleChange = (raw: string) => {
    if (integerOnly && raw.includes('.')) return;
    if (decimalPlaces !== undefined && raw.includes('.')) {
      const parts = raw.split('.');
      if (parts[1] && parts[1].length > decimalPlaces) return;
    }
    onChange(raw);
  };

  return (
    <input
      type="number"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Enter a number"
      aria-label="Numeric answer"
      step={integerOnly ? 1 : decimalPlaces !== undefined ? Math.pow(10, -decimalPlaces) : 'any'}
    />
  );
}
