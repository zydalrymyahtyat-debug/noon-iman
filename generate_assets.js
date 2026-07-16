const sharp = require('sharp');

const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#0d9488"/>
  <circle cx="512" cy="512" r="350" fill="#ffffff" opacity="0.1"/>
  <circle cx="512" cy="512" r="250" fill="#ffffff" opacity="0.2"/>
  <path d="M540,320 A220,220 0 1,0 760,540 A260,260 0 0,1 540,320 Z" fill="#ffffff"/>
</svg>
`;

const splashSvg = `
<svg width="2732" height="2732" viewBox="0 0 2732 2732" xmlns="http://www.w3.org/2000/svg">
  <rect width="2732" height="2732" fill="#0d9488"/>
  <circle cx="1366" cy="1366" r="800" fill="#ffffff" opacity="0.05"/>
  <circle cx="1366" cy="1366" r="600" fill="#ffffff" opacity="0.1"/>
  <path d="M1422,932 A500,500 0 1,0 1922,1432 A580,580 0 0,1 1422,932 Z" fill="#ffffff"/>
</svg>
`;

async function run() {
  await sharp(Buffer.from(iconSvg)).png().toFile('resources/icon.png');
  console.log('Created resources/icon.png');

  await sharp(Buffer.from(splashSvg)).png().toFile('resources/splash.png');
  console.log('Created resources/splash.png');
}

run().catch(console.error);
