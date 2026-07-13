const fs = require('fs');

let data = fs.readFileSync('src/App.tsx', 'utf8');

// Undo the sed replacements
data = data.replace(/\{\!isFullScreen && \(\n      <>/g, '{!isFullScreen && (');
data = data.replace(/<PrayerAlert \/>\n      <\/>\n      \)}/g, '<PrayerAlert />\n      )}');

// Re-apply safely
data = data.replace(
  '{!isFullScreen && (\n      <header',
  '{!isFullScreen && (\n      <>\n      <header'
);

data = data.replace(
  '<PrayerAlert />\n      )}',
  '<PrayerAlert />\n      </>\n      )}'
);

fs.writeFileSync('src/App.tsx', data);
