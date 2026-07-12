import React, { useState } from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const MisbahaView: React.FC = () => {
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(100);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleTap = () => {
    setCount(c => c + 1);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const requestReset = () => {
    setShowConfirmReset(true);
    setTimeout(() => {
      setShowConfirmReset(false);
    }, 3000);
  };

  const confirmReset = () => {
    setCount(0);
    setShowConfirmReset(false);
  };

  const progressPercentage = Math.min((count / goal) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold font-kufi text-teal-700 dark:text-teal-400">المسبحة الإلكترونية</h2>
        <p className="text-slate-500 dark:text-slate-400">ألا بذكر الله تطمئن القلوب</p>
      </div>

      <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
        <span className="text-sm font-bold text-slate-500">الهدف اليومي: {goal}</span>
        <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex-row-reverse" dir="ltr">
          <div
            className="h-full bg-teal-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="relative">
        {/* Progress Ring Background */}
        <svg className="absolute inset-0 w-[280px] h-[280px] -m-[12px] rotate-[-90deg]">
          <circle
            cx="140" cy="140" r="130"
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="8" fill="none"
          />
          <circle
            cx="140" cy="140" r="130"
            className="stroke-teal-500 transition-all duration-300"
            strokeWidth="8" fill="none"
            strokeDasharray="816"
            strokeDashoffset={816 - (816 * progressPercentage) / 100}
            strokeLinecap="round"
          />
        </svg>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleTap}
          className={cn(
            "w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-xl relative overflow-hidden transition-colors border-8 z-10",
            count > 0 ? "bg-teal-50 border-white dark:bg-teal-900/20 dark:border-slate-800 text-teal-700 dark:text-teal-400" : "bg-white border-white dark:bg-slate-800 dark:border-slate-800 text-slate-800 dark:text-white"
          )}
        >
          {count > 0 && (
            <div className="absolute inset-0 bg-teal-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>
          )}
          <span className="text-7xl font-bold font-sans tracking-tighter relative z-10">{count}</span>
          <span className="text-sm font-medium mt-4 opacity-80 relative z-10">اضغط للتسبيح</span>
        </motion.button>
      </div>

      <div className="h-12 relative flex justify-center items-center w-full">
        <AnimatePresence mode="wait">
          {!showConfirmReset ? (
            <motion.button
              key="reset-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={requestReset}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 px-6 py-2 rounded-full font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              تصفير العداد
            </motion.button>
          ) : (
            <motion.button
              key="confirm-btn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={confirmReset}
              className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-6 py-2 rounded-full font-bold hover:bg-rose-200 dark:hover:bg-rose-800/50 transition-colors"
            >
              هل أنت متأكد؟ (اضغط للتأكيد)
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
