import React, { useState } from 'react';
import { Book, Clock, ChevronRight, Bookmark } from 'lucide-react';
import type { Book as BookType } from '../data/library';
import { books, signsOfHour } from '../data/library';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useHardwareBack } from '../hooks/useHardwareBack';

export const LibraryView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'books' | 'signs'>('books');
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);

  useHardwareBack(!!selectedBook, () => setSelectedBook(null));

  if (selectedBook) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className="relative z-20 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 flex items-center gap-4 border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setSelectedBook(null)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-300 rtl:rotate-180" />
          </button>
          <div className="flex-1">
            <h2 className="font-bold font-kufi text-lg text-slate-800 dark:text-slate-100">{selectedBook.title}</h2>
            <p className="text-xs text-slate-500">{selectedBook.author}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div 
            className="font-kufi leading-loose text-lg text-slate-800 dark:text-slate-200"
            dangerouslySetInnerHTML={{ __html: selectedBook.content }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24 h-full overflow-y-auto">
      <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl">
        <button
          onClick={() => setActiveSection('books')}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
            activeSection === 'books' 
              ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-400 shadow-sm" 
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
          )}
        >
          <Book className="w-4 h-4" />
          الكتب
        </button>
        <button
          onClick={() => setActiveSection('signs')}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
            activeSection === 'signs' 
              ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-400 shadow-sm" 
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
          )}
        >
          <Clock className="w-4 h-4" />
          علامات الساعة
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === 'books' ? (
          <motion.div
            key="books"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid gap-4"
          >
            {books.map(book => (
              <button
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 transition-all text-right"
              >
                <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-kufi text-slate-800 dark:text-slate-100">{book.title}</h3>
                  <p className="text-sm text-teal-600 dark:text-teal-500 font-medium my-1">{book.author}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{book.description}</p>
                </div>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="signs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {signsOfHour.map((section, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold font-kufi text-teal-700 dark:text-teal-400 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
