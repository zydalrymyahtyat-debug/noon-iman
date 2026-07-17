const fs = require('fs');
const files = [
  'public/books/rasael-nabi.txt',
  'public/books/rasael-quran.txt',
  'public/books/ruh.txt',
  'public/books/sayd.txt',
  'public/books/sirah.txt'
];
for(const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  console.log(`\n--- ${f} ---\n`, content.substring(0, 150));
}
