const fs = require('fs');

let libData = fs.readFileSync('src/data/library.ts', 'utf8');

// The books are currently using dummy JSON files generated from .txt files
// The user wants: "إذا لم يكن النص الكامل لأي كتاب متوفر داخل المشروع، فلا تقم باختلاقه أو كتابة ملخص أو محتوى غير صحيح. بدلاً من ذلك أنشئ بطاقة الكتاب مع عبارة: سيتم إضافة محتوى الكتاب لاحقًا"
// We don't have the real text for sayd-khatir, sirah, ruh, rasael-nabi, rasael-quran.
// And Bukhari... wait, for Bukhari, we downloaded the real JSON file! We can keep bukhari.json.
// But the user said "اريد ان تركز في قسم الكتب كتاب صحيح البخاري اريده يكون مدموج بدون تحميل مدموج في البرنامج بدون نت"
// Since bukhari.json is 20MB, it's better to fetch it from the local /books/bukhari.json as we did, or we can compile it into a .ts file?
// The user wants it "تكملة الكتب التالية داخل التطبيق، وتكون قابلة للقراءة كنص داخل التطبيق بدون انترنت"
// Since we don't have the real content for the other books, we should set their content to "سيتم إضافة محتوى الكتاب لاحقًا." and remove sourceUrl.
// Let's modify the library.ts to reflect this.

const updates = [
  { id: 'ruh', title: 'كتاب الروح', author: 'ابن قيم الجوزية', desc: 'في الكلام على أرواح الأموات والأحياء بالدلائل من الكتاب والسنة.' },
  { id: 'sayd-khatir', title: 'صيد الخاطر', author: 'ابن الجوزي', desc: 'كتاب يضم تأملات وخواطر في النفس والدين والحياة، صنف فيه ابن الجوزي ما كان يخطر بباله.' },
  { id: 'sirah', title: 'السيرة النبوية', author: 'ابن هشام', desc: 'من أهم مصادر السيرة النبوية، هذب فيه ابن هشام سيرة ابن إسحاق.' },
  { id: 'rasael-quran', title: 'رسائل من القرآن الكريم', author: 'أدهم الشرقاوي', desc: 'تأملات وخواطر إيمانية مستوحاة من آيات القرآن الكريم.' },
  { id: 'rasael-nabi', title: 'رسائل من النبي صلى الله عليه وسلم', author: 'أدهم الشرقاوي', desc: 'مواقف وعبر من السيرة النبوية الشريفة مصاغة بأسلوب أدبي.' }
];

updates.forEach(book => {
  const regex = new RegExp(`{\\s*id:\\s*'${book.id}',[\\s\\S]*?type:\\s*'json'\\s*}`);
  const replacement = `{
    id: '${book.id}',
    title: '${book.title}',
    author: '${book.author}',
    description: '${book.desc}',
    content: '<h3 class="text-xl font-bold mb-4 text-teal-700 text-center mt-10">سيتم إضافة محتوى الكتاب لاحقًا</h3>',
    type: 'text'
  }`;
  libData = libData.replace(regex, replacement);
});

fs.writeFileSync('src/data/library.ts', libData);
