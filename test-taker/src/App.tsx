import { useState, useCallback, useEffect } from 'react';
import { useSettings } from './hooks/useSettings';
import { useTestSession } from './hooks/useTestSession';
import { HomeScreen } from './components/HomeScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { ReadOnlyTestView } from './components/ReadOnlyTestView';
import { TestView } from './components/TestView';
import { ReviewScreen } from './components/ReviewScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { SettingsDialog } from './components/SettingsDialog';
import type { AppScreen } from './types/test';
import { getTimerState } from './utils/timer';
import { setWindowTitle } from './utils/windowTitle';
import { findHistoryEntry } from './utils/history';

function App() {
  const [screen, setScreen] = useState<AppScreen>('import');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null);

  const { settings, setThemeMode, setAccentColor } = useSettings();
  const {
    session,
    pendingResume,
    history,
    output,
    startTest,
    resumeTest,
    exitToHome,
    discardTest,
    setAnswer,
    getAnswer,
    flagQuestion,
    setCurrentQuestion,
    pauseTimer,
    submitTest,
  } = useTestSession();

  useEffect(() => {
    if (screen === 'test' || screen === 'review') {
      setWindowTitle(session?.test.title);
    } else if (screen === 'history_view' && viewingHistoryId) {
      const entry = findHistoryEntry(history, viewingHistoryId);
      setWindowTitle(entry?.test_title);
    } else {
      setWindowTitle();
    }
  }, [screen, session?.test.title, viewingHistoryId, history]);

  const handleImport = useCallback(
    (test: Parameters<typeof startTest>[0]) => {
      startTest(test);
      setScreen('test');
    },
    [startTest]
  );

  const handleResume = useCallback(() => {
    const saved = pendingResume;
    if (!saved) return;
    const timer = getTimerState(saved);
    resumeTest();
    if (timer.hasTimer && timer.isExpired) {
      setScreen('test');
      setTimeout(() => submitTest('timer_expired'), 100);
    } else {
      setScreen('test');
    }
  }, [pendingResume, resumeTest, submitTest]);

  const handleExitHome = useCallback(() => {
    exitToHome();
    setScreen('import');
  }, [exitToHome]);

  const handleDiscard = useCallback(() => {
    discardTest();
    setScreen('import');
  }, [discardTest]);

  const handleReview = useCallback(() => setScreen('review'), []);
  const handleBackToTest = useCallback(() => setScreen('test'), []);

  const handleConfirmSubmit = useCallback(() => {
    submitTest('user_submitted');
    setScreen('results');
  }, [submitTest]);

  const handleTimerExpire = useCallback(() => {
    submitTest('timer_expired');
    setScreen('results');
  }, [submitTest]);

  const handleJumpTo = useCallback(
    (index: number) => {
      setCurrentQuestion(index);
      setScreen('test');
    },
    [setCurrentQuestion]
  );

  const handleNewTest = useCallback(() => {
    setScreen('import');
  }, []);

  const handleViewHistory = useCallback(() => setScreen('history'), []);
  const handleViewTest = useCallback((id: string) => {
    setViewingHistoryId(id);
    setScreen('history_view');
  }, []);

  const handleBackFromHistory = useCallback(() => {
    setScreen('import');
  }, []);

  const handleBackFromHistoryView = useCallback(() => {
    setViewingHistoryId(null);
    setScreen('history');
  }, []);

  const viewingEntry = viewingHistoryId ? findHistoryEntry(history, viewingHistoryId) : null;

  return (
    <div className="app-root">
      {screen === 'import' && !session && (
        <HomeScreen
          pendingResume={pendingResume}
          history={history}
          onImport={handleImport}
          onResume={handleResume}
          onDiscard={handleDiscard}
          onViewHistory={handleViewHistory}
          onViewTest={handleViewTest}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}
      {screen === 'history' && !session && (
        <HistoryScreen
          history={history}
          onSelect={handleViewTest}
          onBack={handleBackFromHistory}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}
      {screen === 'history_view' && viewingEntry && (
        <ReadOnlyTestView entry={viewingEntry} onBack={handleBackFromHistoryView} />
      )}
      {screen === 'test' && session && (
        <TestView
          session={session}
          setAnswer={setAnswer}
          getAnswer={getAnswer}
          flagQuestion={flagQuestion}
          setCurrentQuestion={setCurrentQuestion}
          onReview={handleReview}
          onTimerExpire={handleTimerExpire}
          onTogglePause={pauseTimer}
          onExitHome={handleExitHome}
        />
      )}
      {screen === 'review' && session && (
        <ReviewScreen
          session={session}
          onBack={handleBackToTest}
          onSubmit={handleConfirmSubmit}
          onJumpTo={handleJumpTo}
        />
      )}
      {screen === 'results' && output && (
        <ResultsScreen output={output} onNewTest={handleNewTest} />
      )}
      <SettingsDialog
        open={settingsOpen}
        themeMode={settings.themeMode}
        accentColor={settings.accentColor}
        onClose={() => setSettingsOpen(false)}
        onThemeModeChange={setThemeMode}
        onAccentChange={setAccentColor}
      />
    </div>
  );
}

export default App;
