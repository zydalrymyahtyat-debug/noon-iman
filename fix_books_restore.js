const fs = require('fs');

let libData = fs.readFileSync('src/data/library.ts', 'utf8');

// The books are currently using dummy JSON files generated from .txt files
// The user wants: "أريد تكملة الكتب التالية داخل التطبيق، وتكون قابلة للقراءة كنص داخل التطبيق بدون انترنت"
// Since we DO have the real content for the other books in `public/books/*.txt`, we should restore the `sourceUrl` and `type` to 'json'.

const updates = [
  { id: 'bukhari', title: 'صحيح البخاري', author: 'الإمام محمد بن إسماعيل البخاري', desc: 'أصح كتاب بعد كتاب الله تعالى، جامع للأحاديث الصحيحة الواردة عن النبي صلى الله عليه وسلم.', url: '/books/bukhari.json', content: 'يتم تحميل الكتاب كاملًا من قاعدة البيانات...' },
  { id: 'ruh', title: 'كتاب الروح', author: 'ابن قيم الجوزية', desc: 'في الكلام على أرواح الأموات والأحياء بالدلائل من الكتاب والسنة.', url: '/books_json/ruh.json' },
  { id: 'sayd-khatir', title: 'صيد الخاطر', author: 'ابن الجوزي', desc: 'كتاب يضم تأملات وخواطر في النفس والدين والحياة، صنف فيه ابن الجوزي ما كان يخطر بباله.', url: '/books_json/sayd-khatir.json' },
  { id: 'sirah', title: 'السيرة النبوية', author: 'ابن هشام', desc: 'من أهم مصادر السيرة النبوية، هذب فيه ابن هشام سيرة ابن إسحاق.', url: '/books_json/sirah.json' },
  { id: 'rasael-quran', title: 'رسائل من القرآن الكريم', author: 'أدهم الشرقاوي', desc: 'تأملات وخواطر إيمانية مستوحاة من آيات القرآن الكريم.', url: '/books_json/rasael-quran.json' },
  { id: 'rasael-nabi', title: 'رسائل من النبي صلى الله عليه وسلم', author: 'أدهم الشرقاوي', desc: 'مواقف وعبر من السيرة النبوية الشريفة مصاغة بأسلوب أدبي.', url: '/books_json/rasael-nabi.json' }
];

updates.forEach(book => {
  const regex = new RegExp(`{\\s*id:\\s*'${book.id}',[\\s\\S]*?}`);
  const replacement = `{
    id: '${book.id}',
    title: '${book.title}',
    author: '${book.author}',
    description: '${book.desc}',
    content: '${book.content || ''}',
    sourceUrl: '${book.url}',
    type: 'json'
  }`;
  libData = libData.replace(regex, replacement);
});

fs.writeFileSync('src/data/library.ts', libData);
