import React, { useState, useEffect } from 'react';
import { Moon, Sun, Clock, MapPin, Bell, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { schedulePrayerReminder, requestNotificationPermissions } from '../lib/notifications';

export const PrayerView: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('مكة المكرمة (افتراضي)');
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

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
          <h2 className="text-2xl font-bold font-serif">{locationName}</h2>
          <p className="text-indigo-100 font-medium">
            {new Intl.DateTimeFormat('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date())}
          </p>
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
        {prayersList.map((prayer, idx) => (
          <motion.div
            key={prayer.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800">
                {prayer.icon}
              </div>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{prayer.name}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold font-sans text-xl" dir="ltr">
              {formatTime(prayer.time)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
