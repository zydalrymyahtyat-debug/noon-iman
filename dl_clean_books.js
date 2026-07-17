const fs = require('fs');

// We will construct properly formatted readable mock chapters containing famous well-known
// excerpts and the correct structure of these books, since scraping the entire full books
// (which are thousands of pages) from an external source is not feasible without a specific API.

// Actually, I can search for a few well-known chapters/quotes for each to at least make them functional and readable.
// The user says: "حاول تاخذ المواضيع والنصوص المقروءة وكتابتها في محتوى الكتب"
// This translates to: "Try to take the readable topics and texts and write them into the book content."
// This means I can extract whatever readable text is left in the garbled txt files, or I can provide a summarized version. Let's look at the txt files again to see if any readable Arabic exists.

function extractReadableArabic(filePath, titlePrefix) {
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    // Remove gibberish, keep Arabic letters, basic punctuation, and newlines
    // Arabic regex: [\u0600-\u06FF\s.,:؛،؟!"'()-]+
    const lines = text.split('\n');
    const cleanLines = [];

    for (let line of lines) {
      // Check if line contains a reasonable amount of Arabic words
      const arabicWords = line.match(/[\u0621-\u064A]+/g);
      if (arabicWords && arabicWords.length > 3) {
        // Line seems to have at least some Arabic words
        // Let's filter out non-Arabic heavy lines
        const nonArabicChars = line.replace(/[\u0600-\u06FF\s0-9.,:؛،؟!"'()-]/g, '');
        if (nonArabicChars.length < arabicWords.length) {
            cleanLines.push(line.trim());
        }
      }
    }

    if (cleanLines.length === 0) {
       return [{ title: 'مقدمة', content: 'المحتوى غير متوفر حالياً بشكل سليم.' }];
    }

    // Group into arbitrary chapters of 20 lines
    const chapters = [];
    let currentChapter = [];
    let chapterIndex = 1;

    for (let i = 0; i < cleanLines.length; i++) {
        currentChapter.push(cleanLines[i]);
        if (currentChapter.length >= 20 || i === cleanLines.length - 1) {
            chapters.push({
                title: `${titlePrefix} - جزء ${chapterIndex}`,
                content: currentChapter.join('\n\n')
            });
            currentChapter = [];
            chapterIndex++;
        }
    }
    return chapters;
  } catch(e) {
    return [{ title: 'خطأ', content: 'فشل في قراءة الملف' }];
  }
}

const booksToClean = [
  { txt: 'public/books/sayd.txt', json: 'public/books_json/sayd-khatir.json', prefix: 'صيد الخاطر' },
  { txt: 'public/books/ruh.txt', json: 'public/books_json/ruh.json', prefix: 'كتاب الروح' },
  { txt: 'public/books/sirah.txt', json: 'public/books_json/sirah.json', prefix: 'السيرة النبوية' },
  { txt: 'public/books/rasael-quran.txt', json: 'public/books_json/rasael-quran.json', prefix: 'رسائل من القرآن' },
  { txt: 'public/books/rasael-nabi.txt', json: 'public/books_json/rasael-nabi.json', prefix: 'رسائل من النبي' }
];

booksToClean.forEach(b => {
    const chapters = extractReadableArabic(b.txt, b.prefix);
    fs.writeFileSync(b.json, JSON.stringify({ chapters }, null, 2));
    console.log(`Saved ${chapters.length} chapters to ${b.json}`);
});
