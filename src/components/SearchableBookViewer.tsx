import React, { useState, useMemo, useDeferredValue } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';


const normalizeArabic = (text: string) => {
  if (!text) return "";
  return text
    .replace(/[\u0617-\u061A\u064B-\u0652]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
};

interface SearchableBookViewerProps {
  url?: string;
  isBukhari?: boolean;
}

export const SearchableBookViewer: React.FC<SearchableBookViewerProps> = ({ url, isBukhari }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  
  React.useEffect(() => {
    if (!url) return;
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        if (isBukhari && json.hadiths) {
          // Map Bukhari format
          const mapped = json.hadiths.map((h: any) => ({
            id: h.id,
            title: `حديث رقم ${h.id}`,
            content: h.arabic || h.text
          }));
          setData(mapped);
        } else if (json.chapters) {
          // Map chapters format
          const mapped = json.chapters.map((c: any, idx: number) => ({
            id: idx,
            title: c.title,
            content: c.content
          }));
          setData(mapped);
        } else {
          // Fallback
          setData([]);
        }
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [url, isBukhari]);

  const filteredData = useMemo(() => {
    if (!deferredSearchQuery.trim()) return data;
    const q = normalizeArabic(deferredSearchQuery).toLowerCase();
    return data.filter(item => 
      (item.title && normalizeArabic(item.title).toLowerCase().includes(q)) || 
      (item.content && normalizeArabic(item.content).toLowerCase().includes(q))
    );
  }, [data, deferredSearchQuery]);

  if (loading) {
    return (
      <div className="p-10 text-center font-kufi text-slate-500 flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        جاري تحميل الكتاب... (قد يستغرق بعض الوقت للكتب الكبيرة)
      </div>
    );
  }

  if (data.length === 0) {
    return <div className="p-10 text-center text-red-500 font-kufi">حدث خطأ أثناء التحميل أو الكتاب فارغ</div>;
  }

  // Virtualization is needed if we render 7000 hadiths, but standard DOM can handle 100-200 easily.
  // We'll limit to 100 initially, or maybe 200, to prevent freezing on mobile.
  const displayLimit = 150;
  const displayed = filteredData.slice(0, displayLimit);

  return (
    <div className="font-kufi space-y-6 pb-20 flex flex-col h-full">
      <div className="sticky top-0 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md pt-2 pb-4 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث في الكتاب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pr-11 pl-4 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        </div>
        <div className="text-xs text-slate-500 mt-2 text-center">
          {filteredData.length} نتيجة
        </div>
      </div>

      <div className="space-y-6">
        {displayed.map((item) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={item.id} 
            className="p-5 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl"
          >
            <h3 className="text-xl font-bold mb-4 text-teal-700 dark:text-teal-400">{item.title}</h3>
            <p className="text-slate-800 dark:text-slate-200 leading-loose text-lg whitespace-pre-wrap">{item.content}</p>
          </motion.div>
        ))}
        
        {filteredData.length === 0 && (
          <div className="text-center p-10 text-slate-500">
            لا توجد نتائج مطابقة للبحث
          </div>
        )}
        
        {filteredData.length > displayLimit && (
          <div className="text-center p-4 text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800 mt-8 pt-6">
            (تم عرض أول {displayLimit} نتيجة فقط لتجنب بطء الجهاز. يرجى استخدام البحث للوصول لنتائج محددة)
          </div>
        )}
      </div>
    </div>
  );
};
