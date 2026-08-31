async function fetchOCPKenyaFeed() {
  console.log('---------------------------------------------------------');
  console.log('🌐 Fetching Official Kenya OCDS Open Contracting Releases');
  console.log('---------------------------------------------------------');

  const registryUrl = 'https://data.open-contracting.org/en/publication/140/json';
  try {
    const res = await fetch(registryUrl, {
      headers: {
        'User-Agent': 'TenderIQ-Bot/1.0',
        'Accept': 'application/json',
      },
    });

    console.log(`Registry Status: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log('✅ OCP Registry Meta:', JSON.stringify(data, null, 2).slice(0, 400));
    }
  } catch (err) {
    console.log('OCP Notice:', err.message);
  }
}

fetchOCPKenyaFeed();
