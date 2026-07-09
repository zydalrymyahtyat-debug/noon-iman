import React from 'react';
import { BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export const QuranView: React.FC = () => {
  const surahs = [
    { id: 1, name: 'الفاتحة', type: 'مكية', verses: 7 },
    { id: 2, name: 'البقرة', type: 'مدنية', verses: 286 },
    { id: 3, name: 'آل عمران', type: 'مدنية', verses: 200 },
    { id: 18, name: 'الكهف', type: 'مكية', verses: 110 },
    { id: 36, name: 'يس', type: 'مكية', verses: 83 },
    { id: 55, name: 'الرحمن', type: 'مدنية', verses: 78 },
    { id: 56, name: 'الواقعة', type: 'مكية', verses: 96 },
    { id: 67, name: 'الملك', type: 'مكية', verses: 30 },
  ];

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-800 dark:text-slate-100">القرآن الكريم</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">فهرس السور</p>
        </div>
      </div>

      <div className="grid gap-3">
        {surahs.map((surah, idx) => (
          <motion.button
            key={surah.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 dark:text-slate-500 text-sm">
                {surah.id}
              </div>
              <div className="text-right">
                <h3 className="font-bold font-serif text-lg text-slate-800 dark:text-slate-100">{surah.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{surah.type} • {surah.verses} آية</p>
              </div>
            </div>
            <div className="text-emerald-600 dark:text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <BookOpen className="w-5 h-5" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
