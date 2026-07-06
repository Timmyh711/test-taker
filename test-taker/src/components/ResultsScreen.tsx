import { useEffect, useState } from 'react';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import type { TestOutput } from '../types/test';
import { ContentRenderer } from './ContentRenderer';

interface Props {
  output: TestOutput;
  onNewTest: () => void;
}

export function ResultsScreen({ output, onNewTest }: Props) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(output, null, 2);
  const grading = output.metadata.grading;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 3000);
    return () => clearTimeout(t);
  }, [copied]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${output.test_title.replace(/\s+/g, '_')}_response.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    try {
      const path = await save({
        defaultPath: `${output.test_title.replace(/\s+/g, '_')}_response.json`,
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });
      if (path) await writeTextFile(path, jsonString);
    } catch {
      handleDownload();
    }
  };

  return (
    <div className="page-shell">
      <div className="page-flow page-flow--narrow">
        <section className="flow-hero">
          <p className="utility-text">Examination Complete</p>
          <h1>Test Complete</h1>
          <p className="flow-emphasis">{output.test_title}</p>
        </section>

        {grading && (
          <section className="flow-block flow-block--score">
            <p className="score-display">{grading.percentage}%</p>
            <p className="utility-text">
              {grading.score} / {grading.max_score} points
            </p>
          </section>
        )}

        <section className="flow-block">
          <table className="editorial-table">
            <tbody>
              <tr>
                <th>Total Questions</th>
                <td>{output.metadata.total_questions}</td>
              </tr>
              <tr>
                <th>Answered</th>
                <td>{output.metadata.answered_count}</td>
              </tr>
              <tr>
                <th>Unanswered</th>
                <td>{output.metadata.unanswered_count}</td>
              </tr>
              <tr>
                <th>Flagged</th>
                <td>{output.metadata.flagged_count}</td>
              </tr>
              <tr>
                <th>Time Spent</th>
                <td>
                  {Math.floor(output.metadata.time_spent_seconds / 60)}m{' '}
                  {output.metadata.time_spent_seconds % 60}s
                </td>
              </tr>
              <tr>
                <th>Submission</th>
                <td>
                  {output.submission_reason === 'timer_expired' ? 'Timer Expired' : 'User Submitted'}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {grading && grading.results.some((r) => r.explanation) && (
          <section className="flow-block">
            <h2>Question Review</h2>
            <ol className="outline-list">
              {grading.results
                .filter((r) => r.explanation)
                .map((r) => (
                  <li key={r.q_number}>
                    <div className="flow-block__head">
                      <span style={{ fontWeight: 600 }}>Question {r.q_number}</span>
                      {r.correct === true && <span className="tag tag--success">Correct</span>}
                      {r.correct === false && <span className="tag tag--error">Incorrect</span>}
                      <span className="tag">
                        {r.points_earned}/{r.points_possible} pts
                      </span>
                    </div>
                    <ContentRenderer content={r.explanation!} />
                  </li>
                ))}
            </ol>
          </section>
        )}

        <section className="flow-block">
          <p className="utility-text field-label">Response JSON</p>
          <pre className="code-block">{jsonString}</pre>
          <div className="flow-actions">
            <button type="button" className="btn" onClick={handleCopy}>
              Copy JSON
            </button>
            <button type="button" className="btn" onClick={handleDownload}>
              Download JSON
            </button>
            <button type="button" className="btn" onClick={handleSave}>
              Save to File
            </button>
            <button type="button" className="btn btn-primary flow-actions__end" onClick={onNewTest}>
              New Test →
            </button>
          </div>
        </section>
      </div>

      {copied && (
        <div className="notice notice--success notice--fixed" role="status">
          JSON copied to clipboard
        </div>
      )}
    </div>
  );
}
