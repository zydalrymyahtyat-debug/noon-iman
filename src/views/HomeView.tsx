import React, { useState } from 'react';
import { 
  quranImg, 
  hisnImg, 
  misbahaImg, 
  prayerImg, 
  libraryImg, 
  storiesImg, 
  bannerImg 
} from '../assets/image-data';
import { Book, Clock, Heart, CheckCircle2, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { getDailyWird } from '../data/dailyData';
import { Quote, Sparkles, ChevronDown } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const dailyWird = getDailyWird();
  const [isWirdExpanded, setIsWirdExpanded] = useState(false);
  
  const cards = [
    { id: 'quran', title: 'القرآن الكريم', icon: <Book className="w-8 h-8" />, color: 'bg-emerald-500', desc: 'قراءة واستماع', image: quranImg },
    { id: 'hisn', title: 'حصن المسلم', icon: <Heart className="w-8 h-8" />, color: 'bg-teal-500', desc: 'أذكار وأدعية', image: hisnImg },
    { id: 'misbaha', title: 'المسبحة', icon: <CheckCircle2 className="w-8 h-8" />, color: 'bg-indigo-500', desc: 'تسبيح وذكر', image: misbahaImg },
    { id: 'prayer', title: 'مواقيت الصلاة', icon: <Clock className="w-8 h-8" />, color: 'bg-amber-500', desc: 'مواعيد وتنبيهات', image: prayerImg },
    { id: 'library', title: 'المكتبة', icon: <Book className="w-8 h-8" />, color: 'bg-blue-500', desc: 'كتب إسلامية', image: libraryImg },
    { id: 'stories', title: 'قصص الأنبياء', icon: <Bookmark className="w-8 h-8" />, color: 'bg-rose-500', desc: 'عبر وعظات', image: storiesImg },
  ];

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-xl overflow-hidden shadow-sm h-14"
      >
        <img src={bannerImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-emerald-800/80"></div>
        <div className="relative z-10 px-4 h-full flex items-center justify-between text-white">
          <h2 className="text-lg font-bold font-kufi shrink-0">السلام عليكم</h2>
          <p className="text-teal-50 text-xs opacity-90 truncate ms-4">مرحباً بك في نور الإيمان</p>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer transition-all active:scale-[0.98]"
        onClick={() => setIsWirdExpanded(!isWirdExpanded)}
      >
        <div className="flex items-center justify-between mb-3 text-emerald-600 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <h3 className="font-bold font-kufi text-sm">الورد اليومي</h3>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isWirdExpanded ? 'rotate-180' : ''}`} />
        </div>
        
        <div className="space-y-2">
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl flex items-start gap-2">
            <Quote className="w-4 h-4 mt-0.5 text-emerald-400 dark:text-emerald-700 shrink-0" />
            <p className={`text-emerald-800 dark:text-emerald-300 font-quran text-[13px] flex-1 leading-normal transition-all duration-300 ${isWirdExpanded ? '' : 'line-clamp-1'}`}>
              {dailyWird.ayah.text}
            </p>
          </div>
          
          <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
            <Heart className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
            <p className={`text-slate-800 dark:text-slate-200 font-medium text-[13px] flex-1 leading-normal transition-all duration-300 ${isWirdExpanded ? '' : 'line-clamp-1'}`}>
              {dailyWird.dhikr}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 pb-20">
        {cards.map((card, idx) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onNavigate(card.id)}
            className="group relative rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all active:scale-95 text-right h-40"
          >
            <img src={card.image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
            
            <div className="relative z-10 p-4 flex flex-col h-full justify-end w-full">
              <div className={`w-10 h-10 rounded-xl ${card.color} text-white flex items-center justify-center shadow-sm mb-auto opacity-90`}>
                {card.icon}
              </div>
              <div className="mt-auto">
                <h3 className="font-bold text-white text-lg leading-tight mb-1">{card.title}</h3>
                <p className="text-xs text-white/80 font-medium">{card.desc}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
