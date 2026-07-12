const https = require('https');
const q = encodeURIComponent("site:unsplash.com islamic quran");
https.get(`https://html.duckduckgo.com/html/?q=${q}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
}, res => {
    let html = '';
    res.on('data', d => html+=d);
    res.on('end', () => {
        const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9_-]+/g;
        const matches = html.match(regex);
        console.log(matches ? [...new Set(matches)] : 'none');
    });
});
