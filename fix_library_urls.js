const fs = require('fs');

let libData = fs.readFileSync('src/data/library.ts', 'utf8');

libData = libData.replace(
  /https:\/\/archive.org\/embed\/20211116_20211116_0137/g,
  'https://archive.org/embed/20210620_20210620_1846'
);
libData = libData.replace(
  /https:\/\/archive.org\/embed\/20230206_20230206_1130/g,
  'https://archive.org/embed/20250828_20250828_1302'
);
libData = libData.replace(
  /https:\/\/shamela.ws\/book\/3055/g,
  'https://archive.org/embed/faresfares41_gmail_201402'
);
libData = libData.replace(
  /https:\/\/shamela.ws\/book\/31697/g,
  'https://archive.org/embed/20211106_20211106_2008'
);
libData = libData.replace(
  /https:\/\/shamela.ws\/book\/23833/g,
  'https://archive.org/embed/mukh-sirah-nabawiyyah-ibn-hisham'
);

fs.writeFileSync('src/data/library.ts', libData);
