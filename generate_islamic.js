const fs = require('fs');

const images = {
  quranImg: 'https://images.unsplash.com/photo-1609599006353-e58fa266f8db?q=80&w=400',
  hisnImg: 'https://images.unsplash.com/photo-1564349683136-277ee4ed2747?q=80&w=400',
  misbahaImg: 'https://images.unsplash.com/photo-1579737158735-e65330366eb6?q=80&w=400',
  prayerImg: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=400',
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
