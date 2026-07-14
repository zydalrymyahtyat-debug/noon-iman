mkdir -p temp_images
curl -sL "https://picsum.photos/id/1073/600/400" -o temp_images/quran.jpg
curl -sL "https://picsum.photos/id/1043/600/400" -o temp_images/hisn.jpg
curl -sL "https://picsum.photos/id/1044/600/400" -o temp_images/misbaha.jpg
curl -sL "https://picsum.photos/id/1015/600/400" -o temp_images/prayer.jpg
curl -sL "https://picsum.photos/id/1070/600/400" -o temp_images/library.jpg
curl -sL "https://picsum.photos/id/1045/600/400" -o temp_images/stories.jpg
curl -sL "https://picsum.photos/id/1035/800/400" -o temp_images/banner.jpg

node -e "
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const outDir = path.join(__dirname, 'src', 'assets');
const outFile = path.join(outDir, 'image-data.ts');
const images = ['quran', 'hisn', 'misbaha', 'prayer', 'library', 'stories', 'banner'];

async function run() {
  let tsContent = '';
  for (const img of images) {
    const imgPath = path.join(__dirname, 'temp_images', img + '.jpg');
    try {
      const buffer = await sharp(imgPath).jpeg({ quality: 60 }).toBuffer();
      const base64 = buffer.toString('base64');
      tsContent += \`export const \${img}Img = \"data:image/jpeg;base64,\${base64}\";\\n\`;
    } catch(e) {
      console.log('Error ' + img + ': ' + e);
    }
  }
  fs.writeFileSync(outFile, tsContent);
}
run();
"
rm -rf temp_images
