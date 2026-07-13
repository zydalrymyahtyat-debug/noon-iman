const fs = require('fs');
const sharp = require('sharp');

const images = {
  quranImg: 'https://picsum.photos/id/1014/400/300', // books
  hisnImg: 'https://picsum.photos/id/111/400/300', // car
  misbahaImg: 'https://picsum.photos/id/119/400/300', // macbook
  prayerImg: 'https://picsum.photos/id/122/400/300', // night city
  libraryImg: 'https://picsum.photos/id/24/400/300', // book
  storiesImg: 'https://picsum.photos/id/28/400/300', // forest
  bannerImg: 'https://picsum.photos/id/142/600/300' // nature
};

async function processAll() {
  let output = '';
  // Use the local quran, hisn, prayer since they worked:
  const wikiImages = {
    quranImg: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Quran.jpg',
    hisnImg: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Dua.jpg',
    prayerImg: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Mosque.jpg',
  };
  
  for (const [key, url] of Object.entries(images)) {
    console.log(`Downloading ${key}...`);
    try {
      const fetchUrl = wikiImages[key] || url;
      const res = await fetch(fetchUrl);
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
