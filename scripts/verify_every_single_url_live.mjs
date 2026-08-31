/**
 * Live HTTP Link Validator
 * Connects to the internet and pings every URL in our tenders database to ensure 100% live HTTP 200 validity.
 */

const testLinks = [
  { name: 'Kenyatta University Actuarial PDF', url: 'https://www.ku.ac.ke/wp-content/uploads/2026/08/REQUEST-FO-PROPOSAL-TO-UNDERTAKE-ACTURIAL-AND-RISK-MANAGEMENT.pdf' },
  { name: 'Kenyatta University Medicine PDF', url: 'https://www.ku.ac.ke/wp-content/uploads/2026/07/OPEN-TENDER-FOR-SUPPLY-AND-DELIVERY-OF-ORIGINAL-BRANDED-MEDICINE26-27.pdf' },
  { name: 'Alliance High School AHS Tenders (Live verified by user)', url: 'https://alliancehighschool.ac.ke/ahs-tenders/' },
  { name: 'KeNHA Official Tenders Portal', url: 'https://www.kenha.co.ke' },
  { name: 'Public Procurement Information Portal (PPIP)', url: 'https://tenders.go.ke/tenders' },
  { name: 'e-GP Kenya Electronic Procurement', url: 'https://egpkenya.go.ke' },
  { name: 'Kenya Revenue Authority Tenders', url: 'https://www.kra.go.ke/en/tenders' },
  { name: 'Kenya Power Tenders Portal', url: 'https://www.kplc.co.ke' },
  { name: 'KETRACO Tenders Portal', url: 'https://www.ketraco.co.ke' },
  { name: 'Nairobi City County', url: 'https://nairobi.go.ke' },
  { name: 'Kiambu County Government', url: 'https://kiambu.go.ke' },
  { name: 'Turkana County Government', url: 'https://turkana.go.ke' },
];

async function verifyAllLinks() {
  console.log('====================================================');
  console.log('🌐 RUNNING LIVE HTTP 200 VALIDATION SUITE');
  console.log('====================================================\n');

  const results = [];

  for (const item of testLinks) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(item.url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml,application/pdf;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      console.log(`[${res.status === 200 ? '✅ 200 OK' : '⚠️ ' + res.status}] ${item.name}`);
      console.log(`     URL: ${item.url}`);
      results.push({ ...item, status: res.status, ok: res.ok });
    } catch (e) {
      console.log(`[❌ FAILED] ${item.name} (${e.message})`);
      console.log(`     URL: ${item.url}`);
      results.push({ ...item, status: 'ERROR', ok: false, error: e.message });
    }
  }

  console.log('\n====================================================');
  console.log(`Summary: ${results.filter(r => r.ok).length}/${results.length} verified working live on the web.`);
  console.log('====================================================\n');
}

verifyAllLinks();
