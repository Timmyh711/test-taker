import { useState } from 'react';
import type { SavedSession, TestData, TestHistoryEntry } from '../types/test';
import { validateTestJson } from '../utils/validation';
import { getGreeting } from '../utils/greeting';
import { formatTime, getTimerState } from '../utils/timer';
import { isAnswered } from '../utils/answers';
import type { Answer } from '../types/test';
import { HOME_HISTORY_LIMIT } from '../utils/storage';
import { AppHeader } from './AppHeader';
import { HistoryList } from './HistoryList';

interface Props {
  pendingResume: SavedSession | null;
  history: TestHistoryEntry[];
  onImport: (test: TestData) => void;
  onResume: () => void;
  onDiscard: () => void;
  onViewHistory: () => void;
  onViewTest: (id: string) => void;
  onOpenSettings: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function HomeScreen({
  pendingResume,
  history,
  onImport,
  onResume,
  onDiscard,
  onViewHistory,
  onViewTest,
  onOpenSettings,
}: Props) {
  const [jsonText, setJsonText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [pasteMessage, setPasteMessage] = useState<string | null>(null);
  const recentHistory = history.slice(0, HOME_HISTORY_LIMIT);

  const handleImport = () => {
    setErrors([]);
    try {
      const parsed = JSON.parse(jsonText);
      const result = validateTestJson(parsed);
      if (!result.valid) {
        setErrors(result.errors);
        return;
      }
      onImport(parsed as TestData);
    } catch (e) {
      setErrors([`Invalid JSON syntax: ${(e as Error).message}`]);
    }
  };

  const handlePaste = async () => {
    setPasteMessage(null);
    setErrors([]);
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setPasteMessage('Clipboard is empty.');
        return;
      }
      setJsonText(text);
      setPasteMessage('Pasted from clipboard.');
    } catch {
      setPasteMessage('Could not read clipboard. Try Ctrl+V in the text field.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText(ev.target?.result as string);
      setErrors([]);
      setPasteMessage(null);
    };
    reader.readAsText(file);
  };

  const resumeAnswered = pendingResume
    ? pendingResume.test.questions.filter((q) =>
        isAnswered(q, pendingResume.responses[String(q.q_number)] as Answer | undefined)
      ).length
    : 0;
  const resumeTimer = pendingResume ? getTimerState(pendingResume) : null;

  return (
    <div className="page-shell">
      <div className="page-flow">
        <AppHeader onOpenSettings={onOpenSettings} onHistory={onViewHistory} />

        <section className="flow-hero">
          <p className="utility-text">Test Taker</p>
          <h1>{getGreeting()}</h1>
          <p className="flow-lead">Import a test JSON below, or pick up where you left off.</p>
        </section>

        {pendingResume && (
          <section className="flow-block">
            <div className="flow-block__head">
              <h2>Resume Test</h2>
              {resumeTimer?.isPaused && <span className="tag tag--accent">Paused</span>}
            </div>
            <p className="flow-emphasis">{pendingResume.test.title}</p>
            <p className="utility-text">
              {resumeAnswered}/{pendingResume.test.questions.length} answered · Started {formatDate(pendingResume.startedAt)}
              {resumeTimer?.hasTimer &&
                ` · ${resumeTimer.isExpired ? 'Time expired' : `${formatTime(resumeTimer.remainingMs)} remaining`}`}
            </p>
            <div className="flow-actions">
              <button type="button" className="btn btn-primary" onClick={onResume}>
                Resume →
              </button>
              <button type="button" className="btn" onClick={onDiscard}>
                Discard
              </button>
            </div>
          </section>
        )}

        {recentHistory.length > 0 && (
          <section className="flow-block">
            <div className="flow-block__head">
              <h2>Recent Tests</h2>
              {history.length > HOME_HISTORY_LIMIT && (
                <button type="button" className="btn btn-text" onClick={onViewHistory}>
                  View all
                </button>
              )}
            </div>
            <HistoryList entries={recentHistory} onSelect={onViewTest} />
          </section>
        )}

        {history.length === 0 && !pendingResume && (
          <section className="flow-block flow-block--quiet">
            <p className="flow-lead" style={{ margin: 0 }}>
              Complete a test to see it in your history.
            </p>
          </section>
        )}

        <section className="flow-block">
          <h2>Import New Test</h2>
          <p className="flow-lead">Paste JSON from your clipboard, upload a file, or type directly.</p>

          <div className="toolbar-row">
            <button type="button" className="btn" onClick={handlePaste}>
              Paste
            </button>
            <label className="btn" style={{ cursor: 'pointer' }}>
              Upload File
              <input type="file" accept=".json,application/json" hidden onChange={handleFileUpload} />
            </label>
            {jsonText && (
              <button
                type="button"
                className="btn btn-text toolbar-row__end"
                onClick={() => {
                  setJsonText('');
                  setErrors([]);
                  setPasteMessage(null);
                }}
              >
                Clear
              </button>
            )}
          </div>

          {pasteMessage && <p className="utility-text">{pasteMessage}</p>}

          <label htmlFor="test-json" className="utility-text field-label">
            Test JSON
          </label>
          <textarea
            id="test-json"
            className="editorial-json"
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setPasteMessage(null);
            }}
            placeholder='{"title": "My Test", "questions": [...]}'
            aria-label="Test JSON input"
          />

          <div className="flow-actions">
            <button type="button" className="btn btn-primary" onClick={handleImport} disabled={!jsonText.trim()}>
              Start Test →
            </button>
          </div>

          {errors.length > 0 && (
            <div className="notice notice--error">
              <p className="utility-text">Validation Errors</p>
              <ul>
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
