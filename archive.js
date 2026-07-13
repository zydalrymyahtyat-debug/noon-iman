async function search(query) {
  const res = await fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier,title,creator,downloads&sort[]=downloads+desc&output=json&rows=3`);
  const data = await res.json();
  console.log("Query:", query);
  console.log(data.response.docs);
}
search('title:(كتاب الروح) AND mediatype:(texts)');
search('title:(صيد الخاطر) AND mediatype:(texts)');
search('title:(السيرة النبوية) AND creator:(ابن هشام) AND mediatype:(texts)');
search('title:(رسائل من القرآن) AND mediatype:(texts)');
search('title:(رسائل من النبي) AND mediatype:(texts)');
