const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseSvg = (text, bg) => `
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="${bg}"/>
  <text x="400" y="300" font-size="48" font-family="sans-serif" text-anchor="middle" fill="white">${text}</text>
</svg>
`;

const images = [
  { file: 'public/img/banner.jpg', text: 'Banner', bg: '#0d9488' },
  { file: 'public/img/hisn.jpg', text: 'Hisn', bg: '#0f766e' },
  { file: 'public/img/library.jpg', text: 'Library', bg: '#115e59' },
  { file: 'public/img/misbaha.jpg', text: 'Misbaha', bg: '#0f766e' },
  { file: 'public/img/prayer.jpg', text: 'Prayer', bg: '#134e4a' },
  { file: 'public/img/quran.jpg', text: 'Quran', bg: '#0f766e' },
  { file: 'public/img/stories.jpg', text: 'Stories', bg: '#0f766e' }
];

async function run() {
  for (const img of images) {
    await sharp(Buffer.from(baseSvg(img.text, img.bg))).jpeg().toFile(img.file);
    console.log('Created', img.file);
  }
}

run().catch(console.error);
