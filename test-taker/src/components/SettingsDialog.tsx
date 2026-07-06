import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { AccentColor, ThemeMode } from '../types/test';
import { ACCENT_OPTIONS } from '../theme/theme';

interface Props {
  open: boolean;
  themeMode: ThemeMode;
  accentColor: AccentColor;
  onClose: () => void;
  onThemeModeChange: (mode: ThemeMode) => void;
  onAccentChange: (accent: AccentColor) => void;
}

export function SettingsDialog({
  open,
  themeMode,
  accentColor,
  onClose,
  onThemeModeChange,
  onAccentChange,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="editorial-dialog"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="editorial-dialog__header">
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Settings</h2>
        <button type="button" className="btn btn-text" onClick={onClose} aria-label="Close settings">
          <X size={18} strokeWidth={2} aria-hidden />
        </button>
      </div>

      <div className="editorial-dialog__body">
        <label htmlFor="theme-mode" className="utility-text" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Appearance
        </label>
        <select
          id="theme-mode"
          value={themeMode}
          onChange={(e) => onThemeModeChange(e.target.value as ThemeMode)}
          style={{ marginBottom: '1.5rem' }}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto (system)</option>
        </select>

        <p className="utility-text" style={{ margin: '0 0 0.75rem' }}>
          Accent colour
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {ACCENT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`btn btn-accent ${accentColor === opt.id ? 'is-active' : ''}`}
              onClick={() => onAccentChange(opt.id)}
              style={accentColor !== opt.id ? { borderColor: opt.color, color: opt.color } : undefined}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="editorial-dialog__footer">
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Done
        </button>
      </div>
    </dialog>
  );
}
