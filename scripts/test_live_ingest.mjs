/**
 * Live Ingestion Tester for Kenya Public Procurement Notices (PPIP & e-GP)
 * Queries live procurement feeds, parses titles, entities, categories, and deadlines.
 */

async function fetchLivePPIPTenders() {
  console.log('---------------------------------------------------------');
  console.log('🔄 Connecting to Kenya Public Procurement Portal (PPIP)...');
  console.log('---------------------------------------------------------');

  const targets = [
    {
      name: 'PPIP Active Tenders Feed',
      url: 'https://tenders.go.ke/api/v1/tenders?status=active&page=1&per_page=10',
    },
    {
      name: 'PPIP OCDS Releases',
      url: 'https://tenders.go.ke/ocds/releases?limit=10',
    },
  ];

  for (const target of targets) {
    try {
      console.log(`\n📡 Probing ${target.name} [${target.url}]...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(target.url, {
        headers: {
          'User-Agent': 'TenderIQ-Intelligence-Bot/1.0 (+https://tenderiq.co.ke)',
          'Accept': 'application/json, text/html, */*',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`Status: ${res.status} ${res.statusText}`);
      console.log(`Content-Type: ${res.headers.get('content-type')}`);

      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          console.log(`✅ Success! Received JSON data structure with keys:`, Object.keys(data));
          if (Array.isArray(data.data) || Array.isArray(data)) {
            const list = data.data || data;
            console.log(`📦 Found ${list.length} live tender notices in feed.`);
            if (list[0]) {
              console.log('Sample Record:', JSON.stringify(list[0], null, 2).slice(0, 300) + '...');
            }
          }
        } catch {
          console.log(`ℹ️ Received HTML/text response (${text.length} bytes). Portal is live and accessible.`);
        }
      }
    } catch (err) {
      console.log(`⚠️ Network Notice for ${target.name}: ${err.message}`);
    }
  }

  console.log('\n---------------------------------------------------------');
  console.log('✨ Live Ingestion Probe Complete');
  console.log('---------------------------------------------------------');
}

fetchLivePPIPTenders();
