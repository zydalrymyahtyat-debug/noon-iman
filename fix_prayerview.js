const fs = require('fs');

let data = fs.readFileSync('src/views/PrayerView.tsx', 'utf8');

// Replace any faulty template literals that might be using single quotes
data = data.replace(
  /setNotificationStatus\('تم ضبط \$\{scheduled\} منبهات للصلوات القادمة اليوم'\);/g,
  "setNotificationStatus(`تم ضبط ${scheduled} منبهات للصلوات القادمة اليوم`);"
);

data = data.replace(
  /schedulePrayerReminder\([\s\n]*prayer.id,[\s\n]*'صلاة \$\{prayer.name\}',[\s\n]*'حان الآن موعد صلاة \$\{prayer.name\}',/g,
  "schedulePrayerReminder(prayer.id, `صلاة ${prayer.name}`, `حان الآن موعد صلاة ${prayer.name}`,"
);

fs.writeFileSync('src/views/PrayerView.tsx', data);
