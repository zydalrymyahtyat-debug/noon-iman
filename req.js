const https = require('https');
https.get('https://html.duckduckgo.com/html/?q=site:unsplash.com+islamic+quran', { headers: { 'User-Agent': 'Mozilla/5.0' }}, res => {
    let d = ''; res.on('data', c=>d+=c);
    res.on('end', () => console.log(d.match(/https:\/\/unsplash\.com\/photos\/[a-zA-Z0-9_-]+/g)));
});
