const sharp = require('sharp');
const fs = require('fs');

async function processImages() {
  const files = fs.readdirSync('src/assets/img').filter(f => f.endsWith('.jpg'));
  let output = '';
  
  for (const file of files) {
    const inputPath = `src/assets/img/${file}`;
    const name = file.replace('.jpg', '');
    
    const buffer = await sharp(inputPath)
      .resize(400) // resize to width 400px
      .jpeg({ quality: 70 })
      .toBuffer();
      
    const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    output += `export const ${name}Img = "${base64}";\n`;
  }
  
  fs.writeFileSync('src/assets/image-data.ts', output);
  console.log('Done converting images');
}

processImages();
