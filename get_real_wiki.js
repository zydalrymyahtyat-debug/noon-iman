async function getUrl(title) {
  const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&titles=File:${encodeURIComponent(title)}`);
  const data = await res.json();
  const pages = data.query.pages;
  for (const k in pages) {
    if (pages[k].imageinfo) {
      console.log(pages[k].imageinfo[0].url);
      return pages[k].imageinfo[0].url;
    }
  }
}
async function run() {
  await getUrl('Quran.jpg');
  await getUrl('Masbaha.jpg');
  await getUrl('Mosque.jpg');
  await getUrl('Book.jpg');
  await getUrl('Desert.jpg');
  await getUrl('Kaaba.jpg');
}
run();
