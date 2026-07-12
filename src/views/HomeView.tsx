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
import { Book, Clock, Heart, CheckCircle2, Bookmark, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getDailyWird } from '../data/dailyData';
import { Quote, Sparkles } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const dailyWird = getDailyWird();
  const [copiedAyah, setCopiedAyah] = useState(false);
  const [copiedDhikr, setCopiedDhikr] = useState(false);

  const copyToClipboard = async (text: string, isAyah: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isAyah) {
        setCopiedAyah(true);
        setTimeout(() => setCopiedAyah(false), 2000);
      } else {
        setCopiedDhikr(true);
        setTimeout(() => setCopiedDhikr(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
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
        className="relative rounded-3xl overflow-hidden shadow-lg"
      >
        <img src={bannerImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-emerald-800/80"></div>
        <div className="relative z-10 p-8 text-white">
          <h2 className="text-3xl font-bold font-kufi mb-3">السلام عليكم</h2>
          <p className="text-teal-50 font-medium text-lg opacity-90 max-w-sm">مرحباً بك في تطبيق نور الإيمان. اختر القسم الذي تريده من القائمة.</p>
        </div>
      </motion.div>

      
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
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl relative group">
            <button
              onClick={() => copyToClipboard(`${dailyWird.ayah.text} - سورة ${dailyWird.ayah.surah}، آية ${dailyWird.ayah.number}`, true)}
              className="absolute top-3 left-3 p-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 rounded-full text-emerald-600 dark:text-emerald-400 transition-colors shadow-sm"
              title="نسخ الآية"
            >
              {copiedAyah ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <Quote className="absolute top-3 right-3 w-5 h-5 text-emerald-200 dark:text-emerald-800/50" />
            <p className="text-emerald-800 dark:text-emerald-300 font-quran text-xl leading-loose text-center px-4 pt-2">
              {dailyWird.ayah.text}
            </p>
            <p className="text-left text-sm text-emerald-600 dark:text-emerald-500 font-kufi mt-3">
              - سورة {dailyWird.ayah.surah}، آية {dailyWird.ayah.number}
            </p>
          </div>
          
          <div className="flex flex-row items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 relative">
            <div className="w-10 h-10 shrink-0 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm text-emerald-600">
              <Heart className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 mb-1">ذكر اليوم</p>
              <p className="text-slate-800 dark:text-slate-200 font-medium">{dailyWird.dhikr}</p>
            </div>
            <button
              onClick={() => copyToClipboard(dailyWird.dhikr, false)}
              className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors shadow-sm"
              title="نسخ الذكر"
            >
              {copiedDhikr ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
            </button>
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
