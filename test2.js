const https = require('https');
https.get('https://html.duckduckgo.com/html/?q=site:pexels.com+islamic+quran', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    console.log("Got response length:", data.length);
    const matches = data.match(/https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg/g);
    console.log(matches ? [...new Set(matches)] : "No matches");
  });
});
