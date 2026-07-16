const fs = require('fs');

let libData = fs.readFileSync('src/data/library.ts', 'utf8');

// Change sourceUrl to local books/bukhari.json
libData = libData.replace(
  "sourceUrl: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.json',",
  "sourceUrl: '/books/bukhari.json',"
);

// We should also replace the books that have .json in books_json with those in /books/ ?
// Wait, the user said "صحيح البخاري اريده يكون مدموج بدون تحميل مدموج في البرنامج بدون نت"
// In src/components/SearchableBookViewer.tsx, fetch(url) is used.
// Let's check how the file is served.

fs.writeFileSync('src/data/library.ts', libData);
