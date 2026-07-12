const fs = require('fs');
let content = fs.readFileSync('src/views/QuranView.tsx', 'utf8');

content = content.replace(
  "setBookmark(JSON.parse(saved));",
  `const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.surahNumber === 'number') {
          setBookmark(parsed);
        } else {
          localStorage.removeItem('quran_bookmark');
        }`
);

fs.writeFileSync('src/views/QuranView.tsx', content);
