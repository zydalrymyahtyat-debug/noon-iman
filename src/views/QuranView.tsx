import React, { useState, useEffect } from 'react';
import { quranImg } from '../assets/image-data';
import { BookOpen, ArrowRight, Loader2, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useHardwareBack } from '../hooks/useHardwareBack';

interface SurahReference {
  number: number;
  name: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  numberInSurah: number;
  text: string;
}

const toArabicNumeral = (n: number) => {
  return n.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
};

let cachedMeta: any = null;

export const QuranView: React.FC = () => {
  const [surahs, setSurahs] = useState<SurahReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<SurahReference | null>(null);

  useHardwareBack(!!selectedSurah, () => setSelectedSurah(null));

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        if (!cachedMeta) {
          const res = await fetch('./data/meta.json');
          cachedMeta = await res.json();
        }
        setSurahs(cachedMeta.data.surahs.references);
      } catch (error) {
        console.error('Failed to fetch surahs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  if (selectedSurah) {
    return <SurahReader surah={selectedSurah} onBack={() => setSelectedSurah(null)} />;
  }

  return (
    <div className="relative h-full bg-slate-50 dark:bg-slate-950">
      <img src={quranImg} alt="" className="fixed inset-0 w-full h-full object-cover opacity-5 dark:opacity-10 pointer-events-none z-0" />
      <div className="relative z-10 p-4 space-y-6 h-full overflow-y-auto pb-24">
        <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-kufi text-slate-800 dark:text-slate-100">القرآن الكريم</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">فهرس السور</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="grid gap-3">
          {surahs.map((surah, idx) => (
            <motion.button
              key={surah.number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.5) }}
              onClick={() => setSelectedSurah(surah)}
              className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 dark:text-slate-500 text-sm">
                  {surah.number}
                </div>
                <div className="text-right">
                  <h3 className="font-bold font-kufi text-lg text-slate-800 dark:text-slate-100">{surah.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية
                  </p>
                </div>
              </div>
              <div className="text-emerald-600 dark:text-emerald-500">
                <BookOpen className="w-5 h-5 opacity-50" />
              </div>
            </motion.button>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

let cachedQuran: any = null;
let cachedTafsir: any = null;

const SurahReader: React.FC<{ surah: SurahReference; onBack: () => void }> = ({ surah, onBack }) => {
  const [quranData, setQuranData] = useState<Ayah[]>([]);
  const [tafsirData, setTafsirData] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTafsir, setShowTafsir] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchSurah = async () => {
      setLoading(true);
      try {
        if (!cachedQuran) cachedQuran = {};
        if (!cachedTafsir) cachedTafsir = {};

        if (!cachedQuran[surah.number]) {
          const resQ = await fetch(`./data/quran/${surah.number}.json`);
          cachedQuran[surah.number] = await resQ.json();
        }
        if (!cachedTafsir[surah.number]) {
          const resT = await fetch(`./data/tafsir/${surah.number}.json`);
          cachedTafsir[surah.number] = await resT.json();
        }
        
        const qSurah = cachedQuran[surah.number];
        const tSurah = cachedTafsir[surah.number];
        
        setQuranData(qSurah.ayahs);
        setTafsirData(tSurah.ayahs);
      } catch (error) {
        console.error('Failed to fetch surah content', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [surah.number]);

  const toggleTafsir = (ayahNum: number) => {
    setShowTafsir(prev => ({ ...prev, [ayahNum]: !prev[ayahNum] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-slate-950">
      <img src={quranImg} alt="" className="fixed inset-0 w-full h-full object-cover opacity-5 dark:opacity-10 pointer-events-none z-0" />
      
      <div className="relative z-20 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold font-kufi text-slate-800 dark:text-slate-100">{surah.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية
          </p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            {surah.number !== 1 && surah.number !== 9 && (
              <div className="text-center text-3xl text-slate-800 dark:text-slate-100 mb-8 font-quran">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
            )}
            <div className="text-justify leading-[2.5]" style={{ direction: 'rtl' }}>
              {quranData.map((ayah, idx) => (
                <React.Fragment key={ayah.numberInSurah}>
                  <span 
                    className={cn(
                      "cursor-pointer transition-colors text-[26px] sm:text-[28px] md:text-[32px] font-quran",
                      showTafsir[ayah.numberInSurah] ? "text-emerald-700 dark:text-emerald-400" : "text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-500"
                    )}
                    onClick={() => toggleTafsir(ayah.numberInSurah)}
                  >
                    {surah.number === 1 ? ayah.text : ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '').replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '')} 
                    <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm sm:text-base font-sans font-bold mx-2 bg-emerald-50 dark:bg-emerald-900/20">
                      {toArabicNumeral(ayah.numberInSurah)}
                    </span>
                  </span>

                  {showTafsir[ayah.numberInSurah] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="block w-full bg-emerald-50 dark:bg-emerald-900/10 p-4 sm:p-5 rounded-2xl text-slate-700 dark:text-slate-300 text-sm sm:text-base font-sans leading-relaxed border border-emerald-100 dark:border-emerald-900/30 my-4"
                    >
                      <div className="font-bold text-emerald-800 dark:text-emerald-400 mb-2 font-kufi text-lg">التفسير الميسر:</div>
                      {tafsirData[idx]?.text}
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
