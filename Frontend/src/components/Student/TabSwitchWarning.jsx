import React from "react";
import { AlertTriangle } from "lucide-react";
export default function TabSwitchWarning({ open, count, max, onClose }) {
  if (!open) return null;

  const remaining = max - count;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3">
          <AlertTriangle size={26} />
          <h3 className="text-lg font-bold">Warning: You left the exam!</h3>
        </div>

        <div className="p-6 space-y-3 text-gray-800 dark:text-gray-200">
          <p>
            Switching tabs or windows during the exam is not allowed. This has been
            recorded.
          </p>
          <p className="font-semibold text-red-600 dark:text-red-400">
            Tab switches: {count} of {max}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {remaining === 1
              ? "This is your LAST warning. One more switch and your test will be submitted automatically."
              : `If you switch ${remaining} more times, your test will be submitted automatically.`}
          </p>

          <button
            onClick={onClose}
            className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition"
          >
            I understand, continue the test
          </button>
        </div>
      </div>
    </div>
  );
}