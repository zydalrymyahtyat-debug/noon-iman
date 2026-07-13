const fs = require('fs');

async function searchGithub(query) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+language:json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Node.js' } });
  const data = await res.json();
  console.log(`Results for ${query}:`, data.items ? data.items.slice(0, 3).map(i => i.full_name) : data);
}

searchGithub("صحيح البخاري");
