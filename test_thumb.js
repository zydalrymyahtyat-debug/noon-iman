const urls = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Quran.jpg/640px-Quran.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Masbaha.jpg/640px-Masbaha.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Mosque.jpg/640px-Mosque.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Two_bookshelves_full_of_books_belonging_to_Unitedmissionary_%282010%29.jpg/640px-Two_bookshelves_full_of_books_belonging_to_Unitedmissionary_%282010%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Desert.jpg/640px-Desert.jpg',
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
