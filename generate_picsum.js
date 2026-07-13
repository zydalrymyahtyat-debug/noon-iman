const fs = require('fs');

const ids = {
  quranImg: 'https://picsum.photos/id/20/400/300', 
  hisnImg: 'https://picsum.photos/id/111/400/300', 
  misbahaImg: 'https://picsum.photos/id/119/400/300', 
  prayerImg: 'https://picsum.photos/id/122/400/300', 
  libraryImg: 'https://picsum.photos/id/24/400/300', 
  storiesImg: 'https://picsum.photos/id/28/400/300', 
  bannerImg: 'https://picsum.photos/id/142/600/300' 
};

async function processAll() {
  let output = '';
  for (const [key, url] of Object.entries(ids)) {
    console.log(`Downloading ${key}...`);
    try {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
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
