const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/components/SearchableBookViewer.tsx');
let content = fs.readFileSync(file, 'utf8');

const normalizeFunc = `
const normalizeArabic = (text: string) => {
  if (!text) return "";
  return text
    .replace(/[\\u0617-\\u061A\\u064B-\\u0652]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
};
`;

// Insert after imports
content = content.replace("interface SearchableBookViewerProps", normalizeFunc + "\ninterface SearchableBookViewerProps");

// Update search logic
content = content.replace(
  "const q = deferredSearchQuery.toLowerCase();",
  "const q = normalizeArabic(deferredSearchQuery).toLowerCase();"
);

content = content.replace(
  "return data.filter(item => \n       (item.title && item.title.toLowerCase().includes(q)) || \n       (item.content && item.content.toLowerCase().includes(q))\n    );",
  "return data.filter(item => \n       (item.title && normalizeArabic(item.title).toLowerCase().includes(q)) || \n       (item.content && normalizeArabic(item.content).toLowerCase().includes(q))\n    );"
);

fs.writeFileSync(file, content);
console.log("Updated SearchableBookViewer.tsx with Arabic normalization");
