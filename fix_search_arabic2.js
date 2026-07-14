const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/SearchableBookViewer.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "(item.title && item.title.toLowerCase().includes(q)) ||",
  "(item.title && normalizeArabic(item.title).toLowerCase().includes(q)) ||"
);

content = content.replace(
  "(item.content && item.content.toLowerCase().includes(q))",
  "(item.content && normalizeArabic(item.content).toLowerCase().includes(q))"
);

fs.writeFileSync(file, content);
console.log("Updated SearchableBookViewer.tsx with Arabic normalization part 2");
