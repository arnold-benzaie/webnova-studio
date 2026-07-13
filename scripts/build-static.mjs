import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const client = path.join(dist, 'client');
const server = path.join(dist, 'server');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(client, { recursive: true });
fs.mkdirSync(server, { recursive: true });

const rootFiles = fs.readdirSync(root).filter((name) =>
  name.endsWith('.html') || ['CNAME', 'robots.txt', 'sitemap.xml'].includes(name)
);

for (const name of rootFiles) {
  fs.copyFileSync(path.join(root, name), path.join(client, name));
}

for (const directory of ['assets', 'scripts', 'styles']) {
  fs.cpSync(path.join(root, directory), path.join(client, directory), { recursive: true });
}

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

    return new Response('Page introuvable', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' }
    });
  }
};

export default worker;
`;

fs.writeFileSync(path.join(server, 'index.js'), worker);

console.log(`Build WebNova prêt : ${rootFiles.length} pages/fichiers racine et 3 répertoires statiques.`);
