async function test() {
  const url = 'https://images.unsplash.com/photo-1609599006353-e58fa266f8db?q=80&w=400';
  const res = await fetch(url);
  console.log(res.status, res.headers.get('content-type'));
  const b = Buffer.from(await res.arrayBuffer());
  console.log(b.subarray(0, 10).toString('hex'));
}
test();
