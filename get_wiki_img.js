const q = process.argv[2];
fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&generator=images&titles=${encodeURIComponent(q)}`)
.then(r=>r.json())
.then(data => {
  const pages = data.query.pages;
  for (const k in pages) {
    if (pages[k].imageinfo && pages[k].imageinfo[0].url.endsWith('.jpg')) {
      console.log(pages[k].imageinfo[0].url);
      return;
    }
  }
}).catch(() => console.log('not found'));
