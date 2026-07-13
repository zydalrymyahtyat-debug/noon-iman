const fs = require('fs');

let libData = fs.readFileSync('src/data/library.ts', 'utf8');

// just manually overwrite the books array slice that has these 5 books
const startIndex = libData.indexOf('{  "id": "ruh",');
const endIndex = libData.indexOf('];', startIndex);

const newBooks = `
{
  "id": "ruh",
  "title": "كتاب الروح",
  "author": "ابن قيم الجوزية",
  "description": "في الكلام على أرواح الأموات والأحياء بالدلائل من الكتاب والسنة.",
  "content": "يتم تحميل الكتاب كاملًا من قاعدة البيانات...",
  "sourceUrl": "/books/ruh.txt",
  "type": "text"
},
{
  "id": "sayd-khatir",
  "title": "صيد الخاطر",
  "author": "ابن الجوزي",
  "description": "كتاب يضم تأملات وخواطر في النفس والدين والحياة، صنف فيه ابن الجوزي ما كان يخطر بباله.",
  "content": "يتم تحميل الكتاب كاملًا من قاعدة البيانات...",
  "sourceUrl": "/books/sayd.txt",
  "type": "text"
},
{
  "id": "sirah",
  "title": "السيرة النبوية",
  "author": "ابن هشام",
  "description": "من أهم مصادر السيرة النبوية، هذب فيه ابن هشام سيرة ابن إسحاق.",
  "content": "يتم تحميل الكتاب كاملًا من قاعدة البيانات...",
  "sourceUrl": "/books/sirah.txt",
  "type": "text"
},
{
  "id": "rasael-quran",
  "title": "رسائل من القرآن الكريم",
  "author": "أدهم الشرقاوي",
  "description": "تأملات وخواطر إيمانية مستوحاة من آيات القرآن الكريم. (حقوق الطبع والنشر محفوظة للمؤلف دار كلمات)",
  "content": "يتم تحميل الكتاب كاملًا من قاعدة البيانات...",
  "sourceUrl": "/books/rasael-quran.txt",
  "type": "text"
},
{
  "id": "rasael-nabi",
  "title": "رسائل من النبي صلى الله عليه وسلم",
  "author": "أدهم الشرقاوي",
  "description": "مواقف وعبر من السيرة النبوية الشريفة مصاغة بأسلوب أدبي. (حقوق الطبع والنشر محفوظة للمؤلف دار كلمات)",
  "content": "يتم تحميل الكتاب كاملًا من قاعدة البيانات...",
  "sourceUrl": "/books/rasael-nabi.txt",
  "type": "text"
}
`;

libData = libData.substring(0, startIndex) + newBooks.trim() + '\n' + libData.substring(endIndex);

fs.writeFileSync('src/data/library.ts', libData);
