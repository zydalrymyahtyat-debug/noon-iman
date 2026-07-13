const fs = require('fs');

let libData = fs.readFileSync('src/data/library.ts', 'utf8');

const missingBukhari = `
{
  "id": "bukhari",
  "title": "صحيح البخاري",
  "author": "الإمام محمد بن إسماعيل البخاري",
  "description": "أصح كتاب بعد كتاب الله تعالى، جامع للأحاديث الصحيحة الواردة عن النبي صلى الله عليه وسلم.",
  "content": "يتم تحميل الكتاب كاملًا من قاعدة البيانات...",
  "sourceUrl": "/books/bukhari.json",
  "type": "json"
},
`;

const startIndex = libData.indexOf('{  "id": "ruh",');
libData = libData.substring(0, startIndex) + missingBukhari + libData.substring(startIndex);

fs.writeFileSync('src/data/library.ts', libData);
