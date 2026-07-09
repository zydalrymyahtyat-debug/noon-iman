import React, { useState } from "react";
import { Play, Pause, RotateCcw, Check, Sparkles, Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { morningAzkar, eveningAzkar } from "../data/azkar";
import { cn } from "../lib/utils";
import {
  requestNotificationPermissions,
  scheduleAzkarReminder,
} from "../lib/notifications";
import { useHardwareBack } from "../hooks/useHardwareBack";

export const HisnView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"morning_azkar" | "evening_azkar">(
    "morning_azkar",
  );
  const [azkar, setAzkar] = useState(
    morningAzkar.map((z) => ({ ...z, current: z.count })),
  );

  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerHour, setTimerHour] = useState("06");
  const [timerMinute, setTimerMinute] = useState("00");
  const [notificationSuccess, setNotificationSuccess] = useState<string | null>(
    null,
  );

  useHardwareBack(showTimerModal, () => setShowTimerModal(false));

  React.useEffect(() => {
    if (activeTab === "morning_azkar") {
      setAzkar(morningAzkar.map((z) => ({ ...z, current: z.count })));
    } else if (activeTab === "evening_azkar") {
      setAzkar(eveningAzkar.map((z) => ({ ...z, current: z.count })));
    }
  }, [activeTab]);

  const handleTap = (id: number) => {
    setAzkar((prev) =>
      prev.map((z) =>
        z.id === id && z.current > 0 ? { ...z, current: z.current - 1 } : z,
      ),
    );
  };

  const handleSetTimer = async () => {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      setNotificationSuccess("يرجى تفعيل صلاحيات الإشعارات أولاً");
      setTimeout(() => setNotificationSuccess(null), 3000);
      return;
    }

    const type = activeTab === "morning_azkar" ? "morning" : "evening";
    const success = await scheduleAzkarReminder(
      type,
      parseInt(timerHour),
      parseInt(timerMinute),
    );

    if (success) {
      setNotificationSuccess(
        `تم ضبط المنبه بنجاح في ${timerHour}:${timerMinute}`,
      );
      setTimeout(() => {
        setNotificationSuccess(null);
        setShowTimerModal(false);
      }, 2000);
    } else {
      setNotificationSuccess("حدث خطأ أثناء ضبط المنبه");
      setTimeout(() => setNotificationSuccess(null), 3000);
    }
  };

  const reset = () => {
    if (activeTab === "morning_azkar") {
      setAzkar(morningAzkar.map((z) => ({ ...z, current: z.count })));
    } else if (activeTab === "evening_azkar") {
      setAzkar(eveningAzkar.map((z) => ({ ...z, current: z.count })));
    }
  };

  const total = azkar.reduce((acc, curr) => acc + curr.count, 0);
  const done = azkar.reduce(
    (acc, curr) => acc + (curr.count - curr.current),
    0,
  );
  const progress = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <div className="p-4 bg-white dark:bg-slate-900 shadow-sm z-10 shrink-0">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("morning_azkar")}
            className={cn(
              "flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all",
              activeTab === "morning_azkar"
                ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700",
            )}
          >
            أذكار الصباح
          </button>
          <button
            onClick={() => setActiveTab("evening_azkar")}
            className={cn(
              "flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all",
              activeTab === "evening_azkar"
                ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700",
            )}
          >
            أذكار المساء
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {activeTab === "morning_azkar"
                  ? "أذكار الصباح"
                  : "أذكار المساء"}
              </h2>
              <button
                onClick={() => setShowTimerModal(true)}
                className="p-1.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full max-w-xs bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-teal-500 h-full transition-all duration-300"
                style={{ width: `\${progress}%` }}
              ></div>
            </div>
          </div>
          <button
            onClick={reset}
            className="p-2 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 scroll-smooth scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={`azkar_\${activeTab}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {azkar.map((zikr) => {
              const isDone = zikr.current === 0;
              return (
                <motion.div
                  key={zikr.id}
                  layout
                  onClick={() => handleTap(zikr.id)}
                  className={cn(
                    "p-5 rounded-2xl shadow-sm border transition-all cursor-pointer relative overflow-hidden select-none",
                    isDone
                      ? "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50 opacity-70 scale-[0.98]"
                      : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:shadow-md",
                  )}
                >
                  {isDone && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                      <Check className="w-32 h-32 text-teal-500" />
                    </div>
                  )}
                  <p
                    className={cn(
                      "text-xl leading-loose text-center mb-6 font-serif relative z-10 transition-colors",
                      isDone
                        ? "text-teal-800 dark:text-teal-300"
                        : "text-slate-800 dark:text-slate-100",
                    )}
                  >
                    {zikr.text}
                  </p>

                  <div className="flex justify-between items-center relative z-10 mt-4">
                    <span className="text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-4 py-1.5 rounded-full">
                      التكرار: {zikr.count}
                    </span>
                    <div
                      className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl transition-all shadow-inner",
                        isDone
                          ? "bg-teal-500 text-white shadow-teal-500/50"
                          : "bg-slate-100 dark:bg-slate-700 text-teal-600 dark:text-teal-400",
                      )}
                    >
                      {isDone ? <Check className="w-6 h-6" /> : zikr.current}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showTimerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl w-full max-w-sm space-y-6 relative border border-slate-100 dark:border-slate-800"
            >
              <button
                onClick={() => setShowTimerModal(false)}
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600 dark:text-teal-400">
                  <Bell className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-800 dark:text-slate-100">
                  منبه{" "}
                  {activeTab === "morning_azkar"
                    ? "أذكار الصباح"
                    : "أذكار المساء"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                  سيصلك إشعار يومي في الوقت المحدد لقراءة الأذكار.
                </p>
              </div>

              <div
                className="flex items-center justify-center gap-4 text-3xl font-bold text-slate-800 dark:text-slate-100 my-8"
                dir="ltr"
              >
                <select
                  value={timerHour}
                  onChange={(e) => setTimerHour(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-teal-500 cursor-pointer appearance-none text-center min-w-[70px]"
                >
                  {Array.from({ length: 24 }).map((_, i) => {
                    const h = i.toString().padStart(2, "0");
                    return (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    );
                  })}
                </select>
                <span className="text-slate-400">:</span>
                <select
                  value={timerMinute}
                  onChange={(e) => setTimerMinute(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-teal-500 cursor-pointer appearance-none text-center min-w-[70px]"
                >
                  {Array.from({ length: 60 }).map((_, i) => {
                    const m = i.toString().padStart(2, "0");
                    return (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                onClick={handleSetTimer}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
              >
                تفعيل المنبه
              </button>

              {notificationSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm font-bold text-teal-600 dark:text-teal-400"
                >
                  {notificationSuccess}
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
