import { useState, useEffect, useRef, useCallback } from "react";

// Maximum tab switches allowed before the test is auto-submitted
export const MAX_TAB_SWITCHES = 3;

export default function useExamGuard({
  active,
  durationSeconds,
  maxSwitches = MAX_TAB_SWITCHES,
  onTimeUp,
  onLimitReached,
}) {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const switchLogRef = useRef([]); // time of every tab switch
  const awayRef = useRef(false); // true while the student is away from the exam

  // Always keep the latest callbacks (so we never use old answers)
  const onTimeUpRef = useRef(onTimeUp);
  const onLimitRef = useRef(onLimitReached);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
    onLimitRef.current = onLimitReached;
  });

  // ---------- 1) Countdown timer ----------
  useEffect(() => {
    if (!active) return;

    const endTime = Date.now() + durationSeconds * 1000;
    setSecondsLeft(durationSeconds);

    const tick = () => {
      const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        clearInterval(intervalId);
        onTimeUpRef.current && onTimeUpRef.current();
      }
    };

    const intervalId = setInterval(tick, 500);
    return () => clearInterval(intervalId);
  }, [active, durationSeconds]);

  // ---------- 2) Tab switch detection ----------
  useEffect(() => {
    if (!active) return;

    // Student left the exam tab/window
    const handleLeave = () => {
      if (awayRef.current) return; // count each leave only once
      awayRef.current = true;

      const log = [...switchLogRef.current, new Date().toISOString()];
      switchLogRef.current = log;
      setTabSwitches(log.length);

      if (log.length >= maxSwitches) {
        onLimitRef.current && onLimitRef.current();
      }
    };

    // Student came back -> show the warning
    const handleReturn = () => {
      if (!awayRef.current) return;
      awayRef.current = false;
      if (switchLogRef.current.length < maxSwitches) {
        setShowWarning(true);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) handleLeave();
      else handleReturn();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleLeave);
    window.addEventListener("focus", handleReturn);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleLeave);
      window.removeEventListener("focus", handleReturn);
    };
  }, [active, maxSwitches]);

  // Latest switch data (used when submitting)
  const getSwitchData = useCallback(
    () => ({ count: switchLogRef.current.length, log: switchLogRef.current }),
    []
  );

  const closeWarning = useCallback(() => setShowWarning(false), []);

  return { secondsLeft, tabSwitches, showWarning, closeWarning, getSwitchData };
}