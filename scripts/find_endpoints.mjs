async function findApiEndpoints() {
  const jsUrl = 'https://tenders.go.ke/build/assets/app-4ed993c7.js';
  console.log('Downloading PPIP JS bundle:', jsUrl);
  const res = await fetch(jsUrl);
  const text = await res.text();
  console.log('Bundle size:', text.length, 'bytes');

  // Search for endpoints matching /api/ or /tenders or /ocds
  const matches = text.match(/(['"]\/api\/[^'"]+['"]|['"]https?:\/\/[^'"]*tenders[^'"]*['"]|['"]\/[a-zA-Z0-9_\-\/]*tenders[a-zA-Z0-9_\-\/]*['"])/g) || [];
  const unique = [...new Set(matches)].slice(0, 30);
  console.log('Found potential endpoints:', unique);
}

findApiEndpoints();
