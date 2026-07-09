import React, { useState, useEffect, useRef } from 'react';
import { Home, Book, BookOpen, Clock, Settings, Heart, CheckCircle2, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { HomeView } from './views/HomeView';
import { QuranView } from './views/QuranView';
import { MisbahaView } from './views/MisbahaView';
import { HisnView } from './views/HisnView';
import { StoriesView } from './views/StoriesView';
import { LibraryView } from './views/LibraryView';
import { PrayerView } from './views/PrayerView';
import { SettingsView } from './views/SettingsView';
import { WeeklyDialog } from './components/WeeklyDialog';

type View = 'home' | 'quran' | 'misbaha' | 'hisn' | 'stories' | 'library' | 'prayer' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [showExitToast, setShowExitToast] = useState(false);
  const exitPromptRef = useRef(false);

  useEffect(() => {
    if (!window.history.state || !window.history.state.appInit) {
      window.history.replaceState({ dummy: true, appInit: true }, '');
      window.history.pushState({ view: 'home', appInit: true }, '');
    } else if (window.history.state.view) {
      setCurrentView(window.history.state.view);
    }

    const handlePopState = (e: PopStateEvent) => {
      const state = e.state;
      if (state && state.view) {
        setCurrentView(state.view);
        exitPromptRef.current = false;
        setShowExitToast(false);
      } else if (state && state.dummy) {
        if (exitPromptRef.current) {
          window.history.back(); // Actually exit
        } else {
          exitPromptRef.current = true;
          setShowExitToast(true);
          window.history.pushState({ view: 'home', appInit: true }, '');
          setCurrentView('home');
          setTimeout(() => {
            exitPromptRef.current = false;
            setShowExitToast(false);
          }, 2000);
        }
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: View) => {
    if (view !== currentView) {
      window.history.pushState({ view, appInit: true }, '');
      setCurrentView(view);
    }
  };

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-5 h-5" /> },
    { id: 'quran', label: 'القرآن', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'hisn', label: 'الأذكار', icon: <Heart className="w-5 h-5" /> },
    { id: 'misbaha', label: 'المسبحة', icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: 'library', label: 'المكتبة', icon: <Book className="w-5 h-5" /> },
    { id: 'prayer', label: 'الصلاة', icon: <Clock className="w-5 h-5" /> },
    { id: 'stories', label: 'قصص', icon: <Bookmark className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 overflow-hidden" dir="rtl">
      <WeeklyDialog />
      
      <AnimatePresence>
        {showExitToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium whitespace-nowrap"
          >
            اضغط مرة أخرى للخروج
          </motion.div>
        )}
      </AnimatePresence>

      <header className="h-16 shrink-0 flex items-center justify-between px-4 bg-white dark:bg-slate-900 shadow-sm z-10 relative">
        <h1 className="text-xl font-bold text-teal-600 dark:text-teal-400 font-serif">نور الإيمان</h1>
        <button onClick={() => navigateTo('settings')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {currentView === 'home' && <HomeView onNavigate={(view) => navigateTo(view as View)} />}
        {currentView === 'quran' && <QuranView />}
        {currentView === 'misbaha' && <MisbahaView />}
        {currentView === 'hisn' && <HisnView />}
        {currentView === 'stories' && <StoriesView />}
        {currentView === 'library' && <LibraryView />}
        {currentView === 'prayer' && <PrayerView />}
        {currentView === 'settings' && <SettingsView />}
      </main>

      <nav className="h-20 shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-1 z-10 pb-4 pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id as View)}
            className={cn(
              "flex flex-col items-center justify-center w-16 shrink-0 h-full space-y-1 rounded-xl transition-all",
              currentView === item.id 
                ? "text-teal-600 dark:text-teal-400" 
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-full transition-colors",
              currentView === item.id ? "bg-teal-50 dark:bg-teal-900/30" : "bg-transparent"
            )}>
              {item.icon}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
