import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const dist = path.join(root, 'dist');
const client = path.join(dist, 'client');
const server = path.join(dist, 'server');
const assetVersion = (process.env.VERCEL_GIT_COMMIT_SHA || '20260714').slice(0, 8);
const themeBootstrap = `<script>(function(){try{var theme=JSON.parse(localStorage.getItem('webnova-theme'));document.documentElement.dataset.theme=theme==='white'?'white':'midnight';document.documentElement.style.colorScheme=theme==='white'?'light':'dark'}catch(_){document.documentElement.dataset.theme='midnight'}})();</script>`;

const bootFallback = `<section class="boot-fallback shell" aria-live="polite">
  <span>WEBNOVA MARKETPLACE</span>
  <h1>Premium digital resources</h1>
  <p>The marketplace is loading. If the page takes longer than expected, open the catalogue directly.</p>
  <a href="catalogue.html">Open the catalogue</a>
</section>`;

function prepareHtml(source) {
  let output = source;
  if (!output.includes("localStorage.getItem('webnova-theme')")) {
    output = output.replace('</title>', `</title>${themeBootstrap}`);
  }
  if (!output.includes('scripts/commerce.js')) {
    output = output.replace(
      '<script defer src="scripts/main.js"></script>',
      '<script defer src="scripts/commerce.js"></script><script defer src="scripts/main.js"></script>'
    );
  }
  output = output
    .replace(
      /<link href="(https:\/\/fonts\.googleapis\.com\/[^"]+)" rel="stylesheet">/,
      '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">\n  <noscript><link href="$1" rel="stylesheet"></noscript>'
    )
    .replace(
      /(styles\/main\.css|scripts\/products\.js|scripts\/commerce\.js|scripts\/main\.js)(?:\?v=[^"']*)?/g,
      `$1?v=${assetVersion}`
    )
    .replace(
      '<main id="pageContent"><noscript><p class="shell">JavaScript must be enabled to browse the WebNova catalogue.</p></noscript></main>',
      `<main id="pageContent">${bootFallback}<noscript><p class="shell">JavaScript must be enabled to browse the WebNova catalogue.</p></noscript></main>`
    )
    .replace(
      '<main id="pageContent"></main>',
      `<main id="pageContent">${bootFallback}</main>`
    );

  const title = output.match(/<title>([^<]+)<\/title>/)?.[1] || 'WebNova Marketplace';
  const description = output.match(/<meta name="description" content="([^"]*)">/)?.[1] || 'Premium WebNova digital resources.';
  const canonical = output.match(/<link rel="canonical" href="([^"]+)">/)?.[1] || 'https://webnova.company/';
  if (!output.includes('property="og:title"')) {
    const socialMetadata = `
  <meta property="og:type" content="website"><meta property="og:site_name" content="WebNova Marketplace">
  <meta property="og:title" content="${title}"><meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}"><meta property="og:image" content="https://webnova.company/assets/og-webnova-v2.jpg">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}"><meta name="twitter:image" content="https://webnova.company/assets/og-webnova-v2.jpg">
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical, isPartOf: { '@type': 'WebSite', name: 'WebNova Marketplace', url: 'https://webnova.company/' } })}</script>`;
    output = output.replace('</head>', `${socialMetadata}\n</head>`);
  }
  return output;
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(client, { recursive: true });
fs.mkdirSync(server, { recursive: true });

const rootFiles = fs.readdirSync(root).filter((name) =>
  name.endsWith('.html') || ['CNAME', 'robots.txt', 'sitemap.xml'].includes(name)
);

for (const name of rootFiles) {
  const source = path.join(root, name);
  const destination = path.join(client, name);
  if (name.endsWith('.html')) {
    fs.writeFileSync(destination, prepareHtml(fs.readFileSync(source, 'utf8')));
  } else {
    fs.copyFileSync(source, destination);
  }
}

for (const directory of ['assets', 'scripts', 'styles']) {
  fs.cpSync(path.join(root, directory), path.join(client, directory), { recursive: true });
}

for (const unusedAsset of [
  'assets/og-webnova.png',
  'assets/og-webnova-v2.png',
  'assets/products/aurora-commerce-cover.png',
  'scripts/build-static.mjs',
  'scripts/validate.mjs',
  'scripts/test-fastspring.mjs'
]) {
  fs.rmSync(path.join(client, unusedAsset), { force: true });
}

const productSandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts', 'products.js'), 'utf8'), productSandbox);
const productIds = productSandbox.window.WebNovaData.products.map((product) => product.id);
const articleIds = [
  'seo-checklist-publication', 'google-business-optimisation', 'bibliotheque-prompts-chatgpt',
  'assistant-workflow-agent-ia', 'n8n-lead-capture-suivi', 'offre-numerique-confiance',
  'vendre-international-maurice', 'evaluer-template-web'
];
const sitemapEntries = [
  ['https://webnova.company/', '1.0', 'weekly'],
  ...['catalogue', 'categories', 'bundles', 'academy', 'blog', 'support', 'roadmap', 'faq', 'about', 'contact'].map((name) => [`https://webnova.company/${name}.html`, name === 'catalogue' ? '0.9' : '0.8', name === 'catalogue' ? 'daily' : 'weekly']),
  ...['refund-policy', 'license', 'terms', 'privacy', 'legal-notice'].map((name) => [`https://webnova.company/${name}.html`, '0.5', 'yearly']),
  ...productIds.map((id) => [`https://webnova.company/product.html?id=${id}`, '0.8', 'weekly']),
  ...articleIds.map((id) => [`https://webnova.company/article.html?id=${id}`, '0.7', 'monthly'])
];
const generatedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(([url, priority, frequency]) => `  <url><loc>${url}</loc><lastmod>2026-07-14</lastmod><changefreq>${frequency}</changefreq><priority>${priority}</priority></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(client, 'sitemap.xml'), generatedSitemap);

const worker = `const worker = {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const incoming = new URL(request.url);
    let pathname = incoming.pathname;
    if (pathname === '/') pathname = '/index.html';
    else if (!pathname.split('/').pop().includes('.')) pathname += '.html';

    const assetUrl = new URL(pathname + incoming.search, request.url);
    const response = await env.ASSETS.fetch(new Request(assetUrl, request));
    if (response.status !== 404) return response;

    const notFound = await env.ASSETS.fetch(new Request(new URL('/404.html', request.url), request));
    return new Response(notFound.body, {
      status: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' }
    });
  }
};

export default worker;
`;

fs.writeFileSync(path.join(server, 'index.js'), worker);

// Sites validates the deployment metadata inside the generated dist archive.
const hostingDirectory = path.join(dist, '.openai');
fs.mkdirSync(hostingDirectory, { recursive: true });
fs.copyFileSync(path.join(root, '.openai', 'hosting.json'), path.join(hostingDirectory, 'hosting.json'));

console.log(`Build WebNova prêt : ${rootFiles.length} pages/fichiers racine et 3 répertoires statiques.`);
