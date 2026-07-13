const fs = require('fs');

let libData = fs.readFileSync('src/data/library.ts', 'utf8');

const replacements = [
  {
    id: 'ruh',
    old: '<iframe src="https://archive.org/embed/faresfares41_gmail_201402" class="w-full h-[80vh] border-0 rounded-lg"></iframe>',
    type: 'text',
    sourceUrl: '/books/ruh.txt'
  },
  {
    id: 'sayd-khatir',
    old: '<iframe src="https://archive.org/embed/20211106_20211106_2008" class="w-full h-[80vh] border-0 rounded-lg"></iframe>',
    type: 'text',
    sourceUrl: '/books/sayd.txt'
  },
  {
    id: 'sirah',
    old: '<iframe src="https://archive.org/embed/mukh-sirah-nabawiyyah-ibn-hisham" class="w-full h-[80vh] border-0 rounded-lg"></iframe>',
    type: 'text',
    sourceUrl: '/books/sirah.txt'
  },
  {
    id: 'rasael-quran',
    old: '<iframe src="https://archive.org/embed/20210620_20210620_1846" class="w-full h-[80vh] border-0 rounded-lg"></iframe>',
    type: 'text',
    sourceUrl: '/books/rasael-quran.txt'
  },
  {
    id: 'rasael-nabi',
    old: '<iframe src="https://archive.org/embed/20250828_20250828_1302" class="w-full h-[80vh] border-0 rounded-lg"></iframe>',
    type: 'text',
    sourceUrl: '/books/rasael-nabi.txt'
  }
];

for (const rep of replacements) {
  libData = libData.replace(rep.old, 'يتم تحميل الكتاب كاملًا...');
  
  // also change type from 'iframe' to 'text'
  // I need to use regex because the property name might have quotes or spaces
  const regex = new RegExp(`id:\\s*'${rep.id}'[\\s\\S]*?type:\\s*'iframe'`, 'g');
  libData = libData.replace(regex, (match) => {
    return match.replace(/type:\s*'iframe'/, `type: 'text',\n    sourceUrl: '${rep.sourceUrl}'`);
  });
}

fs.writeFileSync('src/data/library.ts', libData);
