import { useCallback, useEffect, useState } from 'react';
import type { Answer, SavedSession, TestData, TestHistoryEntry, TestOutput } from '../types/test';
import {
  addToHistory,
  clearSession,
  createSession,
  loadHistory,
  loadSession,
  saveSession,
  toggleFlag,
  toggleTimerPause,
  updateResponse,
} from '../utils/storage';
import { buildTestOutput } from '../utils/output';
import { getDefaultAnswer } from '../utils/answers';

const AUTOSAVE_INTERVAL_MS = 3000;

export function useTestSession() {
  const [session, setSession] = useState<SavedSession | null>(null);
  const [pendingResume, setPendingResume] = useState<SavedSession | null>(null);
  const [history, setHistory] = useState<TestHistoryEntry[]>([]);
  const [output, setOutput] = useState<TestOutput | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const refreshHomeData = useCallback(() => {
    setPendingResume(loadSession());
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    refreshHomeData();
  }, [refreshHomeData]);

  useEffect(() => {
    if (!session || submitted) return;
    const id = setInterval(() => saveSession(session), AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [session, submitted]);

  const startTest = useCallback((test: TestData) => {
    const newSession = createSession(test);
    setSession(newSession);
    setPendingResume(null);
    setSubmitted(false);
    setOutput(null);
    saveSession(newSession);
  }, []);

  const resumeTest = useCallback(() => {
    const saved = pendingResume ?? loadSession();
    if (saved) {
      setSession(saved);
      setPendingResume(null);
      setSubmitted(false);
    }
  }, [pendingResume]);

  const exitToHome = useCallback(() => {
    if (!session) return;
    saveSession(session);
    setPendingResume(session);
    setSession(null);
    refreshHomeData();
  }, [session, refreshHomeData]);

  const discardTest = useCallback(() => {
    clearSession();
    setPendingResume(null);
    setSession(null);
    setSubmitted(false);
    setOutput(null);
    refreshHomeData();
  }, [refreshHomeData]);

  const setAnswer = useCallback((qNumber: number, answer: Answer) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = updateResponse(prev, qNumber, answer);
      saveSession(updated);
      return updated;
    });
  }, []);

  const getAnswer = useCallback(
    (qNumber: number): Answer => {
      if (!session) return '';
      const stored = session.responses[String(qNumber)];
      if (stored !== undefined) return stored;
      const question = session.test.questions.find((q) => q.q_number === qNumber);
      return question ? getDefaultAnswer(question) : '';
    },
    [session]
  );

  const flagQuestion = useCallback((qNumber: number) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = toggleFlag(prev, qNumber);
      saveSession(updated);
      return updated;
    });
  }, []);

  const setCurrentQuestion = useCallback((index: number) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, currentQuestion: index, lastSavedAt: new Date().toISOString() };
      saveSession(updated);
      return updated;
    });
  }, []);

  const pauseTimer = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = toggleTimerPause(prev);
      saveSession(updated);
      return updated;
    });
  }, []);

  const submitTest = useCallback(
    (reason: 'user_submitted' | 'timer_expired' = 'user_submitted') => {
      if (!session) return;
      const result = buildTestOutput(session, reason);
      setOutput(result);
      setSubmitted(true);
      addToHistory(result);
      clearSession();
      setSession(null);
      refreshHomeData();
    },
    [session, refreshHomeData]
  );

  return {
    session,
    pendingResume,
    history,
    output,
    submitted,
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
    refreshHomeData,
  };
}
