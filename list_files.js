async function getFiles(identifier) {
  const res = await fetch(`https://archive.org/metadata/${identifier}`);
  const data = await res.json();
  const txtFiles = data.files.filter(f => f.name.endsWith('.txt') || f.name.endsWith('.epub'));
  console.log(`Files for ${identifier}:`, txtFiles.map(f => f.name));
}
getFiles('mukh-sirah-nabawiyyah-ibn-hisham');
getFiles('20240616_20240616_1730');
