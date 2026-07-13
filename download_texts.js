const fs = require('fs');

async function download(identifier, filename, outName) {
  const url = `https://archive.org/download/${identifier}/${encodeURIComponent(filename)}`;
  console.log(`Downloading ${url}...`);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed to download ${outName}: ${res.statusText}`);
    return;
  }
  const text = await res.text();
  fs.writeFileSync(`public/books/${outName}`, text);
  console.log(`Saved ${outName} (${text.length} chars)`);
}

async function main() {
  await download('20210620_20210620_1846', 'أدهم الشرقاوي، رسائل من القرآن_djvu.txt', 'rasael-quran.txt');
  await download('20250828_20250828_1302', 'رسائل من النبي_djvu.txt', 'rasael-nabi.txt');
  await download('sarayassaf_gmail_201703', 'كتاب الروح لابن القيم_djvu.txt', 'ruh.txt');
  await download('aakamel18_gmail_20190131', 'صيد الخاطر - مدار الوطن_djvu.txt', 'sayd.txt');
  await download('20240616_20240616_1730', 'السيرة النبوية لابن هشام_djvu.txt', 'sirah.txt');
}

main();
