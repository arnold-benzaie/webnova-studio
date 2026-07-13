import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith('.html'));
const errors = [];
const localRefPattern = /(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g;
const requiredPages = [
  'index.html', 'catalogue.html', 'product.html', 'categories.html', 'bundles.html',
  'academy.html', 'panier.html', 'checkout.html', 'account.html', 'orders.html',
  'downloads.html', 'licenses.html', 'invoices.html', 'faq.html',
  'blog.html', 'article.html', 'support.html', 'roadmap.html',
  'about.html', 'contact.html', 'refund-policy.html', 'license.html', 'terms.html',
  'privacy.html', 'legal-notice.html', '404.html'
];

for (const page of requiredPages) {
  if (!htmlFiles.includes(page)) errors.push(`Page requise manquante: ${page}`);
}

for (const file of htmlFiles) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (!source.includes('<meta name="viewport"')) errors.push(`${file}: viewport manquant`);
  if (!source.includes('<title>')) errors.push(`${file}: titre manquant`);
  if (!source.includes('<meta name="description"')) errors.push(`${file}: meta description manquante`);
  const isNoIndex = source.includes('name="robots" content="noindex');
  if (!isNoIndex && file !== 'product.html' && !source.includes('rel="canonical"')) errors.push(`${file}: canonical manquant`);
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
if (productIds.length < 50) errors.push(`Catalogue incomplet: ${productIds.length} produits seulement`);
if (/rating:\s*(?!null\b)[0-9.]+/.test(productsSource)) errors.push('Notes produit non vérifiées détectées dans les données');
if (/reviews:\s*[1-9]/.test(productsSource)) errors.push('Compteurs d’avis non vérifiés détectés dans les données');
if (/sales:\s*[1-9]/.test(productsSource)) errors.push('Compteurs de ventes non vérifiés détectés dans les données');

const productSandbox = { window: {} };
vm.runInNewContext(productsSource, productSandbox);
const products = productSandbox.window.WebNovaData?.products || [];
for (const product of products) {
  for (const field of ['description', 'longDescription', 'format', 'compatible', 'licenseName', 'licenseSummary', 'version', 'updatedAt']) {
    if (!String(product[field] || '').trim()) errors.push(`${product.id}: champ produit manquant ${field}`);
  }
  for (const field of ['features', 'prerequisites', 'documentation', 'screenshots']) {
    if (!Array.isArray(product[field]) || product[field].length < 4) errors.push(`${product.id}: section produit incomplète ${field}`);
  }
  if (product.screenshots?.some((item) => !item.label || !item.description || !item.status)) errors.push(`${product.id}: aperçu produit non documenté`);
}

const storefrontSource = fs.readFileSync(path.join(root, 'scripts/main.js'), 'utf8');
if (!storefrontSource.includes("readStore('webnova-language-v2', 'en')")) errors.push('Langue officielle par défaut incorrecte: anglais requis');
if (!storefrontSource.includes("readStore('webnova-currency-v2', 'USD')")) errors.push('Devise officielle par défaut incorrecte: USD requis');
const forbiddenPublicClaims = ['aggregateRating', 'Achat vérifié', '1 500+', '4.9/5', '★★★★★', 'Votre inscription a bien été enregistrée'];
for (const claim of forbiddenPublicClaims) {
  if (storefrontSource.includes(claim)) errors.push(`Affirmation publique non vérifiée détectée: ${claim}`);
}

for (const capability of ['languageSelect', 'currencySelect', 'webnova-theme', 'data-theme-toggle', 'applyTheme', 'marketplaceUniverses', 'searchProducts', 'renderBlog', 'renderArticle', 'renderSupport', 'renderRoadmap', 'setupMotion']) {
  if (!storefrontSource.includes(capability)) errors.push(`Capacité marketplace manquante: ${capability}`);
}
for (const capability of ['renderAbout', 'renderContact', "renderLegal('legal')", 'product.prerequisites', 'product.documentation', 'product.screenshots']) {
  if (!storefrontSource.includes(capability)) errors.push(`Contenu de confiance manquant: ${capability}`);
}

for (const match of storefrontSource.matchAll(/href="([^"#]+\.html)(?:[?#][^"}]*)?"/g)) {
  const ref = match[1];
  if (!ref.includes('${') && !fs.existsSync(path.join(root, ref))) errors.push(`Lien dynamique introuvable: ${ref}`);
}

const commercePath = path.join(root, 'scripts/commerce.js');
if (!fs.existsSync(commercePath)) {
  errors.push('Adaptateur commerce manquant: scripts/commerce.js');
} else {
  const commerceSource = fs.readFileSync(commercePath, 'utf8');
  for (const capability of ['createCheckoutContract', 'verified-server-webhook', 'signedDownloadLinks', 'invoiceFromMerchantOfRecord']) {
    if (!commerceSource.includes(capability)) errors.push(`Contrat FastSpring incomplet: ${capability}`);
  }
}

const webhookContractPath = path.join(root, 'integrations/fastspring/webhook-contract.mjs');
if (!fs.existsSync(webhookContractPath)) {
  errors.push('Contrat webhook FastSpring manquant');
} else {
  const webhookSource = fs.readFileSync(webhookContractPath, 'utf8');
  for (const safeguard of ['createHmac', 'timingSafeEqual', 'order.completed', 'hasProcessed', 'markProcessed']) {
    if (!webhookSource.includes(safeguard)) errors.push(`Protection webhook manquante: ${safeguard}`);
  }
}

for (const match of productsSource.matchAll(/cover:\s*'([^']+)'/g)) {
  if (!fs.existsSync(path.join(root, match[1]))) errors.push(`Couverture produit introuvable: ${match[1]}`);
}

if (!fs.existsSync(path.join(root, 'assets/og-webnova-v2.jpg'))) {
  errors.push('Carte de partage WebNova introuvable: assets/og-webnova-v2.jpg');
}

const buildSource = fs.readFileSync(path.join(root, 'scripts/build-static.mjs'), 'utf8');
for (const capability of ['property="og:title"', 'twitter:card', 'application/ld+json', 'sitemap.xml', 'robots.txt', 'rel="preload"']) {
  if (!buildSource.includes(capability)) errors.push(`Optimisation de build manquante: ${capability}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validation réussie: ${htmlFiles.length} pages HTML et ${productIds.length} produits.`);
