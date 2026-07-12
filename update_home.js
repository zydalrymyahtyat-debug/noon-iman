const fs = require('fs');
let content = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// Add imports
content = content.replace(
  "import { motion } from 'motion/react';",
  "import { motion } from 'motion/react';\nimport { getDailyWird } from '../data/dailyData';\nimport { Quote, Sparkles } from 'lucide-react';"
);

// Get daily wird
content = content.replace(
  "export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {",
  "export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {\n  const dailyWird = getDailyWird();"
);

// Add the daily wird UI after the welcome banner
const dailyWirdUI = `
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
      >
        <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold font-kufi">الورد اليومي</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl relative">
            <Quote className="absolute top-3 right-3 w-5 h-5 text-emerald-200 dark:text-emerald-800/50" />
            <p className="text-emerald-800 dark:text-emerald-300 font-quran text-xl leading-loose text-center px-4 pt-2">
              {dailyWird.ayah.text}
            </p>
            <p className="text-left text-sm text-emerald-600 dark:text-emerald-500 font-kufi mt-3">
              - سورة {dailyWird.ayah.surah}، آية {dailyWird.ayah.number}
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="w-10 h-10 shrink-0 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm text-emerald-600">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">ذكر اليوم</p>
              <p className="text-slate-800 dark:text-slate-200 font-medium">{dailyWird.dhikr}</p>
            </div>
          </div>
        </div>
      </motion.div>
`;

content = content.replace(
  /<div className="grid grid-cols-2 gap-4 pb-20">/,
  dailyWirdUI + '\n      <div className="grid grid-cols-2 gap-4 pb-20">'
);

fs.writeFileSync('src/views/HomeView.tsx', content);
