const urls = [
  'https://upload.wikimedia.org/wikipedia/commons/4/41/Quran_mushaf.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/e/e5/Mosque.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/e/e4/Library_and_Books.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Masbaha.jpg/640px-Masbaha.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Old_book_bindings.jpg/640px-Old_book_bindings.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Desert_at_sunset.jpg/640px-Desert_at_sunset.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Kaaba.jpg/640px-Kaaba.jpg'
];

async function test() {
  for (const u of urls) {
    try {
      const res = await fetch(u);
      console.log(u, res.status, res.headers.get('content-type'));
    } catch(e) { console.error(u, e.message) }
  }
}
test();
