const fs = require('fs');
const https = require('https');
const sharp = require('sharp');

const images = {
  quranImg: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Quran.jpg',
  hisnImg: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Dua.jpg',
  misbahaImg: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Masbaha.jpg',
  prayerImg: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Mosque.jpg',
  libraryImg: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Two_bookshelves_full_of_books_belonging_to_Unitedmissionary_%282010%29.jpg',
  storiesImg: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Desert.jpg',
  bannerImg: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Kaaba.jpg'
};

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function processAll() {
  let output = '';
  for (const [key, url] of Object.entries(images)) {
    console.log(`Downloading ${key}...`);
    try {
      const buffer = await download(url);
      const resized = await sharp(buffer)
        .resize({ width: 400 })
        .jpeg({ quality: 60 })
        .toBuffer();
      const b64 = resized.toString('base64');
      output += `export const ${key} = "data:image/jpeg;base64,${b64}";\n`;
    } catch (e) {
      console.error(`Failed for ${key}`, e);
    }
  }
  fs.writeFileSync('src/assets/image-data.ts', output);
  console.log('Done!');
}

processAll();
