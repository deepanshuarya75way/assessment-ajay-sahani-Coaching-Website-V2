import React from "react";
import { Clock, AlertTriangle } from "lucide-react";

// 3725 seconds -> "01:02:05"
export const formatTime = (totalSeconds) => {
  if (totalSeconds === null || totalSeconds === undefined) return "--:--:--";
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

// Sticky bar at the top: countdown (hh:mm:ss) + tab switch counter
export default function ExamTimer({ secondsLeft, tabSwitches, maxSwitches }) {
  const isCritical = secondsLeft !== null && secondsLeft <= 60;

  return (
    <div className="sticky top-20 z-30 mb-6 flex flex-wrap items-center justify-center gap-3">
      {/* Countdown */}
      <div
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold shadow ${
          isCritical
            ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 animate-pulse"
            : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
        }`}
      >
        <Clock size={18} />
        <span className="tabular-nums text-lg">{formatTime(secondsLeft)}</span>
        <span className="text-xs font-normal">left</span>
      </div>

      {/* Tab switch counter */}
      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold shadow ${
          tabSwitches === 0
            ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
        }`}
      >
        <AlertTriangle size={16} />
        Tab switches: {tabSwitches}/{maxSwitches}
      </div>
    </div>
  );
}