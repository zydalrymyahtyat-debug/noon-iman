import React from 'react';
import quranImg from '../assets/images/quran.jpg';
import hisnImg from '../assets/images/hisn.jpg';
import misbahaImg from '../assets/images/misbaha.jpg';
import prayerImg from '../assets/images/prayer.jpg';
import libraryImg from '../assets/images/library.jpg';
import storiesImg from '../assets/images/stories.jpg';
import bannerImg from '../assets/images/banner.jpg';
import { Book, Clock, Heart, CheckCircle2, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
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
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bannerImg})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-emerald-800/80"></div>
        <div className="relative z-10 p-8 text-white">
          <h2 className="text-3xl font-bold font-serif mb-3">السلام عليكم</h2>
          <p className="text-teal-50 font-medium text-lg opacity-90 max-w-sm">مرحباً بك في تطبيق نور الإيمان. اختر القسم الذي تريده من القائمة.</p>
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
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${card.image}')` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
            
            <div className="relative z-10 p-4 flex flex-col h-full justify-end">
              <div className={`w-10 h-10 rounded-xl ${card.color} text-white flex items-center justify-center shadow-sm mb-2 opacity-90`}>
                {card.icon}
              </div>
              <h3 className="font-bold text-white text-lg leading-tight mb-1">{card.title}</h3>
              <p className="text-xs text-slate-300 opacity-90">{card.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
