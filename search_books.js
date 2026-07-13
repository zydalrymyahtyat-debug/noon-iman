const fs = require('fs');

async function searchWikiSource(title) {
  const url = `https://ar.wikisource.org/w/api.php?action=query&prop=extracts&titles=${encodeURIComponent(title)}&format=json&explaintext=1`;
  const res = await fetch(url);
  const data = await res.json();
  const pages = data.query.pages;
  const pageId = Object.keys(pages)[0];
  if (pageId !== '-1') {
    console.log(`Found ${title}, length: ${pages[pageId].extract.length}`);
  } else {
    console.log(`Not found: ${title}`);
  }
}

searchWikiSource("كتاب الروح");
searchWikiSource("صيد الخاطر");
searchWikiSource("السيرة النبوية لابن هشام");
searchWikiSource("السيرة النبوية (ابن هشام)");
