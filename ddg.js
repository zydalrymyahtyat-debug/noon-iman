const https = require('https');
const q = process.argv[2];
https.get('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q + ' filetype:jpg'), (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const matches = body.match(/img_url=([^&]+)/g);
    if(matches && matches.length > 0) {
      console.log(decodeURIComponent(matches[0].replace('img_url=', '')));
    } else { console.log('no image found'); }
  });
});
