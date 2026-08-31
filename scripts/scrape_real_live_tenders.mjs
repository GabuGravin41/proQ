/**
 * Real Live Ingestion Scraper for Kenyan Public Institutions
 * Probes and extracts actual live published tender notices from official websites.
 */

const TARGET_PORTALS = [
  {
    name: 'KenGen (Kenya Electricity Generating Company)',
    url: 'https://www.kengen.co.ke/tenders/',
    parser: parseKenGen,
  },
  {
    name: 'Kenya Airports Authority (KAA)',
    url: 'https://www.kaa.go.ke/corporate/procurement/tenders/',
    parser: parseKAA,
  },
  {
    name: 'Kenyatta University (KU)',
    url: 'https://www.ku.ac.ke/procurement/',
    parser: parseKU,
  },
  {
    name: 'Energy & Petroleum Regulatory Authority (EPRA)',
    url: 'https://www.epra.go.ke/tenders/',
    parser: parseEPRA,
  },
  {
    name: 'National Environment Management Authority (NEMA)',
    url: 'https://www.nema.go.ke/index.php/tenders',
    parser: parseNEMA,
  },
];

// Parser for KenGen
function parseKenGen(html, baseUrl) {
  const tenders = [];
  // Extract tender table rows or notice cards
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;

  while ((match = rowRegex.exec(html)) !== null) {
    const rowContent = match[1];
    if (rowContent.includes('<th') || !rowContent.includes('<td')) continue;

    // Extract cells
    const cells = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim());
    }

    // Look for PDF link
    const linkMatch = rowContent.match(/href=["']([^"']+\.pdf[^"']*)["']/i) || rowContent.match(/href=["']([^"']+)["']/i);
    let docUrl = linkMatch ? linkMatch[1] : null;
    if (docUrl && !docUrl.startsWith('http')) {
      docUrl = new URL(docUrl, baseUrl).href;
    }

    if (cells.length >= 2) {
      tenders.push({
        referenceNumber: cells[0] || 'N/A',
        title: cells[1] || cells[0],
        closingDate: cells[2] || 'See Document',
        documentUrl: docUrl,
        rawCells: cells,
      });
    }
  }

  // If table not found, search for generic tender link blocks
  if (tenders.length === 0) {
    const linkBlockRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    while ((match = linkBlockRegex.exec(html)) !== null) {
      const href = match[1];
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      if ((text.toLowerCase().includes('tender') || text.toLowerCase().includes('kengen') || href.includes('.pdf')) && text.length > 15) {
        tenders.push({
          referenceNumber: text.match(/([A-Z0-9\-\/]{6,})/)?.[1] || 'KENGEN-NOTICE',
          title: text,
          closingDate: 'Check Notice PDF',
          documentUrl: href.startsWith('http') ? href : new URL(href, baseUrl).href,
        });
      }
    }
  }

  return tenders;
}

// Parser for KAA
function parseKAA(html, baseUrl) {
  const tenders = [];
  const linkBlockRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkBlockRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if ((text.toLowerCase().includes('tender') || text.toLowerCase().includes('kaa') || href.includes('tenders') || href.includes('.pdf')) && text.length > 20) {
      tenders.push({
        referenceNumber: text.match(/(KAA\/[A-Z0-9\-\/]+)/i)?.[1] || 'KAA-NOTICE',
        title: text,
        closingDate: 'Check Notice Document',
        documentUrl: href.startsWith('http') ? href : new URL(href, baseUrl).href,
      });
    }
  }
  return tenders;
}

// Parser for KU
function parseKU(html, baseUrl) {
  const tenders = [];
  const linkBlockRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkBlockRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if ((text.toLowerCase().includes('tender') || text.toLowerCase().includes('ku/') || href.includes('.pdf')) && text.length > 15) {
      tenders.push({
        referenceNumber: text.match(/(KU\/[A-Z0-9\-\/]+)/i)?.[1] || 'KU-TENDER',
        title: text,
        closingDate: 'Check Document',
        documentUrl: href.startsWith('http') ? href : new URL(href, baseUrl).href,
      });
    }
  }
  return tenders;
}

// Parser for EPRA
function parseEPRA(html, baseUrl) {
  const tenders = [];
  const linkBlockRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkBlockRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if ((text.toLowerCase().includes('tender') || text.toLowerCase().includes('epra') || href.includes('.pdf')) && text.length > 15) {
      tenders.push({
        referenceNumber: text.match(/(EPRA\/[A-Z0-9\-\/]+)/i)?.[1] || 'EPRA-TENDER',
        title: text,
        closingDate: 'Check Notice',
        documentUrl: href.startsWith('http') ? href : new URL(href, baseUrl).href,
      });
    }
  }
  return tenders;
}

// Parser for NEMA
function parseNEMA(html, baseUrl) {
  const tenders = [];
  const linkBlockRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkBlockRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if ((text.toLowerCase().includes('tender') || text.toLowerCase().includes('nema') || href.includes('.pdf')) && text.length > 15) {
      tenders.push({
        referenceNumber: text.match(/(NEMA\/[A-Z0-9\-\/]+)/i)?.[1] || 'NEMA-NOTICE',
        title: text,
        closingDate: 'Check Notice',
        documentUrl: href.startsWith('http') ? href : new URL(href, baseUrl).href,
      });
    }
  }
  return tenders;
}

async function runLiveWebScrape() {
  console.log('================================================================');
  console.log('🌐 RUNNING LIVE TENDER INGESTION ON OFFICIAL KENYAN WEBSITES');
  console.log('================================================================\n');

  const totalExtracted = [];

  for (const portal of TARGET_PORTALS) {
    console.log(`\n---------------------------------------------------------`);
    console.log(`📡 Connecting to: ${portal.name}`);
    console.log(`🔗 URL: ${portal.url}`);
    console.log(`---------------------------------------------------------`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(portal.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`• Status: HTTP ${res.status} ${res.statusText}`);

      if (!res.ok) {
        console.log(`⚠️ Portal returned HTTP ${res.status}`);
        continue;
      }

      const html = await res.text();
      console.log(`• Received HTML: ${html.length.toLocaleString()} bytes`);

      const notices = portal.parser(html, portal.url);
      console.log(`• Extracted Notices Found: ${notices.length}`);

      if (notices.length > 0) {
        notices.slice(0, 5).forEach((n, i) => {
          console.log(`\n  [#${i + 1}] Title: ${n.title.replace(/\s+/g, ' ')}`);
          if (n.referenceNumber !== 'N/A') console.log(`      Ref No: ${n.referenceNumber}`);
          if (n.documentUrl) console.log(`      PDF/Doc Link: ${n.documentUrl}`);
          totalExtracted.push({ portal: portal.name, ...n });
        });
      }
    } catch (err) {
      console.log(`✗ Error connecting to ${portal.name}: ${err.message}`);
    }
  }

  console.log('\n================================================================');
  console.log(`🎉 LIVE INGESTION SUMMARY: Scraped ${totalExtracted.length} actual published notices`);
  console.log('================================================================\n');
}

runLiveWebScrape();
