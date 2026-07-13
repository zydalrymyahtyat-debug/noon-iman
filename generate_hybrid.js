const fs = require('fs');
const sharp = require('sharp');

const images = {
  quranImg: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Quran.jpg',
  hisnImg: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Dua.jpg',
  misbahaImg: 'https://images.unsplash.com/photo-1597818461759-42b781e05030?q=80&w=400',
  prayerImg: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Mosque.jpg',
  libraryImg: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400',
  storiesImg: 'https://images.unsplash.com/photo-1473211585761-fa996966ddbc?q=80&w=400',
  bannerImg: 'https://images.unsplash.com/photo-1565552643950-c834a36f52e5?q=80&w=600'
};

async function processAll() {
  let output = '';
  for (const [key, url] of Object.entries(images)) {
    console.log(`Downloading ${key}...`);
    try {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const resized = await sharp(buffer)
        .resize({ width: 300 })
        .jpeg({ quality: 60 })
        .toBuffer();
        
      const b64 = resized.toString('base64');
      output += `export const ${key} = "data:image/jpeg;base64,${b64}";\n`;
      console.log(`${key} ok (${resized.length} bytes)`);
    } catch (e) {
      console.error(`Failed for ${key}`, e.message);
    }
  }
  fs.writeFileSync('src/assets/image-data.ts', output);
  console.log('Done!');
}

processAll();
