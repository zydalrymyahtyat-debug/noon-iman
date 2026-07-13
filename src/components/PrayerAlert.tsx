import React, { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { motion, AnimatePresence } from 'motion/react';
import { Clock } from 'lucide-react';

export const PrayerAlert: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayerName, setNextPrayerName] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isApproaching, setIsApproaching] = useState(false);

  useEffect(() => {
    const calculatePrayers = (lat: number, lng: number) => {
      const coordinates = new Coordinates(lat, lng);
      const params = CalculationMethod.UmmAlQura();
      const date = new Date();
      const times = new PrayerTimes(coordinates, date, params);
      setPrayerTimes(times);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => calculatePrayers(position.coords.latitude, position.coords.longitude),
        () => calculatePrayers(21.3891, 39.8579)
      );
    } else {
      calculatePrayers(21.3891, 39.8579);
    }
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;

    const checkTime = () => {
      const now = new Date();
      const nextPrayer = prayerTimes.nextPrayer();
      let prayerTimeDate: Date | null = null;
      let name = '';

      switch (nextPrayer) {
        case 'fajr': prayerTimeDate = prayerTimes.fajr; name = 'الفجر'; break;
        case 'sunrise': prayerTimeDate = prayerTimes.sunrise; name = 'الشروق'; break;
        case 'dhuhr': prayerTimeDate = prayerTimes.dhuhr; name = 'الظهر'; break;
        case 'asr': prayerTimeDate = prayerTimes.asr; name = 'العصر'; break;
        case 'maghrib': prayerTimeDate = prayerTimes.maghrib; name = 'المغرب'; break;
        case 'isha': prayerTimeDate = prayerTimes.isha; name = 'العشاء'; break;
        default: 
          name = '';
          break;
      }

      if (prayerTimeDate && name) {
        const diffMs = prayerTimeDate.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const mins = diffMins % 60;

        if (diffMins >= 0 && diffMins <= 30) {
          setIsApproaching(true);
          setNextPrayerName(name);
          setTimeRemaining(`متبقي ${mins} دقيقة`);
        } else {
          setIsApproaching(false);
        }
      } else {
        setIsApproaching(false);
      }
    };
    
    checkTime();
    const interval = setInterval(checkTime, 30000); // check every 30 seconds

    return () => clearInterval(interval);
  }, [prayerTimes]);

  return (
    <AnimatePresence>
      {isApproaching && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between shadow-md z-50 w-full"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 animate-pulse" />
            <span className="font-kufi text-sm font-bold">
              اقترب موعد صلاة {nextPrayerName}
            </span>
          </div>
          <span className="text-sm font-medium">{timeRemaining}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
