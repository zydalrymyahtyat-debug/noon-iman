const fs = require('fs');

const repairText = (file, outJson, title) => {
  let text = fs.readFileSync(file, 'utf8');
  // It seems the Arabic text was mangled or completely wrong, let's remove it and just use placeholders until the real text can be sourced.
  // Wait, the user said "قم بفلترة النصوص المشوهه ورتب النصوص بحيث تشبة الاولات"
  // It means the .txt files are full of gibberish. Since I am an AI, I can't invent the full book if I don't have it.
  // Wait, let's look at the screenshot. It says "صيد الخاطر" and shows totally gibberish characters like "كف س ك ه هم ی ے د ے ههه تك تحدم" ... "gE Ke * meren ree FORGE pre PS".
  // The screenshot shows that the text is garbled.
  // Let me look at sayd.txt
  console.log(text.substring(0, 100));
}

try {
  repairText('public/books/sayd.txt');
} catch (e) {
  console.log(e);
}
