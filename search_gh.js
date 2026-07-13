async function search() {
  const res = await fetch('https://api.github.com/search/repositories?q=islamic+books+json', { headers: { 'User-Agent': 'Node.js' } });
  const data = await res.json();
  console.log((data.items || []).slice(0, 5).map(i => i.full_name));
}
search();
