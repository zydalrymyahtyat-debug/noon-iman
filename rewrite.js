const fs = require('fs');
let content = fs.readFileSync('src/views/QuranView.tsx', 'utf8');

// Update bookmark state type
content = content.replace(
  'const [bookmark, setBookmark] = useState<{ number: number; name: string } | null>(null);',
  'const [bookmark, setBookmark] = useState<{ surahNumber: number; surahName: string; ayahNumber: number } | null>(null);'
);

// Update saveBookmark function
content = content.replace(
  /const saveBookmark = \(surah: SurahReference\) => \{[\s\S]*?localStorage\.setItem.*?\n  \};/,
  `const saveBookmark = (surahNumber: number, surahName: string, ayahNumber: number) => {
    const newBookmark = { surahNumber, surahName, ayahNumber };
    setBookmark(newBookmark);
    localStorage.setItem('quran_bookmark', JSON.stringify(newBookmark));
  };`
);

// Remove the old bookmark button from the header
content = content.replace(
  /<div className="flex items-center justify-between mb-6">[\s\S]*?<\/button>\n\s*<\/div>/,
  `<button
            onClick={() => setSelectedSurah(null)}
            className="flex items-center gap-2 text-emerald-600 mb-6 hover:text-emerald-700 transition-colors font-kufi"
          >
            <ArrowRight className="w-5 h-5" />
            <span>العودة للفهرس</span>
          </button>`
);

// Update the "continue reading" button in the surahs list
content = content.replace(
  /const surah = surahs\.find\(s => s\.number === bookmark\.number\);/,
  `const surah = surahs.find(s => s.number === bookmark.surahNumber);`
);

content = content.replace(
  /<h3 className="text-xl font-bold font-kufi">سورة \{bookmark\.name\}<\/h3>/,
  `<h3 className="text-xl font-bold font-kufi mb-1">سورة {bookmark.surahName}</h3>
                <p className="text-emerald-100 text-xs font-kufi">الآية {toArabicNumeral(bookmark.ayahNumber)}</p>`
);


// Scroll to ayah logic
content = content.replace(
  'setAyahs(data.ayahs || data);',
  `setAyahs(data.ayahs || data);
      
      if (bookmark && bookmark.surahNumber === surah.number) {
        setTimeout(() => {
          const el = document.getElementById('ayah-' + bookmark.ayahNumber);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setShowTafsir({ [bookmark.ayahNumber]: true });
          }
        }, 300);
      }`
);


// Update Ayah rendering to add ID and bookmark button
content = content.replace(
  '<span\n                      className={cn(\n                        "cursor-pointer transition-colors',
  '<span\n                      id={`ayah-${ayah.numberInSurah}`}\n                      className={cn(\n                        "cursor-pointer transition-colors'
);

content = content.replace(
  /<div className="font-bold text-emerald-800 dark:text-emerald-500 mb-3 flex items-center gap-2">\n\s*<BookOpen className="w-5 h-5" \/>\n\s*<span>التفسير الميسر<\/span>\n\s*<\/div>/,
  `<div className="font-bold text-emerald-800 dark:text-emerald-500 mb-4 flex items-center justify-between border-b border-emerald-100 dark:border-emerald-800/50 pb-3">
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
                        </div>`
);

fs.writeFileSync('src/views/QuranView.tsx', content);
