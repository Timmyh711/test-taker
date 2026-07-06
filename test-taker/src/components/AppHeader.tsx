interface Props {
  onOpenSettings: () => void;
  onBack?: () => void;
  backLabel?: string;
  onHistory?: () => void;
}

export function AppHeader({
  onOpenSettings,
  onBack,
  backLabel = 'Back to Home',
  onHistory,
}: Props) {
  return (
    <header className="app-header">
      <div className="app-header__nav">
        {onBack && (
          <button type="button" className="btn btn-text" onClick={onBack} aria-label={backLabel}>
            ← {backLabel}
          </button>
        )}
        {onHistory && (
          <button type="button" className="btn btn-text" onClick={onHistory} aria-label="Open test history">
            Test History
          </button>
        )}
      </div>
      <button type="button" className="btn btn-text" onClick={onOpenSettings} aria-label="Open settings">
        Settings
      </button>
    </header>
  );
}
