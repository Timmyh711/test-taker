import { useState } from 'react';
import {
  ClipboardPaste,
  Clock,
  Play,
  Trash2,
  Upload,
} from 'lucide-react';
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
    <div className="home-screen">
      <header className="home-screen__header">
        <AppHeader onOpenSettings={onOpenSettings} onHistory={onViewHistory} />
      </header>

      <div className="home-screen__body">
        <div className="home-screen__content">
          <section className="home-hero">
            <p className="utility-text">Test Taker</p>
            <h1>{getGreeting()}</h1>
          </section>

          {pendingResume && (
            <section className="home-resume" aria-label="Resume in-progress test">
            <div className="home-resume__head">
              <h2>Continue Your Test</h2>
              {resumeTimer?.isPaused && <span className="tag tag--accent">Paused</span>}
            </div>
            <p className="home-resume__title">{pendingResume.test.title}</p>
            <p className="utility-text home-resume__meta">
              {resumeAnswered}/{pendingResume.test.questions.length} answered · {formatDate(pendingResume.startedAt)}
              {resumeTimer?.hasTimer && (
                <>
                  {' · '}
                  <Clock size={12} strokeWidth={2} style={{ verticalAlign: '-2px', marginRight: '0.25rem' }} aria-hidden />
                  {resumeTimer.isExpired ? 'Time expired' : `${formatTime(resumeTimer.remainingMs)} left`}
                </>
              )}
            </p>
            <div className="home-resume__actions">
              <button type="button" className="btn btn-primary btn--large" onClick={onResume}>
                <Play size={18} strokeWidth={2} aria-hidden />
                Resume Test
              </button>
              <button type="button" className="btn" onClick={onDiscard}>
                <Trash2 size={16} strokeWidth={2} aria-hidden />
                Discard
              </button>
            </div>
          </section>
        )}

        <section className="home-import" aria-label="Import new test">
          <label htmlFor="test-json" className="utility-text field-label">
            Test JSON
          </label>
          <textarea
            id="test-json"
            className="editorial-json home-import__textarea"
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setPasteMessage(null);
            }}
            placeholder='{"title": "My Test", "questions": [...]}'
            aria-label="Test JSON input"
          />

          <div className="toolbar-row">
            <button type="button" className="btn" onClick={handlePaste}>
              <ClipboardPaste size={16} strokeWidth={2} aria-hidden />
              Paste
            </button>
            <label className="btn" style={{ cursor: 'pointer' }}>
              <Upload size={16} strokeWidth={2} aria-hidden />
              Upload
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

          <button
            type="button"
            className="btn btn-primary btn--large home-import__start"
            onClick={handleImport}
            disabled={!jsonText.trim()}
          >
            Start Test
          </button>

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

      {recentHistory.length > 0 && (
        <footer className="home-screen__footer">
          <div className="home-screen__footer-head">
            <p className="utility-text">Recent</p>
            {history.length > HOME_HISTORY_LIMIT && (
              <button type="button" className="btn btn-text" onClick={onViewHistory}>
                View all
              </button>
            )}
          </div>
          <HistoryList entries={recentHistory} onSelect={onViewTest} />
        </footer>
      )}
    </div>
  );
}
