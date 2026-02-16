"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export function TypewriterText({
  text,
  speed = 14,
  startDelay = 0,
  showCursor = true,
  editBackspaceChars = 0,
  editPauseMs = 260,
  className,
  onComplete,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  showCursor?: boolean;
  editBackspaceChars?: number;
  editPauseMs?: number;
  className?: string;
  onComplete?: () => void;
}) {
  const fullText = useMemo(() => text || "", [text]);
  const [count, setCount] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const didEditRef = useRef(false);

  useEffect(() => {
    setCount(0);
    didEditRef.current = false;
  }, [fullText]);

  useEffect(() => {
    if (!fullText) return;

    const clearTimers = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      for (const id of timeoutsRef.current) window.clearTimeout(id);
      timeoutsRef.current = [];
    };

    const finish = () => {
      clearTimers();
      setCount(fullText.length);
      onComplete?.();
    };

    const backspaceOnce = () => {
      const maxBackspace = Math.max(0, Math.min(editBackspaceChars, fullText.length));
      const target = Math.max(0, fullText.length - maxBackspace);
      if (maxBackspace <= 0) {
        finish();
        return;
      }

      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        setCount((prev) => {
          const next = Math.max(target, prev - 1);
          if (next === target) {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            intervalRef.current = null;
            // Retype to completion.
            typeForward();
          }
          return next;
        });
      }, Math.max(6, speed));
    };

    const typeForward = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        setCount((prev) => {
          const next = Math.min(prev + 1, fullText.length);
          if (next === fullText.length) {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            intervalRef.current = null;
            if (editBackspaceChars > 0 && !didEditRef.current) {
              didEditRef.current = true;
              timeoutsRef.current.push(
                window.setTimeout(() => backspaceOnce(), Math.max(0, editPauseMs))
              );
              return next;
            }
            onComplete?.();
          }
          return next;
        });
      }, Math.max(6, speed));
    };

    const startId = window.setTimeout(() => {
      typeForward();
    }, Math.max(0, startDelay));
    timeoutsRef.current.push(startId);

    return () => {
      clearTimers();
    };
  }, [fullText, speed, startDelay, editBackspaceChars, editPauseMs, onComplete]);

  const rendered = fullText.slice(0, count);
  const done = count >= fullText.length;

  return (
    <span className={className}>
      {rendered}
      {showCursor && !done && (
        <span aria-hidden="true" style={{ opacity: 0.85 }}>
          |
        </span>
      )}
    </span>
  );
}

