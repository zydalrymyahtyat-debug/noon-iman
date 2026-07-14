import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, ArrowLeft, Loader2, Bookmark as BookmarkIcon, BookmarkCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  page: number;
  juz: number;
  hizbQuarter: number;
  surahNumber: number;
  surahName: string;
}

const toArabicNumeral = (n: number) => {
  return n.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
};

const startPages = [
  1, 2, 50, 77, 106, 128, 151, 177, 187, 208, 221, 235, 249, 255, 262, 267, 282, 293, 305, 312, 322,
  332, 342, 350, 359, 367, 377, 385, 396, 404, 411, 415, 418, 428, 434, 440, 446, 453, 458, 467,
  477, 483, 489, 496, 499, 502, 507, 511, 515, 518, 520, 523, 526, 528, 531, 534, 537, 542, 545,
  549, 551, 553, 554, 556, 558, 560, 562, 564, 566, 568, 570, 572, 574, 575, 577, 578, 580, 582,
  583, 585, 586, 587, 587, 589, 590, 591, 591, 592, 593, 594, 595, 595, 596, 596, 597, 597, 598,
  598, 599, 599, 600, 600, 601, 601, 601, 602, 602, 602, 603, 603, 603, 604, 604, 604
];

let cachedMeta: any = null;

interface QuranViewProps {
  onFullScreenToggle?: (isFullScreen: boolean) => void;
}

