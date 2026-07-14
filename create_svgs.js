const fs = require('fs');
const path = require('path');

const svgs = {
  banner: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="gradBanner" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f766e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#042f2e;stop-opacity:1" />
    </linearGradient>
    <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>
      <path d="M15 15 L45 15 L45 45 L15 45 Z" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="800" height="400" fill="url(#gradBanner)" />
  <rect width="800" height="400" fill="url(#islamic-pattern)" />
  <circle cx="400" cy="200" r="150" fill="rgba(255,255,255,0.03)" />
  <circle cx="400" cy="200" r="100" fill="rgba(255,255,255,0.05)" />
</svg>`,
  
  quran: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="gradQuran" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#115e59;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#022c22;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#gradQuran)" />
  <g stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none">
    <path d="M 200 100 L 250 150 L 250 300 L 200 280 L 150 300 L 150 150 Z" />
    <path d="M 200 100 L 200 280" />
    <path d="M 150 180 L 200 160 L 250 180" />
    <path d="M 150 220 L 200 200 L 250 220" />
  </g>
</svg>`,

  hisn: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="gradHisn" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0369a1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#082f49;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#gradHisn)" />
  <g stroke="rgba(255,255,255,0.1)" stroke-width="4" fill="none">
    <circle cx="200" cy="200" r="100" />
    <path d="M 200 120 L 200 100 A 30 30 0 0 1 230 70 A 30 30 0 0 1 260 100 L 260 120" />
    <path d="M 140 200 Q 200 250 260 200" />
  </g>
  <circle cx="200" cy="170" r="8" fill="rgba(255,255,255,0.15)" />
</svg>`,

  misbaha: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="gradMisbaha" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9a3412;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#451a03;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#gradMisbaha)" />
  <g fill="rgba(255,255,255,0.15)">
    <circle cx="200" cy="80" r="18" />
    <circle cx="270" cy="110" r="18" />
    <circle cx="320" cy="180" r="18" />
    <circle cx="320" cy="260" r="18" />
    <circle cx="270" cy="330" r="18" />
    <circle cx="200" cy="360" r="18" />
    <circle cx="130" cy="330" r="18" />
    <circle cx="80" cy="260" r="18" />
    <circle cx="80" cy="180" r="18" />
    <circle cx="130" cy="110" r="18" />
  </g>
  <path d="M 200 80 L 200 20" stroke="rgba(255,255,255,0.15)" stroke-width="6" stroke-linecap="round" />
  <circle cx="200" cy="10" r="10" fill="rgba(255,255,255,0.15)" />
</svg>`,

  prayer: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="gradPrayer" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#c2410c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#431407;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#gradPrayer)" />
  <g fill="rgba(255,255,255,0.1)">
    <path d="M 200 80 L 230 150 L 230 350 L 170 350 L 170 150 Z" />
    <path d="M 100 200 L 130 250 L 130 350 L 70 350 L 70 250 Z" />
    <path d="M 300 200 L 330 250 L 330 350 L 270 350 L 270 250 Z" />
  </g>
  <circle cx="200" cy="50" r="15" fill="rgba(255,255,255,0.2)" />
</svg>`,

  library: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="gradLibrary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4d7c0f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#14532d;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#gradLibrary)" />
  <g fill="rgba(255,255,255,0.12)">
    <rect x="80" y="100" width="50" height="200" rx="4" />
    <rect x="140" y="140" width="45" height="160" rx="4" />
    <rect x="195" y="80" width="55" height="220" rx="4" />
    <polygon points="260,300 310,120 360,130 310,300" />
  </g>
  <rect x="50" y="300" width="300" height="15" fill="rgba(255,255,255,0.2)" rx="4" />
  <rect x="50" y="320" width="300" height="15" fill="rgba(255,255,255,0.2)" rx="4" />
</svg>`,

  stories: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="gradStories" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6d28d9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2e1065;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#gradStories)" />
  <g stroke="rgba(255,255,255,0.15)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 120 150 Q 200 120 280 150 L 280 300 Q 200 270 120 300 Z" />
    <path d="M 200 135 L 200 285" />
    <path d="M 140 180 L 180 170" />
    <path d="M 140 220 L 180 210" />
    <path d="M 220 170 L 260 180" />
    <path d="M 220 210 L 260 220" />
  </g>
  <circle cx="200" cy="80" r="20" fill="rgba(255,255,255,0.1)" />
</svg>`
};

let tsContent = '';

for (const [key, svg] of Object.entries(svgs)) {
  const base64 = Buffer.from(svg).toString('base64');
  tsContent += `export const ${key}Img = "data:image/svg+xml;base64,${base64}";\n`;
}

const outFile = path.join(__dirname, 'src', 'assets', 'image-data.ts');
fs.writeFileSync(outFile, tsContent);
console.log('Successfully generated updated SVG-based image-data.ts');
