async function run() {
  const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&generator=images&titles=Library`);
  const data = await res.json();
  const pages = data.query.pages;
  for (const k in pages) {
    if (pages[k].imageinfo && pages[k].imageinfo[0].url.endsWith('.jpg')) {
      console.log(pages[k].imageinfo[0].url);
    }
  }
}
run();
