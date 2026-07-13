const fs = require('fs');
const https = require('https');

const images = {
  quranImg: 'https://images.unsplash.com/photo-1609599006353-e58fa266f8db?q=80&w=400',
  hisnImg: 'https://images.unsplash.com/photo-1564349683136-277ee4ed2747?q=80&w=400',
  misbahaImg: 'https://images.unsplash.com/photo-1579737158735-e65330366eb6?q=80&w=400',
  prayerImg: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=400',
  libraryImg: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400',
  storiesImg: 'https://images.unsplash.com/photo-1473211585761-fa996966ddbc?q=80&w=400',
  bannerImg: 'https://images.unsplash.com/photo-1565552643950-c834a36f52e5?q=80&w=600'
};

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
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
      const b64 = buffer.toString('base64');
      // Unsplash responds with JPEG usually if it's the raw image url with w=400
      output += `export const ${key} = "data:image/jpeg;base64,${b64}";\n`;
      console.log(`${key} ok (${buffer.length} bytes)`);
    } catch (e) {
      console.error(`Failed for ${key}`, e);
    }
  }
  fs.writeFileSync('src/assets/image-data.ts', output);
  console.log('Done!');
}

processAll();
