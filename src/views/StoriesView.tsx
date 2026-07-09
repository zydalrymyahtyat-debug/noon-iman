import React from 'react';
import { Bookmark } from 'lucide-react';
import { motion } from 'motion/react';

export const StoriesView: React.FC = () => {
  const stories = [
    { id: 1, title: 'قصة آدم عليه السلام', summary: 'أبو البشر وأول الأنبياء.' },
    { id: 2, title: 'قصة نوح عليه السلام', summary: 'شيخ المرسلين وقصة الطوفان العظيم.' },
    { id: 3, title: 'قصة إبراهيم عليه السلام', summary: 'خليل الرحمن وبناء الكعبة.' },
    { id: 4, title: 'قصة موسى عليه السلام', summary: 'كليم الله وخروجه مع بني إسرائيل.' },
    { id: 5, title: 'قصة عيسى عليه السلام', summary: 'كلمة الله وروحه، ومعجزاته.' },
    { id: 6, title: 'سيرة النبي محمد ﷺ', summary: 'خاتم الأنبياء والمرسلين.' },
  ];

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <Bookmark className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-800 dark:text-slate-100">قصص الأنبياء</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">عبر وعظات من سير الأنبياء</p>
        </div>
      </div>

      <div className="grid gap-4">
        {stories.map((story, idx) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer hover:shadow-md transition-all active:scale-95"
          >
            <h3 className="font-bold text-lg font-serif text-slate-800 dark:text-slate-100 mb-2">{story.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{story.summary}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
