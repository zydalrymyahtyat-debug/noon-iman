const fs = require('fs');
let data = fs.readFileSync('src/data/library.ts', 'utf8');

const replacements = [
  { id: 'ruh', sourceUrl: '/books_json/ruh.json' },
  { id: 'sayd-khatir', sourceUrl: '/books_json/sayd-khatir.json' },
  { id: 'sirah', sourceUrl: '/books_json/sirah.json' },
  { id: 'rasael-quran', sourceUrl: '/books_json/rasael-quran.json' },
  { id: 'rasael-nabi', sourceUrl: '/books_json/rasael-nabi.json' }
];

for (const r of replacements) {
  // We need to change type to 'json' and set sourceUrl, and remove content if we want
  const regex = new RegExp(`id:\\s*'${r.id}'[\\s\\S]*?content:\\s*'[\\s\\S]*?'`, 'g');
  
  // Wait, the content could have single quotes inside, which breaks the regex.
  // It's safer to just do a string replacement for the books array.
}
