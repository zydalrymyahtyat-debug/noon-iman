import React, { useState } from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const MisbahaView: React.FC = () => {
  const [count, setCount] = useState(0);

  const handleTap = () => {
    setCount(c => c + 1);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold font-kufi text-teal-700 dark:text-teal-400">المسبحة الإلكترونية</h2>
        <p className="text-slate-500 dark:text-slate-400">ألا بذكر الله تطمئن القلوب</p>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}
        className={cn(
          "w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-2xl relative overflow-hidden transition-colors border-8",
          count > 0 ? "bg-teal-500 border-teal-600 text-white" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-white"
        )}
      >
        {count > 0 && (
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
        )}
        <span className="text-7xl font-bold font-sans tracking-tighter relative z-10">{count}</span>
        <span className="text-sm font-medium mt-4 opacity-80 relative z-10">اضغط للتسبيح</span>
      </motion.button>

      <button
        onClick={reset}
        className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-full font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
      >
        <RotateCcw className="w-5 h-5" />
        تصفير العداد
      </button>
    </div>
  );
};
