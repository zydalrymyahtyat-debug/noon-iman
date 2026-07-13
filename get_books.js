const fs = require('fs');

async function downloadWikiSource(title, filename) {
  try {
    const res = await fetch(`https://ar.wikisource.org/w/api.php?action=query&prop=extracts&titles=${encodeURIComponent(title)}&format=json&explaintext=1`);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId !== '-1') {
      fs.writeFileSync(`public/books/${filename}`, pages[pageId].extract);
      console.log(`Saved ${filename} (${pages[pageId].extract.length} chars)`);
    } else {
      console.log(`Not found: ${title}`);
    }
  } catch(e) {
    console.error(e);
  }
}

downloadWikiSource("كتاب الروح", "ruh.txt");
downloadWikiSource("صيد الخاطر", "sayd.txt");
downloadWikiSource("السيرة النبوية (ابن هشام)", "sirah.txt");
downloadWikiSource("صحيح البخاري", "bukhari_wiki.txt");
