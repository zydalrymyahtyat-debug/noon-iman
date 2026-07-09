import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X } from 'lucide-react';

export const WeeklyDialog: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem('weeklyDialogLastShown');
    const now = Date.now();
    // One week in ms = 7 * 24 * 60 * 60 * 1000 = 604800000
    if (!lastShown || now - parseInt(lastShown) > 604800000) {
      // Small delay for better UX
      const timer = setTimeout(() => setShow(true), 1500);
      localStorage.setItem('weeklyDialogLastShown', now.toString());
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl w-full max-w-sm relative border border-slate-100 dark:border-slate-800 text-center"
          >
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <p className="text-lg font-bold font-serif text-slate-800 dark:text-slate-100 leading-loose">
              هذا التطبيق صدقة جارية من فاعلة خير لا تنسونا من خالص دعائكم
            </p>
            <button
              onClick={() => setShow(false)}
              className="mt-6 w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
            >
              إغلاق
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
