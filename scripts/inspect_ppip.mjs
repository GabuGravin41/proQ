async function inspectPPIP() {
  const res = await fetch('https://tenders.go.ke/tenders', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    },
  });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('HTML Length:', html.length);
  console.log('Snippet:\n', html.slice(0, 1000));
}

inspectPPIP();
