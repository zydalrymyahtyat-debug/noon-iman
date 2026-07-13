const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const images = {
  quranImg: 'quran.jpg',
  hisnImg: 'book.jpg',
  misbahaImg: 'misbaha.jpg',
  prayerImg: 'prayer.jpg',
  libraryImg: 'library.jpg',
  storiesImg: 'stories.jpg',
  bannerImg: 'kaaba.jpg'
};

async function processAll() {
  let output = '';
  for (const [key, filename] of Object.entries(images)) {
    console.log(`Processing ${key}...`);
    try {
      const buffer = await sharp(filename)
        .resize(400, 300, { fit: 'cover' })
        .jpeg({ quality: 60 })
        .toBuffer();
      const b64 = buffer.toString('base64');
      output += `export const ${key} = "data:image/jpeg;base64,${b64}";\n`;
      console.log(`${key} ok (${buffer.length} bytes)`);
    } catch (e) {
      console.error(`Failed for ${key}`, e.message);
    }
  }
  fs.writeFileSync('src/assets/image-data.ts', output);
  console.log('Done!');
}

processAll();
