import React, { useState, useEffect } from 'react';
import { Moon, Sun, Clock, MapPin, Bell, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { schedulePrayerReminder, requestNotificationPermissions } from '../lib/notifications';
import { cn } from '../lib/utils';

export const PrayerView: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('مكة المكرمة (افتراضي)');
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const [nextPrayerName, setNextPrayerName] = useState<string | null>(null);
  const [countdownStr, setCountdownStr] = useState<string>('');

  useEffect(() => {
    const calculatePrayers = (lat: number, lng: number) => {
      const coordinates = new Coordinates(lat, lng);
      const params = CalculationMethod.UmmAlQura();
      const date = new Date();
      const times = new PrayerTimes(coordinates, date, params);
      setPrayerTimes(times);
      setLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationName('موقعك الحالي');
          calculatePrayers(latitude, longitude);
        },
        (error) => {
          console.warn('Geolocation failed', error);
          calculatePrayers(21.3891, 39.8579);
        }
      );
    } else {
      calculatePrayers(21.3891, 39.8579);
    }
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;

    const prayers = [
      { name: 'الفجر', time: prayerTimes.fajr },
      { name: 'الشروق', time: prayerTimes.sunrise },
      { name: 'الظهر', time: prayerTimes.dhuhr },
      { name: 'العصر', time: prayerTimes.asr },
      { name: 'المغرب', time: prayerTimes.maghrib },
      { name: 'العشاء', time: prayerTimes.isha },
    ];

    const updateCountdown = () => {
      const now = new Date().getTime();
      let next = prayers.find(p => p.time.getTime() > now);

      if (!next) {
        // If all prayers today have passed, calculate for tomorrow's Fajr
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        // Approximation for tomorrow's Fajr based on today's
        const tomorrowFajr = new Date(prayerTimes.fajr);
        tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
        next = { name: 'الفجر (غداً)', time: tomorrowFajr };
      }

      setNextPrayerName(next.name);

      const diff = next.time.getTime() - now;
      if (diff > 0) {
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        let formatted = '';
        if (h > 0) formatted += `${h}س `;
        if (m > 0 || h > 0) formatted += `${m}د `;
        formatted += `${s}ث`;

        setCountdownStr(formatted);
      } else {
        setCountdownStr('الآن');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const handleSetAlarms = async () => {
    if (!prayerTimes) return;
    
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      setNotificationStatus('يرجى تفعيل صلاحيات الإشعارات أولاً');
      setTimeout(() => setNotificationStatus(null), 3000);
      return;
    }

    const prayers = [
      { id: 10, name: 'الفجر', time: prayerTimes.fajr },
      { id: 11, name: 'الظهر', time: prayerTimes.dhuhr },
      { id: 12, name: 'العصر', time: prayerTimes.asr },
      { id: 13, name: 'المغرب', time: prayerTimes.maghrib },
      { id: 14, name: 'العشاء', time: prayerTimes.isha },
    ];

    const now = new Date().getTime();
    let scheduled = 0;

    for (const prayer of prayers) {
      if (prayer.time.getTime() > now) {
        await schedulePrayerReminder(
          prayer.id,
          `صلاة \${prayer.name}`,
          `حان الآن موعد صلاة \${prayer.name}`,
          prayer.time
        );
        scheduled++;
      }
    }

    setNotificationStatus(`تم ضبط \${scheduled} منبهات للصلوات القادمة اليوم`);
    setTimeout(() => setNotificationStatus(null), 3000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (loading || !prayerTimes) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-slate-500 font-medium">جاري حساب مواقيت الصلاة...</p>
      </div>
    );
  }

  const prayersList = [
    { name: 'الفجر', time: prayerTimes.fajr, icon: <Moon className="w-5 h-5 text-indigo-400" /> },
    { name: 'الشروق', time: prayerTimes.sunrise, icon: <Sun className="w-5 h-5 text-amber-400" /> },
    { name: 'الظهر', time: prayerTimes.dhuhr, icon: <Sun className="w-5 h-5 text-amber-500" /> },
    { name: 'العصر', time: prayerTimes.asr, icon: <Sun className="w-5 h-5 text-orange-500" /> },
    { name: 'المغرب', time: prayerTimes.maghrib, icon: <Moon className="w-5 h-5 text-rose-500" /> },
    { name: 'العشاء', time: prayerTimes.isha, icon: <Moon className="w-5 h-5 text-indigo-600" /> },
  ];

  const cleanNextPrayerName = nextPrayerName?.replace(' (غداً)', '');

  return (
    <div className="p-4 space-y-6 pb-24 h-full overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute -end-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-2">
          <MapPin className="w-8 h-8 opacity-80" />
          <h2 className="text-2xl font-bold font-kufi">{locationName}</h2>
          <p className="text-indigo-100 font-medium">
            {new Intl.DateTimeFormat('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date())}
          </p>

          <AnimatePresence>
            {nextPrayerName && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 pt-4 border-t border-white/20 w-full flex flex-col items-center"
              >
                <p className="text-indigo-100 mb-1 font-medium">الصلاة القادمة: {nextPrayerName}</p>
                <div className="text-4xl font-bold font-sans tracking-tight" dir="ltr">
                  {countdownStr}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="flex justify-center">
        <button 
          onClick={handleSetAlarms}
          className="flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors active:scale-95"
        >
          <Bell className="w-5 h-5" />
          تفعيل تنبيهات الصلوات
        </button>
      </div>

      {notificationStatus && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-sm font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 p-3 rounded-xl border border-teal-100 dark:border-teal-800/50"
        >
          {notificationStatus}
        </motion.div>
      )}

      <div className="space-y-3">
        {prayersList.map((prayer, idx) => {
          const isNext = prayer.name === cleanNextPrayerName;

          return (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "flex items-center justify-between p-5 rounded-2xl shadow-sm border transition-all",
                isNext
                  ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-xl",
                  isNext ? "bg-white dark:bg-slate-800 shadow-sm" : "bg-slate-50 dark:bg-slate-800"
                )}>
                  {prayer.icon}
                </div>
                <div>
                  <span className={cn(
                    "text-lg font-bold",
                    isNext ? "text-indigo-700 dark:text-indigo-400" : "text-slate-800 dark:text-slate-100"
                  )}>{prayer.name}</span>
                  {isNext && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-500 font-medium">الصلاة القادمة</p>
                  )}
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-2 font-bold font-sans text-xl",
                isNext ? "text-indigo-700 dark:text-indigo-400" : "text-slate-600 dark:text-slate-300"
              )} dir="ltr">
                {formatTime(prayer.time)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
