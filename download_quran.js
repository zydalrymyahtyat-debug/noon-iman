const https = require('https');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log("Downloading quran.json...");
  await download('https://api.alquran.cloud/v1/quran/quran-uthmani', 'public/data/quran.json');
  console.log("Downloading tafsir.json...");
  await download('https://api.alquran.cloud/v1/quran/ar.muyassar', 'public/data/tafsir.json');
  console.log("Downloading meta.json...");
  await download('https://api.alquran.cloud/v1/meta', 'public/data/meta.json');
  console.log("Done");
}

main().catch(console.error);
