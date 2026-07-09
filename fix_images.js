const fs = require('fs');

let homeContent = fs.readFileSync('src/views/HomeView.tsx', 'utf8');
homeContent = homeContent.replace("import React from 'react';", "import React from 'react';\nimport quranImg from '../assets/images/quran.jpg';\nimport hisnImg from '../assets/images/hisn.jpg';\nimport misbahaImg from '../assets/images/misbaha.jpg';\nimport prayerImg from '../assets/images/prayer.jpg';\nimport libraryImg from '../assets/images/library.jpg';\nimport storiesImg from '../assets/images/stories.jpg';\nimport bannerImg from '../assets/images/banner.jpg';");

homeContent = homeContent.replace("'./images/quran.jpg'", "quranImg");
homeContent = homeContent.replace("'./images/hisn.jpg'", "hisnImg");
homeContent = homeContent.replace("'./images/misbaha.jpg'", "misbahaImg");
homeContent = homeContent.replace("'./images/prayer.jpg'", "prayerImg");
homeContent = homeContent.replace("'./images/library.jpg'", "libraryImg");
homeContent = homeContent.replace("'./images/stories.jpg'", "storiesImg");
homeContent = homeContent.replace("\"url('./images/banner.jpg')\"", "`url(${bannerImg})`");

fs.writeFileSync('src/views/HomeView.tsx', homeContent);

let quranContent = fs.readFileSync('src/views/QuranView.tsx', 'utf8');
quranContent = quranContent.replace("import React, { useState, useEffect, useMemo, useRef } from 'react';", "import React, { useState, useEffect, useMemo, useRef } from 'react';\nimport quranImg from '../assets/images/quran.jpg';");
quranContent = quranContent.replace(/\"url\('\.\/images\/quran\.jpg'\)\"/g, "`url(${quranImg})`");

fs.writeFileSync('src/views/QuranView.tsx', quranContent);
