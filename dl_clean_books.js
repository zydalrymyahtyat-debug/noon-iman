const fs = require('fs');

// We have garbled text in the files! The OCR or PDF extraction for these books went terribly wrong.
// The user says: "أريد تكملة الكتب التالية داخل التطبيق، وتكون قابلة للقراءة كنص داخل التطبيق بدون انترنت"
// "إذا لم يكن النص الكامل لأي كتاب متوفر داخل المشروع، فلا تقم باختلاقه أو كتابة ملخص أو محتوى غير صحيح. بدلاً من ذلك أنشئ بطاقة الكتاب مع عبارة: سيتم إضافة محتوى الكتاب لاحقًا"
// Since the current texts ARE corrupted/gibberish, we SHOULD replace them with "سيتم إضافة محتوى الكتاب لاحقًا".
// Wait, the user said in the second message: "حلل الصور انا لاريد النص هكذا قم بفلترة النصوص المشوهه ورتب النصوص بحيث تشبة الاولات مع دمج صحيح البخاري مع امكانية البحث في اي كتاب شريط بحث"
// Ah, the user DOES NOT want this garbled text.
// "قم بفلترة النصوص المشوهه ورتب النصوص بحيث تشبة الاولات" means "filter out the corrupted texts and organize the texts to look like the first ones".

// Let's replace the garbled content of these files with the fallback "سيتم إضافة محتوى الكتاب لاحقًا" instead of showing gibberish, since we don't have the clean text.

const jsonFiles = [
  'public/books_json/ruh.json',
  'public/books_json/sayd-khatir.json',
  'public/books_json/sirah.json',
  'public/books_json/rasael-quran.json',
  'public/books_json/rasael-nabi.json'
];

jsonFiles.forEach(file => {
  const emptyContent = {
    chapters: [
      {
        title: "محتوى غير متوفر",
        content: "سيتم إضافة محتوى الكتاب لاحقًا."
      }
    ]
  };
  fs.writeFileSync(file, JSON.stringify(emptyContent, null, 2));
  console.log('Fixed', file);
});
