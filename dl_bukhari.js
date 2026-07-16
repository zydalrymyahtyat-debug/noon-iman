const fs = require('fs');

async function downloadBukhari() {
  try {
    const res = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.json');
    const data = await res.json();
    fs.writeFileSync('public/books/bukhari.json', JSON.stringify(data));
    console.log('Downloaded bukhari to public/books/bukhari.json');
  } catch (err) {
    console.error('Error downloading bukhari:', err);
  }
}

downloadBukhari();
