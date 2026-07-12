import React, { useState, useEffect } from 'react';
import { quranImg } from '../assets/image-data';
import { BookOpen, ArrowRight, Loader2, Info, Bookmark as BookmarkIcon, BookmarkCheck } from 'lucide-react';
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

interface QuranViewProps {
  onFullScreenToggle?: (isFullScreen: boolean) => void;
}

export const QuranView: React.FC<QuranViewProps> = ({ onFullScreenToggle }) => {
  const [surahs, setSurahs] = useState<SurahReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<SurahReference | null>(null);

  useEffect(() => {
    if (onFullScreenToggle) {
      onFullScreenToggle(!!selectedSurah);
    }
  }, [selectedSurah, onFullScreenToggle]);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [showTafsir, setShowTafsir] = useState<{ [key: number]: boolean }>({});
  const [tafsirData, setTafsirData] = useState<{ [key: number]: string }>({});
  const [bookmark, setBookmark] = useState<{ surahNumber: number; surahName: string; ayahNumber: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('quran_bookmark');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.surahNumber === 'number') {
          setBookmark(parsed);
        } else {
          localStorage.removeItem('quran_bookmark');
        }
      } catch (e) {}
    }
  }, []);

  const saveBookmark = (surahNumber: number, surahName: string, ayahNumber: number) => {
    const newBookmark = { surahNumber, surahName, ayahNumber };
    setBookmark(newBookmark);
    localStorage.setItem('quran_bookmark', JSON.stringify(newBookmark));
  };

  useHardwareBack(!!selectedSurah, () => {
    if (selectedSurah) {
      setSelectedSurah(null);
    }
  });

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        if (cachedMeta) {
          setSurahs(cachedMeta.data.surahs.references);
          setLoading(false);
          return;
        }
        const response = await fetch('/data/meta.json');
        const data = await response.json();
        cachedMeta = data;
        setSurahs(data.data.surahs.references);
      } catch (error) {
        console.error('Error fetching surahs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, []);

  const loadSurah = async (surah: SurahReference) => {
    setSelectedSurah(surah);
    setLoadingAyahs(true);
    setAyahs([]);
    setShowTafsir({});
    setTafsirData({});
    try {
      const [quranRes, tafsirRes] = await Promise.all([
        fetch(`/data/quran/${surah.number}.json`),
        fetch(`/data/tafsir/${surah.number}.json`)
      ]);
      const data = await quranRes.json();
      setAyahs(data.ayahs || data);
      
      if (bookmark && bookmark.surahNumber === surah.number) {
        setTimeout(() => {
          const el = document.getElementById('ayah-' + bookmark.ayahNumber);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setShowTafsir({ [bookmark.ayahNumber]: true });
          }
        }, 300);
      }

      const tafsirJson = await tafsirRes.json();
      const tafsirMap: { [key: number]: string } = {};
      const tafsirList = tafsirJson.ayahs || tafsirJson;
      if (Array.isArray(tafsirList)) {
        tafsirList.forEach((ayah: any) => {
          tafsirMap[ayah.numberInSurah] = ayah.text;
        });
      }
      setTafsirData(tafsirMap);
    } catch (error) {
      console.error('Error fetching ayahs:', error);
    } finally {
      setLoadingAyahs(false);
    }
  };

  const toggleTafsir = (ayahNumber: number) => {
    setShowTafsir(prev => ({
      ...prev,
      [ayahNumber]: !prev[ayahNumber]
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-emerald-600">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-kufi text-lg">جاري تحميل السور...</p>
      </div>
    );
  }

  if (selectedSurah) {
    return (
      <div className="h-full overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto px-4 pb-24 pt-6" dir="rtl">
          <button
            onClick={() => setSelectedSurah(null)}
            className="flex items-center gap-2 text-emerald-600 mb-6 hover:text-emerald-700 transition-colors font-kufi"
          >
            <ArrowRight className="w-5 h-5" />
            <span>العودة للفهرس</span>
          </button>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-emerald-900/5 border border-emerald-50 dark:border-slate-700">
          <div className="text-center mb-10 border-b border-emerald-100 dark:border-slate-700 pb-8 relative">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-200 dark:via-emerald-900/50 to-transparent"></div>
            <h2 className="text-4xl sm:text-5xl font-quran text-emerald-800 dark:text-emerald-400 mb-4 pt-4">
              {selectedSurah.name}
            </h2>
            <div className="flex items-center justify-center gap-4 text-slate-500 dark:text-slate-400 font-kufi text-sm">
              <span className="px-3 py-1 bg-emerald-50 dark:bg-slate-700 rounded-full border border-emerald-100 dark:border-slate-600">
                {selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
              </span>
              <span className="px-3 py-1 bg-emerald-50 dark:bg-slate-700 rounded-full border border-emerald-100 dark:border-slate-600">
                {selectedSurah.numberOfAyahs} آية
              </span>
            </div>
          </div>

          {loadingAyahs ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            </div>
          ) : (
            <div className="relative">
              {/* Bismillah for all surahs except Tawbah (9) */}
              {selectedSurah.number !== 9 && (
                <div className="text-center mb-12">
                  <span className="text-4xl sm:text-5xl font-quran text-slate-800 dark:text-slate-100 leading-[2.5]">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </span>
                </div>
              )}

              <div className="text-center text-slate-400 dark:text-slate-500 mb-8 font-kufi flex items-center justify-center gap-2 text-sm bg-slate-50 dark:bg-slate-800/50 py-3 rounded-full border border-slate-100 dark:border-slate-700">
                <Info className="w-4 h-4" />
                <span>اضغط على الآية لإظهار التفسير</span>
              </div>

              <div className="leading-[3] sm:leading-[3.5] text-justify text-justify-last-center" dir="rtl">
                {ayahs.map((ayah) => (
                  <React.Fragment key={ayah.numberInSurah}>
                    <span
                      id={`ayah-${ayah.numberInSurah}`}
                      className={cn(
                        "cursor-pointer transition-colors text-[28px] sm:text-[32px] md:text-[36px] font-quran",
                        showTafsir[ayah.numberInSurah] ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded px-1" : "text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-500"
                      )}
                      onClick={() => toggleTafsir(ayah.numberInSurah)}
                    >
                      {/* Note: In the source text, Bismillah is included in Ayah 1 of Al-Fatiha. We remove it here since we display it above. */}
                      {selectedSurah.number === 1 ? ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '').replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').replace(/[\u06DF\u06E0\u06E1\u06D6\u06D7\u06D8\u06D9\u06DA\u06DB\u06DC]/g, '') : ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '').replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').replace(/[\u06DF\u06E0\u06E1\u06D6\u06D7\u06D8\u06D9\u06DA\u06DB\u06DC]/g, '')}
                      
                      <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm sm:text-base font-sans font-bold mx-2 bg-emerald-50 dark:bg-emerald-900/20 translate-y-[-0.1em]">
                        {toArabicNumeral(ayah.numberInSurah)}
                      </span>
                    </span>

                    {showTafsir[ayah.numberInSurah] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="block w-full bg-emerald-50 dark:bg-emerald-900/10 p-5 sm:p-6 rounded-2xl text-slate-700 dark:text-slate-300 text-base sm:text-lg font-sans leading-relaxed border border-emerald-100 dark:border-emerald-900/30 my-6 shadow-inner"
                      >
                        <div className="font-bold text-emerald-800 dark:text-emerald-500 mb-4 flex items-center justify-between border-b border-emerald-100 dark:border-emerald-800/50 pb-3">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            <span>التفسير الميسر</span>
                          </div>
                          <button
                            onClick={() => saveBookmark(selectedSurah.number, selectedSurah.name, ayah.numberInSurah)}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-sm font-kufi font-medium",
                              bookmark?.surahNumber === selectedSurah.number && bookmark?.ayahNumber === ayah.numberInSurah
                                ? "bg-emerald-200/50 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-400"
                                : "bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50"
                            )}
                          >
                            {bookmark?.surahNumber === selectedSurah.number && bookmark?.ayahNumber === ayah.numberInSurah ? (
                              <>
                                <BookmarkCheck className="w-4 h-4" />
                                <span>محفوظة</span>
                              </>
                            ) : (
                              <>
                                <BookmarkIcon className="w-4 h-4" />
                                <span>حفظ كعلامة</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-justify font-serif text-[17px] sm:text-[19px] leading-[1.8] opacity-90">
                          {tafsirData[ayah.numberInSurah] || "(التفسير غير متوفر)"}
                        </p>
                      </motion.div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto w-full">
      <div className="max-w-4xl mx-auto px-4 pb-24 pt-6" dir="rtl">
        <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-kufi mb-4">القرآن الكريم</h1>
        <p className="text-slate-500 dark:text-slate-400 font-kufi text-lg">اختر السورة للقراءة</p>
      </div>

      {bookmark && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => {
              const surah = surahs.find(s => s.number === bookmark.surahNumber);
              if (surah) loadSurah(surah);
            }}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-4 sm:p-6 text-white shadow-lg shadow-emerald-900/20 flex items-center justify-between group hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <BookmarkIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-emerald-50 text-sm font-medium mb-1">متابعة القراءة</p>
                <h3 className="text-xl font-bold font-kufi mb-1">سورة {bookmark.surahName}</h3>
                <p className="text-emerald-100 text-xs font-kufi">الآية {toArabicNumeral(bookmark.ayahNumber)}</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-5 h-5 text-white transform rotate-180" />
            </div>
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {surahs.map((surah) => (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={surah.number}
            onClick={() => loadSurah(surah)}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all text-right flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
                <span className="relative z-10 font-sans text-lg">{toArabicNumeral(surah.number)}</span>
              </div>
              <div>
                <h3 className="font-kufi font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">{surah.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-kufi">
                  {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
    </div>
  );
};