export const QuranView: React.FC<QuranViewProps> = ({ onFullScreenToggle }) => {
  const [surahs, setSurahs] = useState<SurahReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  
  const [pageAyahs, setPageAyahs] = useState<Ayah[]>([]);
  const [pageTafsir, setPageTafsir] = useState<{ [key: string]: string }>({});
  const [loadingPage, setLoadingPage] = useState(false);
  
  const [selectedTafsir, setSelectedTafsir] = useState<{ surahName: string, ayahNumber: number, text: string } | null>(null);
  
  const [bookmark, setBookmark] = useState<{ page: number; surahName: string; ayahNumber: number } | null>(null);

  useEffect(() => {
    if (onFullScreenToggle) {
      onFullScreenToggle(!!currentPage);
    }
  }, [currentPage, onFullScreenToggle]);

  useEffect(() => {
    const saved = localStorage.getItem('quran_bookmark_v2');
    if (saved) {
      try {
        setBookmark(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing bookmark', e);
      }
    }

    const fetchMeta = async () => {
      if (cachedMeta) {
        setSurahs(cachedMeta);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/data/meta.json');
        const data = await response.json();
        const surahsList = data.surahs?.references || data.data?.surahs?.references;
        cachedMeta = surahsList;
        setSurahs(surahsList);
      } catch (error) {
        console.error('Error fetching surahs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, []);

  useHardwareBack(currentPage !== null, () => {
    if (selectedTafsir) {
      setSelectedTafsir(null);
      window.history.pushState({ layer: true, appInit: true }, '');
    } else {
      setCurrentPage(null);
    }
  });

  const loadPage = async (p: number) => {
    if (p < 1 || p > 604) return;
    setCurrentPage(p);
    setLoadingPage(true);
    setPageAyahs([]);
    setPageTafsir({});
    setSelectedTafsir(null);

    try {
      const surahsToLoad: number[] = [];
      for (let s = 0; s < 114; s++) {
        if (startPages[s] <= p && (s === 113 || startPages[s + 1] >= p)) {
          surahsToLoad.push(s + 1);
        }
      }

      const allAyahs: Ayah[] = [];
      const allTafsir: { [key: string]: string } = {};

      for (const surahNum of surahsToLoad) {
        const qRes = await fetch(`/data/quran/${surahNum}.json`);
        const qData = await qRes.json();
        const ayahsList = qData.ayahs || qData.data.ayahs;
        const surahName = qData.name || qData.data.name;

        const tRes = await fetch(`/data/tafsir/${surahNum}.json`);
        const tData = await tRes.json();
        const tafsirList = tData.ayahs || tData.data?.ayahs;
        
        let tMap: { [key: number]: string } = {};
        if (Array.isArray(tafsirList)) {
          tafsirList.forEach((ayah: any) => {
            tMap[ayah.numberInSurah] = ayah.text;
          });
        } else if (typeof tData === 'object' && tData !== null) {
          tMap = tData;
        }

        const filteredAyahs = ayahsList.filter((a: any) => a.page === p).map((a: any) => ({
          ...a,
          surahNumber: surahNum,
          surahName: surahName
        }));

        allAyahs.push(...filteredAyahs);

        for (const a of filteredAyahs) {
          allTafsir[`${surahNum}-${a.numberInSurah}`] = tMap[a.numberInSurah] || "(التفسير غير متوفر)";
        }
      }

      allAyahs.sort((a, b) => {
        if (a.surahNumber === b.surahNumber) return a.numberInSurah - b.numberInSurah;
        return a.surahNumber - b.surahNumber;
      });

      setPageAyahs(allAyahs);
      setPageTafsir(allTafsir);
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      setLoadingPage(false);
    }
  };

  const saveBookmark = (page: number, surahName: string, ayahNumber: number) => {
    const newBookmark = { page, surahName, ayahNumber };
    setBookmark(newBookmark);
    localStorage.setItem('quran_bookmark_v2', JSON.stringify(newBookmark));
  };

  const stripBismillah = (text: string, surahNum: number, ayahNum: number) => {
    if (surahNum === 1) return text;
    if (ayahNum === 1) {
      return text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '').replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '');
    }
    return text;
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // Check if we are at the bottom
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
    
    // Swipe up
    if (isAtBottom && touchStartY.current - touchEndY.current > 60) {
      if (currentPage < 604) {
        loadPage(currentPage + 1);
      }
    }
    
    // Check if we are at the top
    const isAtTop = scrollTop <= 20;
    
    // Swipe down
    if (isAtTop && touchEndY.current - touchStartY.current > 60) {
      if (currentPage > 1) {
        loadPage(currentPage - 1);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (currentPage !== null) {
    const firstAyah = pageAyahs[0];
    const headerJuz = firstAyah ? firstAyah.juz : '';
    const headerSurah = firstAyah && firstAyah.surahName ? firstAyah.surahName.replace('سُورَةُ', '').trim() : '';

    return (
      <div 
        ref={scrollContainerRef}
        className="h-full w-full bg-[#f8fafc] dark:bg-[#0f172a] flex flex-col items-center overflow-y-auto" 
        dir="rtl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full max-w-3xl flex items-center justify-between p-4 sticky top-0 z-10 bg-[#f8fafc]/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setCurrentPage(null)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-kufi"
          >
            <ArrowRight className="w-5 h-5" />
            <span>الفهرس</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadPage(currentPage + 1)}
              disabled={currentPage >= 604}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            <span className="font-kufi font-medium text-slate-700 dark:text-slate-300 px-2 min-w-[3rem] text-center">
              {toArabicNumeral(currentPage)}
            </span>
            <button
              onClick={() => loadPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </div>

        <div className="w-full max-w-[600px] px-2 sm:px-4 py-6 flex flex-col items-center mb-12">
          {loadingPage ? (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500/50" />
            </div>
          ) : (
            <div className="w-full bg-[#fffdf7] dark:bg-[#1e293b] border-[10px] sm:border-[16px] border-[#eaddc5] dark:border-[#334155] p-4 sm:p-6 rounded-sm shadow-xl flex flex-col min-h-[70vh] sm:min-h-[85vh] relative">
              
              <div className="flex justify-between items-center border-b-2 border-[#d4c5ab] dark:border-[#475569] pb-2 mb-4 font-quran text-lg sm:text-xl text-[#8b7355] dark:text-[#cbd5e1]">
                <span>سورة {headerSurah}</span>
                <span>الجزء {toArabicNumeral(Number(headerJuz))}</span>
              </div>

              <div className="flex-1 w-full flex flex-col">
                {Object.entries(
                  pageAyahs.reduce((acc, ayah) => {
                    if (!acc[ayah.surahNumber]) acc[ayah.surahNumber] = [];
                    acc[ayah.surahNumber].push(ayah);
                    return acc;
                  }, {} as { [key: number]: Ayah[] })
                ).map(([surahNumStr, ayahs]) => {
                  const surahNum = parseInt(surahNumStr);
                  const firstAyah = ayahs[0];
                  const isSurahStart = firstAyah.numberInSurah === 1;
                  const surahRef = surahs.find(s => s.number === surahNum);

                  return (
                    <div key={surahNum} className="w-full flex flex-col items-center mb-2">
                      {isSurahStart && (
                        <div className="w-full flex flex-col items-center my-4">
                          <div className="w-[90%] sm:w-[80%] h-14 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-[#f1f5f9] dark:bg-[#0f172a] border border-[#cbd5e1] dark:border-[#334155] rounded-md flex items-center justify-between px-4 shadow-sm mb-3 overflow-hidden relative">
                             <div className="absolute inset-0 opacity-10 bg-emerald-700 mix-blend-multiply"></div>
                             <span className="font-quran text-lg sm:text-xl text-slate-800 dark:text-slate-200 relative z-10 flex-1 text-right">سُورَةُ {firstAyah && firstAyah.surahName ? firstAyah.surahName.replace('سُورَةُ', '').trim() : ''}</span>
                             <span className="font-quran text-base sm:text-lg text-slate-700 dark:text-slate-400 relative z-10 flex-1 text-left">آياتها {surahRef?.numberOfAyahs ? toArabicNumeral(surahRef.numberOfAyahs) : ''}</span>
                          </div>
                          {surahNum !== 9 && surahNum !== 1 && (
                            <div className="font-quran text-[26px] sm:text-[30px] text-slate-800 dark:text-slate-100 my-2">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
                          )}
                          {surahNum === 1 && (
                            <div className="font-quran text-[26px] sm:text-[30px] text-slate-800 dark:text-slate-100 my-2">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
                          )}
                        </div>
                      )}
                      
                      <div className="w-full text-justify text-slate-900 dark:text-slate-50" style={{ textAlignLast: 'center' }}>
                        {ayahs.map(ayah => {
                          const isActive = selectedTafsir?.surahName === ayah.surahName && selectedTafsir?.ayahNumber === ayah.numberInSurah;
                          return (
                            <React.Fragment key={`${ayah.surahNumber}-${ayah.numberInSurah}`}>
                              <span 
                                onClick={() => {
                                  setSelectedTafsir({
                                    surahName: ayah.surahName,
                                    ayahNumber: ayah.numberInSurah,
                                    text: pageTafsir[`${ayah.surahNumber}-${ayah.numberInSurah}`]
                                  });
                                  saveBookmark(currentPage, ayah.surahName, ayah.numberInSurah);
                                }}
                                className={cn(
                                  "inline font-quran text-[26px] sm:text-[30px] md:text-[34px] leading-[2.4] cursor-pointer transition-colors px-0.5 rounded",
                                  isActive 
                                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300" 
                                    : "hover:text-emerald-700 dark:hover:text-emerald-400"
                                )}
                              >
                                {stripBismillah(ayah.text, ayah.surahNumber, ayah.numberInSurah)}
                                <span className="inline-flex items-center justify-center text-emerald-800 dark:text-emerald-400 font-sans mx-1 relative w-[2.5em] h-[2.5em] align-middle translate-y-[-0.15em]">
                                  <span className="opacity-50 select-none text-[36px] sm:text-[40px] absolute inset-0 flex items-center justify-center font-quran font-normal" style={{lineHeight: 1}}>۝</span>
                                  <span className="relative z-10 pt-1.5 text-[15px] sm:text-[17px] font-bold text-slate-700 dark:text-slate-300">{toArabicNumeral(ayah.numberInSurah)}</span>
                                </span>
                              </span>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center items-center border-t-2 border-[#d4c5ab] dark:border-[#475569] pt-2 mt-4 font-quran text-lg sm:text-xl text-[#8b7355] dark:text-[#cbd5e1]">
                <span>{toArabicNumeral(currentPage)}</span>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedTafsir && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTafsir(null)}
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-4 sm:p-6"
            >
              <motion.div 
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                onClick={e => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 max-h-[85vh] flex flex-col"
              >
                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-kufi font-bold text-lg">{(selectedTafsir.surahName || '').replace('سُورَةُ', '')}</h3>
                      <p className="font-sans text-sm opacity-80">الآية {toArabicNumeral(selectedTafsir.ayahNumber)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedTafsir(null)}
                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5 sm:p-8 overflow-y-auto font-serif text-[19px] sm:text-[21px] leading-[1.8] text-justify text-slate-800 dark:text-slate-200">
                  {selectedTafsir.text}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-kufi text-sm">
                    <BookmarkCheck className="w-4 h-4" />
                    <span>تم الحفظ كعلامة للقراءة</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
              onClick={() => loadPage(bookmark.page)}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-4 sm:p-6 text-white shadow-lg shadow-emerald-900/20 flex items-center justify-between group hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <BookmarkIcon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-emerald-50 text-sm font-medium mb-1">متابعة القراءة</p>
                  <h3 className="text-xl font-bold font-kufi mb-1">{(bookmark.surahName || '').replace('سُورَةُ', '')}</h3>
                  <p className="text-emerald-100 text-xs font-kufi">صفحة {toArabicNumeral(bookmark.page || 1)} {bookmark.ayahNumber ? `• الآية ${toArabicNumeral(bookmark.ayahNumber)}` : ''}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </div>
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {surahs.map((surah, index) => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={surah.number}
              onClick={() => loadPage(startPages[index])}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all text-right flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
                  <span className="relative z-10 font-sans text-lg">{toArabicNumeral(surah.number)}</span>
                </div>
                <div>
                  <h3 className="font-kufi font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">{(surah.name || '').replace('سُورَةُ', '')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-kufi">
                    {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • صفحة {toArabicNumeral(startPages[index])}
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
