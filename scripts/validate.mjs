import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith('.html'));
const errors = [];
const localRefPattern = /(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g;
const requiredPages = [
  'index.html', 'catalogue.html', 'product.html', 'categories.html', 'bundles.html',
  'academy.html', 'panier.html', 'checkout.html', 'account.html', 'orders.html',
  'downloads.html', 'licenses.html', 'invoices.html', 'faq.html',
  'refund-policy.html', 'license.html', 'terms.html', 'privacy.html'
];

for (const page of requiredPages) {
  if (!htmlFiles.includes(page)) errors.push(`Page requise manquante: ${page}`);
}

for (const file of htmlFiles) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (!source.includes('<meta name="viewport"')) errors.push(`${file}: viewport manquant`);
  if (!source.includes('<title>')) errors.push(`${file}: titre manquant`);
  if (!source.includes('id="pageContent"')) errors.push(`${file}: conteneur pageContent manquant`);
  for (const match of source.matchAll(localRefPattern)) {
    const ref = match[1];
    if (/^(https?:|mailto:|tel:)/.test(ref) || ref === '/') continue;
    const target = path.resolve(root, ref);
    if (!fs.existsSync(target)) errors.push(`${file}: référence locale introuvable ${ref}`);
  }
}

const productsSource = fs.readFileSync(path.join(root, 'scripts/products.js'), 'utf8');
const productIds = [...productsSource.matchAll(/\bid:\s*'([^']+)'/g)].map((match) => match[1]);
const duplicateIds = productIds.filter((id, index) => productIds.indexOf(id) !== index);
if (duplicateIds.length) errors.push(`IDs produits dupliqués: ${[...new Set(duplicateIds)].join(', ')}`);
if (productIds.length < 30) errors.push(`Catalogue incomplet: ${productIds.length} produits seulement`);

const storefrontSource = fs.readFileSync(path.join(root, 'scripts/main.js'), 'utf8');
const forbiddenPublicClaims = ['aggregateRating', 'Achat vérifié', '1 500+', '4.9/5'];
for (const claim of forbiddenPublicClaims) {
  if (storefrontSource.includes(claim)) errors.push(`Affirmation publique non vérifiée détectée: ${claim}`);
}

for (const match of productsSource.matchAll(/cover:\s*'([^']+)'/g)) {
  if (!fs.existsSync(path.join(root, match[1]))) errors.push(`Couverture produit introuvable: ${match[1]}`);
}

if (!fs.existsSync(path.join(root, 'assets/og-webnova.png'))) {
  errors.push('Carte de partage WebNova introuvable: assets/og-webnova.png');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validation réussie: ${htmlFiles.length} pages HTML et ${productIds.length} produits.`);
