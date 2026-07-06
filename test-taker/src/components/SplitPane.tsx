import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  left: ReactNode;
  right: ReactNode;
  defaultRatio?: number;
  minLeftPx?: number;
  minRightPx?: number;
  storageKey?: string;
}

export function SplitPane({
  left,
  right,
  defaultRatio = 0.42,
  minLeftPx = 220,
  minRightPx = 280,
  storageKey,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const ratioRef = useRef(defaultRatio);

  const [ratio, setRatio] = useState(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const n = parseFloat(saved);
        if (!Number.isNaN(n) && n > 0.15 && n < 0.85) {
          ratioRef.current = n;
          return n;
        }
      }
    }
    ratioRef.current = defaultRatio;
    return defaultRatio;
  });

  const clampRatio = useCallback(
    (next: number, width: number) => {
      const minLeft = minLeftPx / width;
      const minRight = minRightPx / width;
      return Math.min(1 - minRight, Math.max(minLeft, next));
    },
    [minLeftPx, minRightPx]
  );

  const updateRatio = useCallback(
    (next: number) => {
      const width = containerRef.current?.clientWidth ?? 1000;
      const clamped = clampRatio(next, width);
      ratioRef.current = clamped;
      setRatio(clamped);
    },
    [clampRatio]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      updateRatio((e.clientX - rect.left) / rect.width);
    };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      if (storageKey) localStorage.setItem(storageKey, String(ratioRef.current));
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [storageKey, updateRatio]);

  const startDrag = () => {
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.05 : 0.02;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updateRatio(ratioRef.current - step);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      updateRatio(ratioRef.current + step);
    }
  };

  return (
    <div ref={containerRef} className="split-pane">
      <div className="split-pane__left" style={{ width: `${ratio * 100}%` }}>
        {left}
      </div>
      <div
        className="split-pane__divider"
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuemin={15}
        aria-valuemax={85}
        tabIndex={0}
        onMouseDown={startDrag}
        onKeyDown={onKeyDown}
      />
      <div className="split-pane__right">{right}</div>
    </div>
  );
}
