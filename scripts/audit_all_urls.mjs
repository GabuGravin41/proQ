import fs from 'fs';

const content = fs.readFileSync('./src/lib/tenders.ts', 'utf8');
const docUrls = [...content.matchAll(/"documentUrl":\s*"([^"]+)"/g)].map(m => m[1]);
const egpLinks = [...content.matchAll(/"egpLink":\s*"([^"]+)"/g)].map(m => m[1]);

console.log('====================================================');
console.log(`🔗 TOTAL DOCUMENT URLS AUDITED: ${docUrls.length}`);
console.log('====================================================');
docUrls.forEach((u, i) => console.log(`[${i + 1}] ${u}`));

console.log('\n====================================================');
console.log(`🌐 TOTAL E-GP PORTAL LINKS AUDITED: ${egpLinks.length}`);
console.log('====================================================');
egpLinks.forEach((u, i) => console.log(`[${i + 1}] ${u}`));
