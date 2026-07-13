/* WebNova Marketplace — shared storefront interactions */

(() => {
  'use strict';

  const data = window.WebNovaData;
  if (!data) return;

  const { products, categoryGroups, collections, commerce } = data;
  const page = document.body.dataset.page || 'home';
  const params = new URLSearchParams(window.location.search);
  const language = readStore('webnova-language', 'fr');
  const selectedCurrency = readStore('webnova-currency', 'MUR');
  const locales = { fr: 'fr-FR', en: 'en-CA', es: 'es-ES', pt: 'pt-PT' };
  const currencies = {
    CAD: { rate: 0.0281, label: 'CAD $' },
    EUR: { rate: 0.0183, label: 'EUR €' },
    USD: { rate: 0.0209, label: 'USD $' },
    MUR: { rate: 1, label: 'MUR Rs' }
  };
  const messages = {
    fr: {
      announcement: 'Préversion : catalogue numérique en cours de finalisation', discover: 'Découvrir les produits préparés',
      catalogue: 'Catalogue', categories: 'Catégories', bundles: 'Bundles', academy: 'Academy', blog: 'Blog', account: 'Mon compte', search: 'Rechercher',
      heroKicker: 'Ressources numériques premium', heroTitle: 'Les meilleurs outils pour', heroAccent: 'créer, automatiser et grandir.',
      heroText: 'Templates professionnels, automatisations, prompts IA et formations pratiques. Explorez un catalogue international conçu avec transparence.',
      searchPlaceholder: 'Décrivez ce que vous cherchez…', secure: 'Paiement sécurisé à activer', instant: 'Téléchargement instantané prévu',
      license: 'Licence commerciale prévue', updates: 'Mises à jour selon le produit', support: 'Support humain disponible'
    },
    en: {
      announcement: 'Preview: digital catalogue currently being finalized', discover: 'Explore prepared products',
      catalogue: 'Marketplace', categories: 'Categories', bundles: 'Bundles', academy: 'Academy', blog: 'Blog', account: 'My account', search: 'Search',
      heroKicker: 'Premium digital resources', heroTitle: 'The best tools to', heroAccent: 'create, automate and grow.',
      heroText: 'Professional templates, automations, AI prompts and practical courses. Explore a transparent marketplace built for international customers.',
      searchPlaceholder: 'Describe what you are looking for…', secure: 'Secure checkout to be activated', instant: 'Instant delivery planned',
      license: 'Commercial licence planned', updates: 'Updates vary by product', support: 'Human support available'
    },
    es: {
      announcement: 'Vista previa: catálogo digital en fase de finalización', discover: 'Explorar los productos preparados',
      catalogue: 'Catálogo', categories: 'Categorías', bundles: 'Paquetes', academy: 'Academy', blog: 'Blog', account: 'Mi cuenta', search: 'Buscar',
      heroKicker: 'Recursos digitales premium', heroTitle: 'Las mejores herramientas para', heroAccent: 'crear, automatizar y crecer.',
      heroText: 'Plantillas profesionales, automatizaciones, prompts de IA y cursos prácticos. Explora un catálogo internacional y transparente.',
      searchPlaceholder: 'Describe lo que estás buscando…', secure: 'Pago seguro por activar', instant: 'Entrega instantánea prevista',
      license: 'Licencia comercial prevista', updates: 'Actualizaciones según el producto', support: 'Soporte humano disponible'
    },
    pt: {
      announcement: 'Pré-visualização: catálogo digital em fase de finalização', discover: 'Explorar os produtos preparados',
      catalogue: 'Catálogo', categories: 'Categorias', bundles: 'Pacotes', academy: 'Academy', blog: 'Blog', account: 'Minha conta', search: 'Pesquisar',
      heroKicker: 'Recursos digitais premium', heroTitle: 'As melhores ferramentas para', heroAccent: 'criar, automatizar e crescer.',
      heroText: 'Templates profissionais, automações, prompts de IA e cursos práticos. Explore um catálogo internacional construído com transparência.',
      searchPlaceholder: 'Descreva o que procura…', secure: 'Pagamento seguro por ativar', instant: 'Entrega instantânea prevista',
      license: 'Licença comercial prevista', updates: 'Atualizações conforme o produto', support: 'Suporte humano disponível'
    }
  };
  const t = (key) => (messages[language] || messages.fr)[key] || messages.fr[key] || key;
  document.documentElement.lang = language;
  const currencyConfig = currencies[selectedCurrency] || currencies.MUR;
  const currency = new Intl.NumberFormat(locales[language] || 'fr-FR', {
    style: 'currency', currency: selectedCurrency, maximumFractionDigits: selectedCurrency === 'MUR' ? 0 : 2
  });

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const formatPrice = (value) => currency.format(value * currencyConfig.rate).replace('MUR', 'Rs');
  const findProduct = (id) => products.find((product) => product.id === id);
  const searchAliases = {
    restaurant: ['restaurant', 'cafe', 'menu', 'reservation', 'booking', 'food'],
    seo: ['seo', 'referencement', 'audit', 'mots-cles', 'search'],
    n8n: ['n8n', 'automation', 'automatisation', 'automacao', 'workflow'],
    airtable: ['airtable', 'crm', 'base', 'pipeline'],
    ia: ['ia', 'ai', 'intelligence', 'inteligencia', 'agent', 'agente', 'chatgpt', 'claude', 'gemini'],
    marketing: ['marketing', 'ads', 'publicite', 'email', 'conversion'],
    template: ['template', 'theme', 'site', 'landing', 'wordpress', 'framer'],
    design: ['design', 'ui', 'ux', 'figma', 'icone'],
    google: ['google', 'business', 'ads', 'maps', 'seo local']
  };
  const stopWords = new Set(['je','cherche','un','une','des','le','la','les','pour','avec','de','du','the','a','an','for','with','quiero','busco','procuro','um','uma']);

  function normalizeText(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').trim();
  }

  function semanticTerms(query) {
    const words = normalizeText(query).split(/\s+/).filter((word) => word && !stopWords.has(word));
    const expanded = new Set(words);
    Object.entries(searchAliases).forEach(([concept, aliases]) => {
      if (words.some((word) => word === concept || aliases.includes(word))) aliases.forEach((alias) => expanded.add(normalizeText(alias)));
    });
    return [...expanded];
  }

  function searchProducts(query, limit = products.length) {
    const terms = semanticTerms(query);
    if (!terms.length) return products.slice(0, limit);
    return products.map((product) => {
      const title = normalizeText(product.title);
      const haystack = normalizeText(`${product.title} ${product.collection} ${product.category} ${product.tagline} ${product.description} ${product.compatible} ${product.features.join(' ')}`);
      const score = terms.reduce((total, term) => total + (title.includes(term) ? 5 : haystack.includes(term) ? 2 : 0), 0);
      return { product, score };
    }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || Number(b.product.isBestSeller) - Number(a.product.isBestSeller)).slice(0, limit).map((item) => item.product);
  }

  function readStore(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getCart() {
    return readStore('webnova-cart', {});
  }

  function getWishlist() {
    return readStore('webnova-wishlist', []);
  }

  function cartCount() {
    return Object.values(getCart()).reduce((sum, quantity) => sum + Number(quantity), 0);
  }

  function logo() {
    return `
      <span class="brand-mark" aria-hidden="true"><span>✦</span></span>
      <span class="brand-name"><span><b>WEB</b>NOVA</span><small>MARKETPLACE</small></span>`;
  }

  function renderHeader() {
    const target = $('#siteHeader');
    if (!target) return;
    target.innerHTML = `
      <div class="announcement">
        <div class="shell announcement-inner">
          <span>${t('announcement')}</span>
          <a href="catalogue.html">${t('discover')} <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <header class="site-nav" id="siteNav">
        <div class="shell nav-row">
          <a class="brand" href="index.html" aria-label="WebNova Marketplace — Accueil">${logo()}</a>
          <nav class="desktop-nav" aria-label="Navigation principale">
            <a href="catalogue.html" ${page === 'catalogue' ? 'aria-current="page"' : ''}>${t('catalogue')}</a>
            <a href="categories.html" ${page === 'categories' ? 'aria-current="page"' : ''}>${t('categories')}</a>
            <a href="bundles.html" ${page === 'bundles' ? 'aria-current="page"' : ''}>${t('bundles')}</a>
            <a href="academy.html" ${page === 'academy' ? 'aria-current="page"' : ''}>${t('academy')}</a>
            <a href="blog.html" ${page === 'blog' ? 'aria-current="page"' : ''}>${t('blog')}</a>
          </nav>
          <div class="nav-actions">
            <div class="locale-controls" aria-label="Langue et devise">
              <label><span class="sr-only">Langue</span><select id="languageSelect" aria-label="Langue"><option value="fr" ${language === 'fr' ? 'selected' : ''}>FR</option><option value="en" ${language === 'en' ? 'selected' : ''}>EN</option><option value="es" ${language === 'es' ? 'selected' : ''}>ES</option><option value="pt" ${language === 'pt' ? 'selected' : ''}>PT</option></select></label>
              <label><span class="sr-only">Devise</span><select id="currencySelect" aria-label="Devise">${Object.entries(currencies).map(([code, config]) => `<option value="${code}" ${selectedCurrency === code ? 'selected' : ''}>${config.label}</option>`).join('')}</select></label>
            </div>
            <button class="icon-button search-button" type="button" data-open-search aria-label="${t('search')}"><span aria-hidden="true">⌕</span></button>
            <a class="icon-button" href="wishlist.html" aria-label="Liste de souhaits"><span aria-hidden="true">♡</span><span class="count-badge" data-wishlist-count>0</span></a>
            <a class="icon-button" href="panier.html" aria-label="Panier"><span aria-hidden="true">▱</span><span class="count-badge" data-cart-count>0</span></a>
            <a class="account-link" href="account.html"><span class="account-avatar">AB</span><span>${t('account')}</span></a>
            <button class="mobile-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span><span></span></button>
          </div>
        </div>
        <nav class="mobile-nav" aria-label="Navigation mobile">
          <a href="catalogue.html">${t('catalogue')}</a>
          <a href="categories.html">${t('categories')}</a>
          <a href="bundles.html">${t('bundles')}</a>
          <a href="academy.html">${t('academy')}</a>
          <a href="blog.html">${t('blog')}</a>
          <a href="downloads.html">Téléchargements</a>
          <a href="orders.html">Mes commandes</a>
          <a href="licenses.html">Mes licences</a>
          <a href="invoices.html">Mes factures</a>
          <div class="mobile-settings"><label>Langue<select class="js-language-select"><option value="fr" ${language === 'fr' ? 'selected' : ''}>Français</option><option value="en" ${language === 'en' ? 'selected' : ''}>English</option><option value="es" ${language === 'es' ? 'selected' : ''}>Español</option><option value="pt" ${language === 'pt' ? 'selected' : ''}>Português</option></select></label><label>Devise<select class="js-currency-select">${Object.entries(currencies).map(([code, config]) => `<option value="${code}" ${selectedCurrency === code ? 'selected' : ''}>${config.label}</option>`).join('')}</select></label></div>
        </nav>
      </header>
      <div class="search-overlay" id="searchOverlay" aria-hidden="true">
        <div class="search-panel" role="dialog" aria-modal="true" aria-labelledby="searchTitle">
          <div class="search-panel-head">
            <div><span class="eyebrow">Recherche globale</span><h2 id="searchTitle">Que recherchez-vous ?</h2></div>
            <button class="icon-button" type="button" data-close-search aria-label="Fermer">×</button>
          </div>
          <label class="global-search-field"><span aria-hidden="true">⌕</span><input id="globalSearchInput" type="search" placeholder="${t('searchPlaceholder')}" autocomplete="off"></label>
          <div class="quick-searches"><span>Populaire :</span><button data-search-term="Restaurant">Restaurant</button><button data-search-term="n8n">n8n</button><button data-search-term="SEO">SEO</button><button data-search-term="IA">IA</button></div>
          <div id="globalSearchResults" class="search-results"></div>
        </div>
      </div>`;
  }

  function renderFooter() {
    const target = $('#siteFooter');
    if (!target) return;
    target.innerHTML = `
      <section class="newsletter-strip">
        <div class="shell newsletter-inner">
          <div><span class="eyebrow">WebNova Insider</span><h2>Une ressource premium dans votre boîte mail.</h2><p>Nouveautés, guides et offres réservées à notre communauté.</p></div>
          <form class="newsletter-form" data-demo-form><input type="email" required placeholder="vous@entreprise.com" aria-label="Votre adresse email"><button class="btn btn-primary" type="submit">Je m’inscris</button></form>
        </div>
      </section>
      <footer class="footer">
        <div class="shell footer-grid">
          <div class="footer-brand"><a class="brand" href="index.html">${logo()}</a><p>Ressources numériques premium, formations et automatisations pour construire, promouvoir et développer votre activité.</p><div class="footer-badges"><span>Checkout en préparation</span><span>Livraison automatique prévue</span><span>Support humain</span></div></div>
          <div><h3>Marketplace</h3><a href="catalogue.html">Tous les produits</a><a href="categories.html">Catégories</a><a href="bundles.html">Bundles Premium</a><a href="academy.html">WebNova Academy</a><a href="blog.html">Blog & tutoriels</a></div>
          <div><h3>Ressources</h3><a href="support.html">Centre d’aide</a><a href="faq.html">Documentation</a><a href="roadmap.html">Roadmap</a><a href="roadmap.html#api">API — en préparation</a><a href="https://github.com/arnold-benzaie/webnova-studio" target="_blank" rel="noopener">GitHub</a></div>
          <div><h3>Mon espace</h3><a href="account.html">Mon compte</a><a href="orders.html">Mes commandes</a><a href="downloads.html">Téléchargements</a><a href="licenses.html">Mes licences</a><a href="invoices.html">Mes factures</a><a href="wishlist.html">Wishlist</a></div>
          <div><h3>Aide & légal</h3><a href="faq.html">Questions fréquentes</a><a href="refund-policy.html">Remboursements</a><a href="license.html">Licence d’utilisation</a><a href="terms.html">Conditions de vente</a><a href="privacy.html">Confidentialité</a></div>
          <div><h3>Communauté</h3><a href="roadmap.html#community">Discord — en préparation</a><a href="roadmap.html#community">LinkedIn — en préparation</a><a href="roadmap.html#community">YouTube — en préparation</a><a href="mailto:hello@webnova.company">Email</a><a href="https://wa.me/23058574757" target="_blank" rel="noopener">WhatsApp</a></div>
        </div>
        <div class="shell footer-bottom"><span>© 2026 WebNova Studio. Tous droits réservés.</span><span>Digital · Innovation · Mauritius</span><a href="https://wa.me/23058574757" target="_blank" rel="noopener">Support WhatsApp : +230 5857 4757</a></div>
      </footer>
      <div class="support-widget"><button class="support-fab" type="button" data-toggle-support aria-expanded="false" aria-controls="supportPanel"><span>✦</span><b>Support</b></button><div class="support-panel" id="supportPanel" hidden><div><span>Centre d’aide WebNova</span><button type="button" data-toggle-support aria-label="Fermer">×</button></div><p>Choisissez le canal qui vous convient. Aucun chatbot ne simule une réponse humaine.</p><a href="https://wa.me/23058574757" target="_blank" rel="noopener"><b>WhatsApp</b><small>Écrire à l’équipe WebNova</small></a><a href="mailto:hello@webnova.company"><b>Email</b><small>hello@webnova.company</small></a><a href="faq.html"><b>FAQ</b><small>Réponses immédiates</small></a><a href="support.html"><b>Centre d’aide</b><small>Tous les canaux de support</small></a></div></div>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  }

  function productVisual(product, modifier = '') {
    if (product.cover) {
      const priority = modifier.includes('visual-hero') || modifier.includes('visual-detail');
      return `<div class="product-visual product-photo ${modifier}" role="img" aria-label="Couverture originale de ${product.title}"><img src="${product.cover}" alt="Aperçu du template ${product.title}" loading="${priority ? 'eager' : 'lazy'}" ${priority ? 'fetchpriority="high"' : ''} decoding="async"></div>`;
    }
    return `
      <div class="product-visual ${modifier}" style="--product-accent:${product.accent}" role="img" aria-label="Aperçu de ${product.title}">
        <span class="visual-grid" aria-hidden="true"></span>
        <span class="visual-orb visual-orb-one" aria-hidden="true"></span>
        <span class="visual-orb visual-orb-two" aria-hidden="true"></span>
        <span class="visual-code">${product.icon}</span>
        <span class="visual-label">WEBNOVA ORIGINAL</span>
        <span class="visual-title">${product.title}</span>
        <span class="visual-type">${product.collection}</span>
      </div>`;
  }

  function stars(rating) {
    return `<span class="stars" aria-label="Note ${rating} sur 5">★★★★★</span>`;
  }

  function publicBadge(product) {
    if (product.badge === 'Meilleure vente') return 'Sélection WebNova';
    if (product.badge.startsWith('Économisez')) return 'Bundle en préparation';
    return product.badge;
  }

  function reviewStatus() {
    return '<span class="review-pending">☆ Nouveau sur WebNova · avis vérifiés après le lancement</span>';
  }

  function productCard(product, compact = false) {
    const wishlisted = getWishlist().includes(product.id);
    return `
      <article class="product-card ${compact ? 'product-card-compact' : ''}" data-product-id="${product.id}">
        <div class="product-card-media">
          <a href="product.html?id=${product.id}" aria-label="Voir ${product.title}">${productVisual(product)}</a>
          <span class="product-badge">${publicBadge(product)}</span>
          <button class="wishlist-button js-wishlist ${wishlisted ? 'is-active' : ''}" type="button" data-id="${product.id}" aria-label="${wishlisted ? 'Retirer de' : 'Ajouter à'} la wishlist">${wishlisted ? '♥' : '♡'}</button>
          <button class="quick-add js-add-cart" type="button" data-id="${product.id}">Ajouter au panier</button>
        </div>
        <div class="product-card-body">
          <div class="product-meta"><span>${product.collection}</span><span>${product.type}</span></div>
          <h3><a href="product.html?id=${product.id}">${product.title}</a></h3>
          <p>${product.tagline}</p>
          <div class="rating-line">${reviewStatus()}</div>
          <div class="price-line"><strong>${formatPrice(product.price)}</strong><small>Prix indicatif</small></div>
        </div>
      </article>`;
  }

  function sectionHeading(eyebrow, title, text, link = '') {
    return `<div class="section-heading"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2><p>${text}</p></div>${link}</div>`;
  }

  function breadcrumb(items) {
    return `<nav class="breadcrumb shell" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a>${items.map((item, index) => index === items.length - 1 ? `<span>${item.label}</span>` : `<a href="${item.href}">${item.label}</a>`).join('')}</nav>`;
  }

  function categoryCard(group) {
    const matchingProducts = products.filter((product) => product.category === group.name);
    const collectionCount = new Set(matchingProducts.map((product) => product.collection)).size;
    return `<a class="category-card" href="catalogue.html?category=${encodeURIComponent(group.name)}"><span class="category-icon">${group.icon}</span><div><h3>${group.name}</h3><p>${group.description}</p><span>${matchingProducts.length} produits · ${collectionCount} collection${collectionCount > 1 ? 's' : ''}</span></div><b aria-hidden="true">→</b></a>`;
  }

  const marketplaceUniverses = [
    ['Templates','WEB','Sites, boutiques et landing pages','Templates'], ['Automation','AUT','Workflows n8n et opérations automatisées','Automatisation'],
    ['AI','AI','Agents et outils d’intelligence artificielle','IA'], ['CRM','CRM','Systèmes clients et pipelines commerciaux','CRM'],
    ['SEO','SEO','Audits, contenus et visibilité organique','SEO'], ['Marketing','MKT','Acquisition, email et conversion','Marketing'],
    ['Google Business','GBP','Visibilité locale et profils Google','Google Business'], ['Prompt Engineering','GPT','Bibliothèques de prompts structurés','Prompts'],
    ['UI Kit','UI','Interfaces et systèmes de composants','UI Kit'], ['WordPress','WP','Thèmes et ressources WordPress','WordPress'],
    ['Framer','FR','Templates visuels Framer','Framer'], ['Notion','NO','Systèmes de travail et documentation','Notion'],
    ['Figma','FG','Fichiers sources et design systems','Figma'], ['Documentation','DOC','Guides, PDF et checklists','Guide'],
    ['Academy','EDU','Cours, quiz, projets et certificats','Academy'], ['Bundles','BOX','Collections premium par objectif','Bundle']
  ];

  function universeCard([title, icon, description, term]) {
    const count = products.filter((product) => `${product.title} ${product.category} ${product.collection} ${product.compatible}`.toLowerCase().includes(term.toLowerCase())).length;
    return `<a class="universe-card" href="catalogue.html?search=${encodeURIComponent(term)}"><span>${icon}</span><div><h2>${title}</h2><p>${description}</p><small>${count ? `${count} fiche${count > 1 ? 's' : ''} correspondante${count > 1 ? 's' : ''}` : 'Collection en préparation'}</small></div><b>↗</b></a>`;
  }

  function renderHome() {
    const featuredIds = ['ecommerce-aurora', 'restaurant-pro', 'avocat-authority', 'hotel-luxe', 'prompts-chatgpt-pro', 'ai-agent-support', 'n8n-lead-machine', 'airtable-crm'];
    const best = featuredIds.map(findProduct).filter(Boolean);
    const newest = products.filter((product) => product.isNew).slice(0, 4);
    const academy = products.filter((product) => product.category === 'Academy').slice(0, 4);
    $('#pageContent').innerHTML = `
      <section class="market-hero">
        <div class="hero-noise" aria-hidden="true"></div>
        <div class="shell hero-grid">
          <div class="hero-copy">
            <span class="hero-kicker"><i></i> ${t('heroKicker')}</span>
            <h1>${t('heroTitle')} <span>${t('heroAccent')}</span></h1>
            <p>${t('heroText')}</p>
            <form class="hero-search" action="catalogue.html"><span aria-hidden="true">⌕</span><input type="search" name="search" placeholder="${t('searchPlaceholder')}" aria-label="${t('search')}"><button type="submit">${t('search')}</button></form>
            <div class="hero-pills"><span>Recherches populaires :</span><a href="catalogue.html?search=n8n">n8n</a><a href="catalogue.html?search=Restaurant">Restaurant</a><a href="catalogue.html?search=SEO">SEO</a><a href="catalogue.html?search=Prompts">Prompts IA</a></div>
            <div class="hero-benefits"><span>◇ ${t('secure')}</span><span>⚡ ${t('instant')}</span><span>✓ ${t('license')}</span><span>↻ ${t('updates')}</span><span>◎ ${t('support')}</span></div>
            <div class="hero-proof"><div><strong>${products.length}</strong><span>fiches préparées</span></div><div><strong>16</strong><span>univers explorables</span></div><div><strong>22</strong><span>pages marketplace</span></div></div>
          </div>
          <div class="hero-showcase" aria-label="Sélection de produits WebNova">
            <div class="showcase-glow"></div>
            <div class="showcase-card showcase-main">${productVisual(findProduct('ecommerce-aurora'), 'visual-hero')}<div class="showcase-product-info"><span>Nouveau · Template e-commerce</span><h2>Aurora Commerce</h2><strong>${formatPrice(3990)}</strong><small>Prix indicatif · avis après lancement</small><a class="btn btn-primary" href="product.html?id=ecommerce-aurora">Voir le produit</a></div></div>
            <div class="floating-card floating-card-one"><span class="mini-icon">n8n</span><div><b>Lead Machine</b><small>Workflow prêt à importer</small></div></div>
            <div class="floating-card floating-card-two"><span class="mini-icon">IA</span><div><b>Agent Support</b><small>Automatisation prévue</small></div></div>
            <div class="floating-card floating-card-three"><span>✓</span> Livraison automatique prévue</div>
          </div>
        </div>
        <div class="shell trust-row"><span>Conçu à Maurice, pensé pour le monde</span><span>◆ Catalogue en préparation</span><span>◆ Licence commerciale claire</span><span>◆ Support en français</span><span>◆ Produits standardisés</span></div>
      </section>

      <section class="compatibility-strip"><div class="shell"><div><span class="eyebrow">Compatibilité technique</span><p>Ces technologies sont compatibles avec certains produits. Cette liste ne constitue aucun partenariat officiel.</p></div><div class="compatibility-grid">${['Google Workspace','OpenAI','Anthropic','Claude','n8n','Airtable','Figma','GitHub','Supabase','Vercel','Notion','Cloudflare'].map((name) => `<span>${name}</span>`).join('')}</div></div></section>

      <section class="section section-tinted">
        <div class="shell">${sectionHeading('Catalogue en préparation', 'Découvrez les premières ressources WebNova', 'Huit fiches détaillées sont présentées ici. Leur vente sera activée uniquement lorsque les fichiers et la livraison automatique auront été vérifiés.', `<a class="text-link" href="catalogue.html">Voir les ${products.length} fiches →</a>`)}<div class="product-grid">${best.map((product) => productCard(product)).join('')}</div></div>
      </section>

      <section class="section category-section">
        <div class="shell">${sectionHeading('Explorez', 'Trouvez exactement ce qu’il vous faut', 'Des ressources organisées pour chaque étape de votre projet.', '<a class="text-link" href="categories.html">Toutes les catégories →</a>')}<div class="category-grid">${categoryGroups.slice(0, 8).map(categoryCard).join('')}</div></div>
      </section>

      <section class="section bundle-feature">
        <div class="shell bundle-feature-inner">
          <div class="bundle-art"><span class="bundle-orbit"></span><div class="bundle-box bundle-box-one">n8n</div><div class="bundle-box bundle-box-two">IA</div><div class="bundle-box bundle-box-three">CRM</div><div class="bundle-box bundle-box-four">+</div></div>
          <div class="bundle-copy"><span class="eyebrow eyebrow-gold">Bundle Premium</span><h2>Automation & AI Bundle</h2><p>Quatre solutions complètes prévues pour automatiser vos leads, votre CRM et votre support client — avec la formation n8n incluse.</p><ul><li>n8n Lead Machine</li><li>Airtable CRM OS</li><li>Agent IA Support 24/7</li><li>Formation n8n Automation Builder</li></ul><div class="bundle-price"><strong>${formatPrice(8990)}</strong><span>Prix indicatif · en préparation</span></div><div class="button-row"><a class="btn btn-gold" href="product.html?id=bundle-automation">Découvrir le bundle</a><a class="btn btn-ghost" href="bundles.html">Tous les bundles</a></div></div>
        </div>
      </section>

      <section class="section">
        <div class="shell">${sectionHeading('Nouveautés', 'Fraîchement ajoutés au catalogue', 'De nouvelles ressources pour rester à la pointe.', '<a class="text-link" href="catalogue.html?sort=newest">Toutes les nouveautés →</a>')}<div class="product-grid product-grid-four">${newest.map((product) => productCard(product)).join('')}</div></div>
      </section>

      <section class="section academy-home">
        <div class="shell">
          <div class="academy-intro"><span class="eyebrow">WebNova Academy</span><h2>Apprenez une compétence.<br><span>Appliquez-la dans un projet.</span></h2><p>Huit parcours sont préparés autour de projets, ressources, quiz et certificats. Les vidéos et durées devront être validées avant la vente.</p><div class="academy-stats"><div><strong>8</strong><span>parcours préparés</span></div><div><strong>Projet</strong><span>pratique prévue</span></div><div><strong>Bientôt</strong><span>contenus à valider</span></div></div><a class="btn btn-primary" href="academy.html">Explorer l’Academy</a></div>
          <div class="academy-list">${academy.map((product, index) => `<a href="product.html?id=${product.id}" class="academy-row"><span class="course-number">0${index + 1}</span><span class="course-icon" style="--product-accent:${product.accent}">${product.icon}</span><span><b>${product.title}</b><small>${product.collection} · ${product.fileSize}</small></span><strong>${formatPrice(product.price)}</strong><i>→</i></a>`).join('')}</div>
        </div>
      </section>

      <section class="section section-tinted testimonials-section">
        <div class="shell">${sectionHeading('Engagements WebNova', 'Des preuves avant des promesses', 'Les avis, ventes et téléchargements seront affichés seulement lorsqu’ils proviendront de commandes réelles vérifiées.')}<div class="testimonial-grid"><article><div class="commitment-icon">01</div><h3>Fichiers réellement livrables</h3><p>Chaque produit publié devra disposer de son fichier final, de sa documentation, de sa version et de sa compatibilité vérifiées.</p></article><article><div class="commitment-icon">02</div><h3>Checkout traçable</h3><p>Aucune commande ne sera confirmée depuis le navigateur seul. Le paiement et le statut de livraison seront validés côté serveur.</p></article><article><div class="commitment-icon">03</div><h3>Avis authentiques</h3><p>Les notes et témoignages seront rattachés à des achats réels. Aucun chiffre de démonstration ne sera présenté comme une preuve commerciale.</p></article></div></div>
      </section>

      <section class="section why-webnova"><div class="shell">${sectionHeading('Pourquoi choisir WebNova', 'Une marketplace construite pour la confiance', 'Chaque engagement affiché correspond soit à une fonction déjà visible, soit à une capacité clairement indiquée comme étant en préparation.')}<div class="trust-feature-grid">${[
        ['⚡','Livraison numérique','Architecture de livraison automatique prévue après validation serveur.'],
        ['◇','Licence commerciale','Droits d’utilisation expliqués avant l’ouverture des ventes.'],
        ['DOC','Documentation','Format, compatibilité et guide prévus sur chaque fiche.'],
        ['◎','Support','WhatsApp, email, FAQ et centre d’aide accessibles.'],
        ['✓','Compatibilité','Technologies compatibles indiquées produit par produit.'],
        ['↻','Mises à jour','Durée prévue affichée sans promesse générale trompeuse.'],
        ['♢','Sécurité','Aucune donnée bancaire complète stockée par WebNova.'],
        ['PAY','Paiement','Architecture préparée pour un Merchant of Record.']
      ].map(([icon,title,text]) => `<article><span>${icon}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></div></section>

      <section class="section final-cta"><div class="shell"><div><span class="eyebrow">Produits numériques, support humain</span><h2>Besoin d’aide pour choisir une ressource ?</h2><p>Posez vos questions sur les formats, licences et compatibilités avant l’achat.</p></div><a class="btn btn-gold btn-large" href="https://wa.me/23058574757?text=Bonjour%20WebNova%2C%20j%27ai%20une%20question%20sur%20un%20produit%20num%C3%A9rique." target="_blank" rel="noopener">Contacter le support</a></div></section>`;
  }

  function renderCatalogue() {
    $('#pageContent').innerHTML = `
      ${breadcrumb([{ label: 'Catalogue' }])}
      <section class="page-hero compact-hero"><div class="shell"><span class="eyebrow">Marketplace</span><h1>Le catalogue WebNova</h1><p>Explorez nos templates, ressources, automatisations et formations premium.</p></div></section>
      <section class="catalog-section"><div class="shell catalog-layout">
        <aside class="filter-panel" id="filterPanel">
          <div class="filter-head"><h2>Filtres</h2><button id="clearFilters" type="button">Réinitialiser</button></div>
          <label class="catalog-search"><span>Recherche</span><div><i>⌕</i><input id="catalogSearch" type="search" placeholder="Rechercher un produit…"></div></label>
          <label class="filter-group"><span>Catégorie</span><select id="categoryFilter"><option value="">Toutes les catégories</option>${categoryGroups.map((group) => `<option value="${group.name}">${group.name}</option>`).join('')}</select></label>
          <label class="filter-group"><span>Collection</span><select id="collectionFilter"><option value="">Toutes les collections</option>${collections.map((collection) => `<option value="${collection}">${collection}</option>`).join('')}</select></label>
          <label class="filter-group"><span>Type de produit</span><select id="typeFilter"><option value="">Tous les types</option>${[...new Set(products.map((product) => product.type))].map((type) => `<option value="${type}">${type}</option>`).join('')}</select></label>
          <div class="filter-group"><span>Prix maximum</span><input id="priceFilter" type="range" min="500" max="12000" step="250" value="12000"><div class="range-label"><span>${formatPrice(0)}</span><b id="priceValue">${formatPrice(12000)}</b></div></div>
          <label class="check-row"><input id="newFilter" type="checkbox"><span>Nouveautés uniquement</span></label>
        </aside>
        <div class="catalog-main">
          <div class="catalog-toolbar"><button class="filter-toggle" type="button" id="filterToggle">Filtres</button><p><strong id="resultCount">${products.length}</strong> produits</p><label>Trier par <select id="sortFilter"><option value="featured">Sélection WebNova</option><option value="newest">Nouveautés</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option></select></label></div>
          <div class="active-filters" id="activeFilters"></div>
          <div class="product-grid product-grid-three" id="catalogGrid"></div>
          <div class="empty-state" id="emptyCatalog" hidden><span>⌕</span><h2>Aucun produit trouvé</h2><p>Essayez un autre mot-clé ou réinitialisez les filtres.</p><button class="btn btn-primary" type="button" id="emptyReset">Réinitialiser</button></div>
        </div>
      </div></section>`;
    setupCatalogueFilters();
  }

  function setupCatalogueFilters() {
    const controls = {
      search: $('#catalogSearch'), category: $('#categoryFilter'), collection: $('#collectionFilter'),
      type: $('#typeFilter'), price: $('#priceFilter'),
      newest: $('#newFilter'), sort: $('#sortFilter')
    };
    controls.search.value = params.get('search') || '';
    controls.category.value = params.get('category') || '';
    controls.collection.value = params.get('collection') || '';
    controls.sort.value = params.get('sort') || 'featured';

    function applyFilters() {
      const search = controls.search.value.trim();
      const semanticResultList = search ? searchProducts(search) : [];
      const semanticMatches = search ? new Set(semanticResultList.map((product) => product.id)) : null;
      const semanticRank = new Map(semanticResultList.map((product, index) => [product.id, index]));
      const maxPrice = Number(controls.price.value);
      let result = products.filter((product) => {
        return (!search || semanticMatches.has(product.id)) &&
          (!controls.category.value || product.category === controls.category.value) &&
          (!controls.collection.value || product.collection === controls.collection.value) &&
          (!controls.type.value || product.type === controls.type.value) &&
          product.price <= maxPrice &&
          (!controls.newest.checked || product.isNew);
      });
      const sorters = {
        newest: (a, b) => Number(b.isNew) - Number(a.isNew),
        'price-asc': (a, b) => a.price - b.price,
        'price-desc': (a, b) => b.price - a.price,
        featured: (a, b) => search ? semanticRank.get(a.id) - semanticRank.get(b.id) : Number(b.isBestSeller) - Number(a.isBestSeller)
      };
      result.sort(sorters[controls.sort.value]);
      $('#catalogGrid').innerHTML = result.map((product) => productCard(product)).join('');
      $('#resultCount').textContent = result.length;
      $('#priceValue').textContent = formatPrice(maxPrice);
      $('#emptyCatalog').hidden = result.length > 0;
      $('#catalogGrid').hidden = result.length === 0;
      const tags = [];
      if (search) tags.push(`Recherche : ${controls.search.value}`);
      if (controls.category.value) tags.push(controls.category.value);
      if (controls.collection.value) tags.push(controls.collection.value);
      if (controls.type.value) tags.push(controls.type.value);
      if (maxPrice < 12000) tags.push(`≤ ${formatPrice(maxPrice)}`);
      if (controls.newest.checked) tags.push('Nouveautés');
      $('#activeFilters').innerHTML = tags.map((tag) => `<span>${tag}</span>`).join('');
      updateCounts();
    }

    function reset() {
      controls.search.value = '';
      controls.category.value = '';
      controls.collection.value = '';
      controls.type.value = '';
      controls.price.value = '12000';
      controls.newest.checked = false;
      controls.sort.value = 'featured';
      applyFilters();
    }

    Object.values(controls).forEach((control) => control.addEventListener(control.type === 'search' || control.type === 'range' ? 'input' : 'change', applyFilters));
    $('#clearFilters').addEventListener('click', reset);
    $('#emptyReset').addEventListener('click', reset);
    $('#filterToggle').addEventListener('click', () => $('#filterPanel').classList.toggle('is-open'));
    applyFilters();
  }

  function renderCategories() {
    const collectionGroups = categoryGroups.map((group) => ({ ...group, items: products.filter((product) => product.category === group.name) }));
    $('#pageContent').innerHTML = `
      ${breadcrumb([{ label: 'Catégories' }])}
      <section class="page-hero"><div class="shell"><span class="eyebrow">Explorer</span><h1>Des ressources pour chaque ambition.</h1><p>Parcourez le catalogue par univers et trouvez rapidement le produit adapté à votre projet.</p></div></section>
      <section class="section"><div class="shell"><div class="universe-grid">${marketplaceUniverses.map(universeCard).join('')}</div></div></section>
      <section class="section section-tinted"><div class="shell category-directory">${collectionGroups.map((group) => `<article><div class="directory-head"><span class="category-icon">${group.icon}</span><div><h2>${group.name}</h2><p>${group.description}</p></div></div><div class="collection-links">${[...new Set(group.items.map((item) => item.collection))].map((collection) => `<a href="catalogue.html?collection=${encodeURIComponent(collection)}"><span>${collection}</span><b>${group.items.filter((item) => item.collection === collection).length}</b></a>`).join('')}</div><a class="text-link" href="catalogue.html?category=${encodeURIComponent(group.name)}">Voir tous les produits →</a></article>`).join('')}</div></section>`;
  }

  function renderBundles() {
    const bundles = products.filter((product) => product.category === 'Bundles');
    $('#pageContent').innerHTML = `
      ${breadcrumb([{ label: 'Bundles Premium' }])}
      <section class="page-hero bundle-hero"><div class="shell"><span class="eyebrow eyebrow-gold">Bundles Premium</span><h1>Plus de ressources.<br><span>Un objectif complet.</span></h1><p>Des collections complémentaires en cours de préparation. Les prix et contenus restent indicatifs jusqu’à leur validation finale.</p><div class="hero-mini-trust"><span>✓ Licence prévue</span><span>✓ Contenu à valider</span><span>✓ Support prévu</span></div></div></section>
      <section class="section"><div class="shell bundle-list">${bundles.map((bundle, index) => `<article class="bundle-card-large ${index % 2 ? 'is-reversed' : ''}"><div class="bundle-cover" style="--product-accent:${bundle.accent}">${productVisual(bundle, 'visual-bundle')}<span class="savings-badge">${publicBadge(bundle)}</span></div><div class="bundle-details"><span class="eyebrow">Bundle ${String(index + 1).padStart(2, '0')}</span><h2>${bundle.title}</h2><p>${bundle.description}</p><ul>${bundle.features.map((feature) => `<li>✓ ${feature}</li>`).join('')}</ul><div class="rating-line">${reviewStatus()}</div><div class="bundle-price"><strong>${formatPrice(bundle.price)}</strong><span>Prix indicatif</span></div><div class="button-row"><a class="btn btn-primary" href="product.html?id=${bundle.id}">Voir le bundle</a><button class="btn btn-ghost js-add-cart" data-id="${bundle.id}" type="button">Ajouter au panier</button></div></div></article>`).join('')}</div></section>`;
  }

  function renderAcademy() {
    const courses = products.filter((product) => product.category === 'Academy');
    const courseLevel = (index) => ['Débutant', 'Intermédiaire', 'Avancé'][index % 3];
    $('#pageContent').innerHTML = `
      ${breadcrumb([{ label: 'Academy' }])}
      <section class="academy-hero"><div class="academy-mesh" aria-hidden="true"></div><div class="shell"><div><span class="hero-kicker"><i></i> WebNova Academy</span><h1>Des compétences que vous pouvez <span>utiliser et monétiser.</span></h1><p>Apprenez par la pratique avec des parcours structurés, des projets concrets et des ressources téléchargeables.</p><div class="button-row"><a class="btn btn-gold btn-large" href="#formations">Voir les formations</a><a class="btn btn-ghost btn-large" href="catalogue.html?category=Academy">Parcourir les mini-cours</a></div><div class="hero-proof"><div><strong>8</strong><span>parcours préparés</span></div><div><strong>Projet</strong><span>pratique guidée</span></div><div><strong>Préversion</strong><span>contenus à valider</span></div></div></div><div class="academy-certificate"><span class="certificate-star">✦</span><small>MODÈLE DE CERTIFICAT</small><h2>WEBNOVA</h2><p>ACADEMY</p><i>Délivré après validation réelle du parcours</i></div></div></section>
      <section class="section" id="formations"><div class="shell">${sectionHeading('Catalogue Academy', 'Choisissez votre prochaine compétence', 'Du marketing à l’automatisation, progressez dans le bon ordre.')}<div class="academy-filters"><label>Sujet<select id="academyTopic"><option value="">Tous les sujets</option>${courses.map((course) => course.collection).filter((value, index, list) => list.indexOf(value) === index).map((topic) => `<option value="${topic}">${topic}</option>`).join('')}</select></label><label>Niveau<select id="academyLevel"><option value="">Tous les niveaux</option><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option></select></label><span><b id="academyCount">${courses.length}</b> parcours en préparation</span></div><div class="course-grid" id="academyGrid">${courses.map((course, index) => `<article class="course-card" data-topic="${course.collection}" data-level="${courseLevel(index)}"><a href="product.html?id=${course.id}" class="course-cover" style="--product-accent:${course.accent}"><span class="course-index">${String(index + 1).padStart(2, '0')}</span><span class="course-main-icon">${course.icon}</span><small>WEBNOVA ACADEMY</small></a><div class="course-body"><div class="product-meta"><span>${course.collection}</span><span>${course.type}</span></div><h2><a href="product.html?id=${course.id}">${course.title}</a></h2><p>${course.tagline}</p><div class="course-info"><span>▸ ${course.fileSize}</span><span>◉ ${courseLevel(index)}</span><span>✓ Quiz et certificat prévus</span><span>↓ PDF, templates et bonus prévus</span></div><div class="rating-line">${reviewStatus()}</div><div class="course-footer"><div class="price-line"><strong>${formatPrice(course.price)}</strong><small>Prix indicatif</small></div><a class="circle-link" href="product.html?id=${course.id}" aria-label="Voir ${course.title}">→</a></div></div></article>`).join('')}</div><div class="empty-state" id="academyEmpty" hidden><span>EDU</span><h2>Aucun parcours correspondant</h2><p>Modifiez le sujet ou le niveau sélectionné.</p></div></div></section>
      <section class="section section-tinted"><div class="shell learning-path"><div><span class="eyebrow">Méthode WebNova</span><h2>Apprendre. Construire. Prouver.</h2><p>Chaque parcours transforme la théorie en résultat visible pour votre activité ou votre portfolio.</p></div><ol><li><span>01</span><div><h3>Comprendre</h3><p>Vidéos progressives et ressources PDF prévues.</p></div></li><li><span>02</span><div><h3>Pratiquer</h3><p>Quiz, exercices, templates et bonus applicables.</p></div></li><li><span>03</span><div><h3>Construire</h3><p>Un projet concret guidé étape par étape.</p></div></li><li><span>04</span><div><h3>Valoriser</h3><p>Un certificat prévu après validation réelle du parcours.</p></div></li></ol></div></section>`;
    setupAcademyFilters();
  }

  function setupAcademyFilters() {
    const topic = $('#academyTopic');
    const level = $('#academyLevel');
    if (!topic || !level) return;
    const apply = () => {
      let visible = 0;
      $$('#academyGrid .course-card').forEach((card) => {
        const show = (!topic.value || card.dataset.topic === topic.value) && (!level.value || card.dataset.level === level.value);
        card.hidden = !show;
        if (show) visible += 1;
      });
      $('#academyCount').textContent = visible;
      $('#academyEmpty').hidden = visible > 0;
    };
    topic.addEventListener('change', apply);
    level.addEventListener('change', apply);
  }

  function renderProduct() {
    const product = findProduct(params.get('id')) || products[0];
    const related = products.filter((item) => item.id !== product.id && (item.category === product.category || item.collection === product.collection)).slice(0, 4);
    const version = product.version || '0.9 — préversion';
    const updatedAt = product.updatedAt || '13 juillet 2026';
    const productTags = [...new Set([product.category, product.collection, product.type, ...semanticTerms(`${product.title} ${product.compatible}`).slice(0, 4)])];
    document.title = `${product.title} — WebNova Marketplace`;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.content = product.description;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://webnova.company/product.html?id=${product.id}`;
    $('#pageContent').innerHTML = `
      ${breadcrumb([{ label: product.category, href: `catalogue.html?category=${encodeURIComponent(product.category)}` }, { label: product.title }])}
      <section class="product-detail"><div class="shell product-layout">
        <div class="product-gallery">
          <div class="main-preview">${productVisual(product, 'visual-detail')}<button class="preview-button" type="button" id="openPreview"><span>▶</span> Voir l’aperçu de préproduction</button></div>
          <div class="thumbnail-grid">${['Couverture', 'Galerie prévue', 'Aperçu interactif', 'Vidéo démo prévue'].map((label, index) => `<button type="button" class="thumbnail ${index === 0 ? 'is-active' : ''}" data-gallery-index="${index}" style="--product-accent:${product.accent}"><span>${index === 3 ? '▶' : product.icon}</span><small>${label}</small></button>`).join('')}</div>
        </div>
        <div class="product-summary">
          <div class="product-labels"><span>${publicBadge(product)}</span><span>${product.type}</span></div>
          <h1>${product.title}</h1>
          <p class="product-tagline">${product.tagline}</p>
          <div class="rating-line rating-large">${reviewStatus()}</div>
          <p class="product-description">${product.description}</p>
          <div class="feature-summary">${product.features.slice(0, 4).map((feature) => `<span>✓ ${feature}</span>`).join('')}</div>
          <div class="purchase-card">
            <div class="purchase-price"><div><strong>${formatPrice(product.price)}</strong></div><span>Prix indicatif en ${selectedCurrency} · Vente non active</span></div>
            <button class="btn btn-primary btn-block btn-large js-buy-now" type="button" data-id="${product.id}">Voir le checkout en préparation</button>
            <button class="btn btn-ghost btn-block js-add-cart" type="button" data-id="${product.id}">Ajouter au panier</button>
            <button class="wishlist-text js-wishlist" type="button" data-id="${product.id}">${getWishlist().includes(product.id) ? '♥ Retirer de la wishlist' : '♡ Ajouter à la wishlist'}</button>
            <div class="purchase-trust"><span><b>⚡</b> Livraison automatique prévue</span><span><b>♢</b> Checkout à activer</span><span><b>↻</b> Mises à jour ${product.updates.toLowerCase()}</span></div>
            <div class="payment-readiness" aria-label="Moyens de paiement prévus"><span>FastSpring-ready</span><span>VISA</span><span>Mastercard</span><span>G Pay</span><span>Apple Pay</span></div>
          </div>
          <p class="vat-note">Conversion indicative. Le prix localisé, les taxes et les moyens disponibles seront confirmés par le checkout avant toute vente.</p>
        </div>
      </div></section>
      <section class="product-information"><div class="shell info-layout">
        <div class="info-main">
          <div class="tabs" role="tablist"><button class="is-active" data-tab="description" type="button">Description</button><button data-tab="features" type="button">Caractéristiques</button><button data-tab="documentation" type="button">Documentation</button><button data-tab="changelog" type="button">Changelog</button><button data-tab="license" type="button">Licence</button><button data-tab="support" type="button">Support</button></div>
          <div class="tab-panel is-active" data-panel="description"><h2>À propos de ${product.title}</h2><p>${product.description}</p><p>Cette fiche présente la structure prévue du produit. Avant l’ouverture commerciale, WebNova devra valider le fichier final, la documentation, la compatibilité annoncée et la livraison automatique.</p><div class="content-highlight"><span>✦</span><div><h3>Produit WebNova en préparation</h3><p>Direction premium, documentation française et support humain prévus depuis Maurice.</p></div></div></div>
          <div class="tab-panel" data-panel="features"><h2>Tout ce qui est inclus</h2><div class="full-feature-grid">${product.features.map((feature) => `<div><span>✓</span><p>${feature}</p></div>`).join('')}</div><h3>Informations techniques</h3><div class="spec-table"><div><span>Format</span><b>${product.format}</b></div><div><span>Taille / durée</span><b>${product.fileSize}</b></div><div><span>Compatibilité</span><b>${product.compatible}</b></div><div><span>Mises à jour</span><b>${product.updates}</b></div></div></div>
          <div class="tab-panel" data-panel="documentation"><h2>Documentation prévue</h2><p>Le téléchargement final devra inclure un guide d’installation, les prérequis, la personnalisation, la résolution des problèmes fréquents et les conditions de support.</p><div class="documentation-list"><span>01 · Guide de démarrage</span><span>02 · Compatibilité et prérequis</span><span>03 · Personnalisation</span><span>04 · FAQ technique</span></div></div>
          <div class="tab-panel" data-panel="changelog"><h2>Historique des versions</h2><div class="changelog"><article><b>${version}</b><span>${updatedAt}</span><p>Fiche, contenu prévu et compatibilités préparés pour validation.</p></article><article><b>1.0</b><span>À venir</span><p>La version commerciale sera publiée uniquement après contrôle du fichier, de la documentation et de la livraison.</p></article></div></div>
          <div class="tab-panel" data-panel="license"><h2>Licence d’utilisation prévue</h2><p>Lors de l’ouverture, l’achat devra inclure une licence personnelle ou commerciale précise pour un projet final. La revente, le partage ou la redistribution des fichiers sources resteront interdits.</p><a class="text-link" href="license.html">Lire la licence complète →</a></div>
          <div class="tab-panel" data-panel="support"><h2>Support prévu</h2><p>Une documentation détaillée et ${product.support} de support sont prévus pour les questions d’installation et d’utilisation. Ces éléments devront être confirmés sur la fiche finale.</p><a class="btn btn-ghost" href="https://wa.me/23058574757" target="_blank" rel="noopener">Poser une question</a></div>
        </div>
        <aside class="info-sidebar"><h3>Informations produit</h3><dl><div><dt>Auteur</dt><dd>WebNova Studio</dd></div><div><dt>Statut</dt><dd>En préparation</dd></div><div><dt>Version</dt><dd>${version}</dd></div><div><dt>Mise à jour</dt><dd>${updatedAt}</dd></div><div><dt>Taille / durée</dt><dd>${product.fileSize}</dd></div><div><dt>Format prévu</dt><dd>${product.format}</dd></div><div><dt>Compatibilité prévue</dt><dd>${product.compatible}</dd></div><div><dt>Support prévu</dt><dd>${product.support}</dd></div></dl><div class="product-tags">${productTags.map((tag) => `<a href="catalogue.html?search=${encodeURIComponent(tag)}">${tag}</a>`).join('')}</div><div class="secure-note"><span>♢</span><div><b>Validation requise</b><p>Les fichiers et la livraison seront testés avant la vente.</p></div></div></aside>
      </div></section>
      <section class="section section-tinted" id="reviews"><div class="shell reviews-layout reviews-pending"><div class="review-score"><strong>—</strong><span>Aucune note publique</span></div><div><span class="eyebrow">Transparence</span><h2>Les avis apparaîtront après le lancement.</h2><p>WebNova publiera ici uniquement les retours liés à une commande réelle. Les témoignages et statistiques de démonstration ne sont pas présentés comme des preuves commerciales.</p></div></div></section>
      <section class="section product-faq-section"><div class="shell product-faq-layout"><div><span class="eyebrow">FAQ produit</span><h2>Avant de choisir ${product.title}</h2><p>Les réponses correspondent à l’état actuel de la préversion.</p></div><div class="product-faq-list"><details open><summary>Le produit est-il déjà disponible ?</summary><p>Non. Cette fiche est une démonstration réaliste du catalogue. Le checkout reste bloqué tant que le fichier final et sa livraison automatique ne sont pas validés.</p></details><details><summary>Quel format est prévu ?</summary><p>${product.format}. Le téléchargement final devra inclure la documentation et la licence correspondant au produit.</p></details><details><summary>Quelle compatibilité est annoncée ?</summary><p>${product.compatible}. Cette compatibilité devra être testée avant l’ouverture commerciale.</p></details><details><summary>Quelle licence sera proposée ?</summary><p>Une licence WebNova claire pour un projet final est prévue. Les droits exacts seront rappelés avant le paiement et dans le fichier livré.</p></details><details><summary>Le support et les mises à jour sont-ils inclus ?</summary><p>${product.support} de support et des mises à jour ${product.updates.toLowerCase()} sont prévus. Ces engagements seront confirmés au lancement.</p></details></div></div></section>
      <section class="section"><div class="shell">${sectionHeading('Vous aimerez aussi', 'Produits similaires', 'D’autres ressources sélectionnées pour votre projet.')}<div class="product-grid product-grid-four">${related.map((item) => productCard(item)).join('')}</div></div></section>
      <dialog class="preview-dialog" id="previewDialog"><button class="dialog-close" type="button" id="closePreview" aria-label="Fermer">×</button><div class="demo-stage" style="--product-accent:${product.accent}"><div class="demo-top"><span></span><span></span><span></span><b>${product.title}</b></div><div class="demo-content"><aside>${product.features.slice(0,4).map((feature) => `<span>${feature}</span>`).join('')}</aside><main><div class="demo-hero"><small>APERÇU DE PRÉPRODUCTION</small><h2>${product.tagline}</h2><i></i></div><div class="demo-cards"><span></span><span></span><span></span></div></main></div><div class="demo-progress"><i></i></div></div><div class="dialog-caption"><h2>Aperçu de ${product.title}</h2><p>La vidéo et les captures définitives sont en préparation. Cet aperçu montre uniquement la direction prévue.</p></div></dialog>`;
    setupProductPage(product);
  }

  function setupProductPage(product) {
    $$('.tabs button').forEach((button) => button.addEventListener('click', () => {
      $$('.tabs button').forEach((item) => item.classList.remove('is-active'));
      $$('.tab-panel').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      $(`[data-panel="${button.dataset.tab}"]`).classList.add('is-active');
    }));
    $$('.thumbnail').forEach((button) => button.addEventListener('click', () => {
      $$('.thumbnail').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      const visualType = $('.main-preview .visual-type');
      if (visualType) visualType.textContent = button.querySelector('small').textContent;
    }));
    const dialog = $('#previewDialog');
    $('#openPreview').addEventListener('click', () => dialog.showModal());
    $('#closePreview').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    injectProductSchema(product);
  }

  function injectProductSchema(product) {
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: product.title,
      sku: product.id, description: product.description, category: product.category,
      brand: { '@type': 'Brand', name: 'WebNova' },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Format', value: product.format },
        { '@type': 'PropertyValue', name: 'Compatibility', value: product.compatible },
        { '@type': 'PropertyValue', name: 'Status', value: 'Pre-release catalogue preview' }
      ]
    });
    document.head.appendChild(schema);
  }

  function renderCart() {
    const cart = getCart();
    const entries = Object.entries(cart).map(([id, quantity]) => ({ product: findProduct(id), quantity })).filter((item) => item.product);
    const subtotal = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    $('#pageContent').innerHTML = `
      ${breadcrumb([{ label: 'Panier' }])}
      <section class="page-hero compact-hero"><div class="shell"><span class="eyebrow">Votre sélection</span><h1>Panier</h1><p>${entries.length ? 'Vérifiez vos produits avant de continuer.' : 'Votre panier attend votre prochain projet.'}</p></div></section>
      <section class="section"><div class="shell cart-layout">${entries.length ? `<div class="cart-items"><div class="cart-title"><h2>${entries.length} produit${entries.length > 1 ? 's' : ''}</h2><button type="button" data-clear-cart>Vider le panier</button></div>${entries.map(({ product, quantity }) => `<article class="cart-item">${productVisual(product, 'visual-cart')}<div class="cart-product"><span>${product.collection}</span><h3><a href="product.html?id=${product.id}">${product.title}</a></h3><p>${product.format} · Livraison automatique prévue</p><button class="js-remove-cart" data-id="${product.id}" type="button">Supprimer</button></div><label class="quantity-control"><span>Quantité</span><select class="js-quantity" data-id="${product.id}">${[1,2,3,4,5].map((value) => `<option ${value === Number(quantity) ? 'selected' : ''}>${value}</option>`).join('')}</select></label><strong>${formatPrice(product.price * quantity)}</strong></article>`).join('')}</div><aside class="order-summary"><h2>Résumé</h2><div><span>Sous-total indicatif</span><b>${formatPrice(subtotal)}</b></div><div><span>Livraison numérique prévue</span><b class="free">Gratuite</b></div><div class="summary-total"><span>Total indicatif</span><strong>${formatPrice(subtotal)}</strong></div><a class="btn btn-primary btn-block btn-large" href="checkout.html">Voir le checkout en préversion</a><a class="continue-link" href="catalogue.html">← Continuer mes achats</a><p>♢ Aucun paiement réel n’est actuellement accepté</p></aside>` : `<div class="empty-state standalone"><span>▱</span><h2>Votre panier est vide</h2><p>Explorez nos produits et ajoutez les ressources qui feront avancer votre projet.</p><a class="btn btn-primary" href="catalogue.html">Explorer le catalogue</a></div>`}</div></section>`;
  }

  function renderWishlist() {
    const items = getWishlist().map(findProduct).filter(Boolean);
    $('#pageContent').innerHTML = `
      ${breadcrumb([{ label: 'Wishlist' }])}
      <section class="page-hero compact-hero"><div class="shell"><span class="eyebrow">À garder</span><h1>Ma wishlist</h1><p>Retrouvez les produits que vous souhaitez consulter plus tard.</p></div></section>
      <section class="section"><div class="shell">${items.length ? `<div class="product-grid product-grid-four">${items.map((product) => productCard(product)).join('')}</div>` : `<div class="empty-state standalone"><span>♡</span><h2>Votre wishlist est vide</h2><p>Cliquez sur le cœur d’un produit pour l’ajouter ici.</p><a class="btn btn-primary" href="catalogue.html">Découvrir les produits</a></div>`}</div></section>`;
  }

  function accountSidebar(active) {
    return `<aside class="account-sidebar"><div class="account-profile"><span>AB</span><div><b>Espace client</b><small>Connexion en préparation</small></div></div><nav><a class="${active === 'account' ? 'is-active' : ''}" href="account.html">Tableau de bord</a><a class="${active === 'orders' ? 'is-active' : ''}" href="orders.html">Mes commandes & historique</a><a class="${active === 'downloads' ? 'is-active' : ''}" href="downloads.html">Téléchargements</a><a class="${active === 'licenses' ? 'is-active' : ''}" href="licenses.html">Mes licences</a><a class="${active === 'invoices' ? 'is-active' : ''}" href="invoices.html">Mes factures</a><a href="wishlist.html">Wishlist</a><a href="account.html#profile">Profil</a><a href="account.html#notifications">Notifications</a><a href="support.html">Aide</a></nav></aside>`;
  }

  function authGate(title, text) {
    return `<div class="auth-gate"><span class="auth-symbol">✦</span><h2>${title}</h2><p>${text}</p><form class="signin-form" data-auth-form><label>Adresse email<input type="email" required placeholder="vous@entreprise.com"></label><button class="btn btn-primary btn-block" type="submit">Continuer avec mon email</button></form><div class="or-line"><span>ou</span></div><button class="btn btn-ghost btn-block" type="button" data-provider-login>Continuer avec Google</button><small>En continuant, vous acceptez nos <a href="terms.html">conditions d’utilisation</a>.</small></div>`;
  }

  function renderAccount() {
    $('#pageContent').innerHTML = `${breadcrumb([{ label: 'Mon compte' }])}<section class="account-section"><div class="shell account-layout">${accountSidebar('account')}<main class="account-content"><div class="account-heading"><span class="eyebrow">Espace personnel</span><h1>Bienvenue sur votre compte WebNova.</h1><p>Centralisez vos achats, fichiers, licences et formations en un seul endroit.</p></div>${authGate('Connectez-vous à votre espace', 'Utilisez l’adresse email employée lors de votre achat pour retrouver automatiquement vos produits.')}<div class="account-benefits"><article><span>↓</span><h3>Téléchargements centralisés</h3><p>Accédez à vos fichiers et à leurs mises à jour.</p></article><article><span>▤</span><h3>Commandes et historique</h3><p>Retrouvez les achats et leur statut réel.</p></article><article><span>◇</span><h3>Licences disponibles</h3><p>Consultez les droits associés à chaque produit.</p></article><article id="profile"><span>AB</span><h3>Profil</h3><p>Coordonnées et préférences après activation de l’authentification.</p></article><article id="notifications"><span>◎</span><h3>Notifications</h3><p>Mises à jour et disponibilité des téléchargements, avec consentement.</p></article><article><span>EDU</span><h3>Progression Academy</h3><p>Parcours, quiz et certificats après validation des cours.</p></article></div></main></div></section>`;
  }

  function renderOrders() {
    $('#pageContent').innerHTML = `${breadcrumb([{ label: 'Mon compte', href: 'account.html' }, { label: 'Mes commandes' }])}<section class="account-section"><div class="shell account-layout">${accountSidebar('orders')}<main class="account-content"><div class="account-heading"><span class="eyebrow">Historique</span><h1>Mes commandes</h1><p>Consultez vos reçus, factures et licences.</p></div>${authGate('Connectez-vous pour voir vos commandes', 'Vos commandes sont rattachées à l’adresse email utilisée lors du paiement.')}</main></div></section>`;
  }

  function renderDownloads() {
    $('#pageContent').innerHTML = `${breadcrumb([{ label: 'Mon compte', href: 'account.html' }, { label: 'Téléchargements' }])}<section class="account-section"><div class="shell account-layout">${accountSidebar('downloads')}<main class="account-content"><div class="account-heading"><span class="eyebrow">Bibliothèque</span><h1>Mes téléchargements</h1><p>Vos fichiers, mises à jour et accès Academy sont regroupés ici.</p></div>${authGate('Connectez-vous pour accéder à vos fichiers', 'Après validation du paiement, vos produits numériques apparaîtront automatiquement dans cette bibliothèque.')}</main></div></section>`;
  }

  function renderLicenses() {
    $('#pageContent').innerHTML = `${breadcrumb([{ label: 'Mon compte', href: 'account.html' }, { label: 'Mes licences' }])}<section class="account-section"><div class="shell account-layout">${accountSidebar('licenses')}<main class="account-content"><div class="account-heading"><span class="eyebrow">Droits d’utilisation</span><h1>Mes licences</h1><p>Consultez le produit, le type de licence, le projet autorisé et la version du document applicable.</p></div>${authGate('Les licences seront disponibles après l’ouverture', 'La connexion et la synchronisation des commandes ne sont pas encore actives. Après un achat réel, chaque licence sera rattachée au compte du client.') }<div class="account-benefits"><article><span>◇</span><h3>Licence par produit</h3><p>Une licence distincte sera liée à chaque produit et à chaque commande.</p></article><article><span>1×</span><h3>Projet autorisé</h3><p>Le nombre de projets et les droits commerciaux seront clairement indiqués.</p></article><article><span>↻</span><h3>Version traçable</h3><p>La version de la licence applicable au moment de l’achat restera accessible.</p></article></div></main></div></section>`;
  }

  function renderInvoices() {
    $('#pageContent').innerHTML = `${breadcrumb([{ label: 'Mon compte', href: 'account.html' }, { label: 'Mes factures' }])}<section class="account-section"><div class="shell account-layout">${accountSidebar('invoices')}<main class="account-content"><div class="account-heading"><span class="eyebrow">Documents de paiement</span><h1>Mes factures</h1><p>Retrouvez les reçus et documents transactionnels associés aux commandes validées.</p></div>${authGate('Les factures seront disponibles après l’ouverture', 'Aucun document réel n’est généré dans cette préversion. Après activation, les documents fournis par le Merchant of Record seront associés à la commande correspondante.')}<div class="account-benefits"><article><span>PDF</span><h3>Documents téléchargeables</h3><p>Chaque reçu ou facture disponible pourra être téléchargé au format PDF.</p></article><article><span>▤</span><h3>Liés aux commandes</h3><p>Le numéro de commande, la date, la devise et le statut seront regroupés.</p></article><article><span>♢</span><h3>Données sécurisées</h3><p>Aucune donnée bancaire complète ne sera stockée par WebNova.</p></article></div></main></div></section>`;
  }

  function renderCheckout() {
    const direct = findProduct(params.get('buy'));
    const cart = direct ? { [direct.id]: 1 } : getCart();
    const entries = Object.entries(cart).map(([id, quantity]) => ({ product: findProduct(id), quantity })).filter((item) => item.product);
    const subtotal = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    $('#pageContent').innerHTML = `
      <section class="checkout-page"><div class="shell checkout-brand"><a class="brand" href="index.html">${logo()}</a><span>♢ Préversion sans paiement réel</span></div><div class="shell checkout-layout">
        <main class="checkout-form"><a class="back-link" href="${direct ? `product.html?id=${direct.id}` : 'panier.html'}">← Retour</a><span class="eyebrow">Checkout FastSpring-ready</span><h1>Le paiement n’est pas encore activé.</h1><div class="checkout-activation"><span>✦</span><h2>Architecture préparée, activation contrôlée</h2><p>Cette préversion présente le parcours d’achat, mais WebNova n’accepte aucun paiement tant que la boutique, les produits et leur livraison automatique n’ont pas été validés.</p><ul><li>Catalogue local prêt à recevoir les identifiants produits FastSpring</li><li>Prix localisés et taxes à laisser au Merchant of Record</li><li>Visa, Mastercard, Google Pay et Apple Pay selon l’éligibilité du checkout</li><li>Webhooks serveur et liens de téléchargement à tester avant ouverture</li></ul><div class="payment-readiness payment-readiness-large"><span>FastSpring</span><span>VISA</span><span>Mastercard</span><span>Google Pay</span><span>Apple Pay</span></div><button class="btn btn-primary btn-block btn-large" type="button" disabled>Checkout bientôt disponible</button><p class="checkout-note">Aucune donnée bancaire n’est collectée sur cette page.</p></div></main>
        <aside class="checkout-summary"><h2>Récapitulatif de précommande</h2>${entries.length ? entries.map(({ product, quantity }) => `<div class="checkout-item">${productVisual(product, 'visual-checkout')}<div><b>${product.title}</b><span>${product.collection} · Qté ${quantity}</span></div><strong>${formatPrice(product.price * quantity)}</strong></div>`).join('') : '<p>Aucun produit dans votre panier.</p>'}<div class="checkout-totals"><p><span>Sous-total indicatif</span><b>${formatPrice(subtotal)}</b></p><p><span>Livraison numérique prévue</span><b>Gratuite</b></p><p><span>Total indicatif</span><strong>${formatPrice(subtotal)}</strong></p></div><div class="delivery-box"><span>⚡</span><div><b>Livraison automatique prévue</b><p>Après activation, un lien sécurisé sera envoyé uniquement après confirmation serveur du paiement.</p></div></div></aside>
      </div></section>`;
  }

  const faqItems = [
    ['Comment vais-je recevoir mon achat ?', 'Après l’ouverture commerciale et la confirmation serveur du paiement, un email contenant le reçu et un lien sécurisé sera envoyé automatiquement. Le produit apparaîtra également dans la page Téléchargements du compte.'],
    ['Combien de temps ai-je accès aux fichiers ?', 'L’accès reste disponible dans votre compte aussi longtemps que le produit est commercialisé. Nous recommandons néanmoins de conserver une sauvegarde personnelle de vos fichiers.'],
    ['Puis-je utiliser un template pour un client ?', 'Oui, si la licence commerciale du produit l’autorise. Une licence standard couvre un projet final. Une nouvelle licence est nécessaire pour chaque projet ou client supplémentaire.'],
    ['Puis-je revendre ou partager les fichiers sources ?', 'Non. La redistribution, le partage public, la revente ou l’inclusion des fichiers sources dans un autre produit téléchargeable sont interdits.'],
    ['Les produits reçoivent-ils des mises à jour ?', 'La durée des mises à jour est indiquée sur chaque fiche produit. Lorsqu’une mise à jour est disponible, elle apparaît dans votre espace Téléchargements.'],
    ['Quels moyens de paiement seront acceptés ?', 'Après activation, le checkout FastSpring affichera les moyens disponibles selon le pays, la devise et les règles du prestataire. WebNova ne collecte pas les numéros complets de carte sur son propre site.'],
    ['Puis-je demander un remboursement ?', 'En raison de la nature numérique des produits, les achats téléchargés ne sont généralement pas remboursables. Une exception peut être étudiée en cas de fichier défectueux ou non conforme. Consultez la politique complète.'],
    ['Puis-je voir une démonstration avant l’achat ?', 'Chaque fiche produit contient une galerie, un aperçu et, lorsqu’elle est disponible, une démonstration. Vous pouvez contacter le support pour toute question spécifique.'],
    ['Les formations délivreront-elles un certificat ?', 'Un certificat WebNova est prévu pour les parcours indiqués comme certifiants. Il ne sera activé qu’après validation des contenus, des modules et du projet final.'],
    ['Comment contacter le support ?', 'Le support est disponible par email à hello@webnova.company et via WhatsApp au +230 5857 4757. Le délai de réponse habituel est d’un jour ouvré.'],
    ['Puis-je télécharger mes produits plusieurs fois ?', 'Oui, depuis votre compte et dans le respect d’un usage raisonnable. Des contrôles de sécurité peuvent être appliqués pour protéger les créateurs.'],
    ['Les prix incluent-ils les taxes ?', 'Les prix sont affichés en roupies mauriciennes. Les taxes applicables selon votre pays seront précisées avant le paiement.']
  ];

  function renderFAQ() {
    $('#pageContent').innerHTML = `
      ${breadcrumb([{ label: 'FAQ' }])}
      <section class="page-hero"><div class="shell"><span class="eyebrow">Centre d’aide</span><h1>Comment pouvons-nous vous aider ?</h1><p>Les réponses essentielles concernant les produits, paiements, téléchargements et licences.</p><form class="faq-search"><span>⌕</span><input id="faqSearch" type="search" placeholder="Rechercher dans les questions…" aria-label="Rechercher une question"></form></div></section>
      <section class="section"><div class="shell faq-layout"><aside><h2>Besoin d’aide ?</h2><p>Notre équipe répond à vos questions avant et après l’achat.</p><a class="btn btn-primary btn-block" href="https://wa.me/23058574757" target="_blank" rel="noopener">Écrire sur WhatsApp</a><a href="mailto:hello@webnova.company">hello@webnova.company</a></aside><div class="faq-list" id="faqList">${faqItems.map(([question, answer], index) => `<article data-faq-text="${question.toLowerCase()} ${answer.toLowerCase()}"><button type="button" aria-expanded="${index === 0 ? 'true' : 'false'}"><span>${question}</span><i>+</i></button><div class="faq-answer" ${index === 0 ? '' : 'hidden'}><p>${answer}</p></div></article>`).join('')}</div></div></section>`;
    setupFAQ();
  }

  function setupFAQ() {
    $$('.faq-list article button').forEach((button) => button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      answer.hidden = expanded;
    }));
    $('#faqSearch').addEventListener('input', (event) => {
      const term = event.target.value.toLowerCase().trim();
      $$('#faqList article').forEach((item) => item.hidden = term && !item.dataset.faqText.includes(term));
    });
  }

  const blogPosts = [
    ['SEO','SEO technique : la checklist avant publication','Les contrôles essentiels pour lancer une page rapide, indexable et structurée.','SEO'],
    ['Google Business','Optimiser une fiche Google Business sans promesses irréalistes','Une méthode claire pour améliorer les informations, les contenus et le suivi local.','GBP'],
    ['ChatGPT','Construire une bibliothèque de prompts réutilisable','Comment transformer des demandes isolées en système de travail cohérent.','GPT'],
    ['IA','Choisir entre assistant, workflow et agent IA','Les critères pratiques pour sélectionner le bon niveau d’automatisation.','AI'],
    ['n8n','Automatiser un lead de la capture au suivi','Architecture type, contrôles et points de vigilance avant la mise en production.','n8n'],
    ['Marketing','Concevoir une offre numérique qui inspire confiance','Positionnement, preuve, licence, support et parcours d’achat.','MKT'],
    ['Business','Vendre à l’international depuis Maurice','Devises, taxes, support et Merchant of Record : les décisions à préparer.','BIZ'],
    ['Templates','Évaluer un template avant de le personnaliser','Performance, accessibilité, SEO, compatibilité et maintenabilité.','WEB']
  ];

  function renderBlog() {
    document.title = 'Blog — WebNova Marketplace';
    $('#pageContent').innerHTML = `
      ${breadcrumb([{ label: 'Blog' }])}
      <section class="page-hero blog-hero"><div class="shell"><span class="eyebrow">WebNova Insights</span><h1>Apprendre avant d’acheter.</h1><p>Guides pratiques sur le SEO, l’IA, l’automatisation, le marketing et les produits numériques. Les articles sont clairement marqués comme étant en préparation.</p></div></section>
      <section class="section"><div class="shell"><div class="blog-filters" role="group" aria-label="Filtrer les articles"><button class="is-active" type="button" data-blog-filter="">Tous</button>${blogPosts.map(([category]) => category).map((value, index, list) => list.indexOf(value) === index ? `<button type="button" data-blog-filter="${value}">${value}</button>` : '').join('')}</div><div class="blog-grid" id="blogGrid">${blogPosts.map(([category,title,excerpt,icon], index) => `<article data-blog-category="${category}"><div class="blog-cover"><span>${icon}</span><small>GUIDE WEBNOVA · ${String(index + 1).padStart(2, '0')}</small></div><div><span>${category}</span><h2>${title}</h2><p>${excerpt}</p><small>Article en préparation · aucune date de publication simulée</small><a href="support.html">Suggérer une question →</a></div></article>`).join('')}</div></div></section>`;
    setupBlogFilters();
  }

  function setupBlogFilters() {
    $$('[data-blog-filter]').forEach((button) => button.addEventListener('click', () => {
      $$('[data-blog-filter]').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      $$('#blogGrid article').forEach((article) => article.hidden = Boolean(button.dataset.blogFilter) && article.dataset.blogCategory !== button.dataset.blogFilter);
    }));
  }

  function renderSupport() {
    document.title = 'Centre d’aide — WebNova Marketplace';
    $('#pageContent').innerHTML = `
      ${breadcrumb([{ label: 'Centre d’aide' }])}
      <section class="page-hero"><div class="shell"><span class="eyebrow">Support WebNova</span><h1>Une réponse claire, par le bon canal.</h1><p>Le support automatisé n’est pas simulé. Vous contactez directement l’équipe ou consultez une ressource existante.</p></div></section>
      <section class="section"><div class="shell support-channel-grid"><a href="https://wa.me/23058574757" target="_blank" rel="noopener"><span>WA</span><h2>WhatsApp</h2><p>Questions avant achat, compatibilité et orientation produit.</p><b>Écrire à WebNova →</b></a><a href="mailto:hello@webnova.company"><span>@</span><h2>Email</h2><p>Demandes détaillées, documents et suivi écrit.</p><b>hello@webnova.company →</b></a><a href="faq.html"><span>?</span><h2>FAQ</h2><p>Paiement, livraison, licence, mises à jour et compte.</p><b>Consulter les réponses →</b></a><a href="blog.html"><span>DOC</span><h2>Guides</h2><p>Tutoriels SEO, IA, automatisation et produits numériques.</p><b>Explorer le blog →</b></a></div></section>
      <section class="section section-tinted"><div class="shell support-promise"><div><span class="eyebrow">Transparence</span><h2>Ce qui est disponible aujourd’hui</h2><p>WhatsApp, email et FAQ sont accessibles. Le chat temps réel, le suivi par ticket et la base documentaire complète sont inscrits à la roadmap.</p></div><a class="btn btn-primary" href="roadmap.html">Voir la roadmap</a></div></section>`;
  }

  function renderRoadmap() {
    document.title = 'Roadmap — WebNova Marketplace';
    $('#pageContent').innerHTML = `
      ${breadcrumb([{ label: 'Roadmap' }])}
      <section class="page-hero"><div class="shell"><span class="eyebrow">Construction publique</span><h1>Ce qui existe. Ce qui arrive ensuite.</h1><p>Cette roadmap distingue la préversion visible des fonctions qui nécessitent encore un prestataire, un backend ou une validation commerciale.</p></div></section>
      <section class="section"><div class="shell roadmap-grid"><article><span>Disponible</span><h2>Marketplace de préproduction</h2><ul><li>Catalogue et filtres</li><li>Fiches produit détaillées</li><li>Panier et wishlist locaux</li><li>Pages légales et support</li><li>Langues et devises d’affichage</li></ul></article><article><span>En validation</span><h2>Produits et contenus</h2><ul><li>Fichiers finaux</li><li>Documentation produit</li><li>Vidéos Academy et quiz</li><li>Licences par produit</li><li>Tests de compatibilité</li></ul></article><article id="api"><span>À connecter</span><h2>Commerce et API</h2><ul><li>Merchant of Record</li><li>Checkout FastSpring</li><li>Webhooks de commande</li><li>Livraison sécurisée</li><li>API compte et téléchargements</li></ul></article><article id="community"><span>Après lancement</span><h2>Communauté</h2><ul><li>Blog publié régulièrement</li><li>Discord</li><li>LinkedIn</li><li>YouTube</li><li>Centre d’aide enrichi</li></ul></article></div></section>`;
  }

  const legalPages = {
    refunds: {
      eyebrow: 'Achats numériques', title: 'Politique de remboursement', updated: 'Dernière mise à jour : 13 juillet 2026',
      intro: 'Cette politique explique les conditions applicables aux demandes de remboursement pour les produits numériques vendus par WebNova Studio.',
      sections: [
        ['1. Nature des produits', 'Les produits proposés sont des contenus numériques livrés immédiatement : templates, fichiers design, guides, workflows, prompts et formations. En validant une commande et en demandant l’accès immédiat, le client reconnaît que l’exécution commence avant la fin d’un éventuel délai de rétractation.'],
        ['2. Principe général', 'Une fois le fichier téléchargé, consulté ou rendu accessible, la vente est normalement définitive. Cette règle protège la propriété intellectuelle des créateurs, car un produit numérique ne peut pas être matériellement retourné.'],
        ['3. Situations éligibles', 'Une demande peut être étudiée si le fichier est corrompu, si le produit reçu diffère substantiellement de sa description, si un double paiement est constaté ou si un problème technique empêche définitivement l’accès malgré l’assistance du support.'],
        ['4. Situations non éligibles', 'Un changement d’avis, une incompatibilité clairement indiquée avant l’achat, un manque de compétence pour utiliser le produit, ou le fait de ne plus avoir besoin du produit ne constituent pas automatiquement un motif de remboursement.'],
        ['5. Procédure', 'Contactez hello@webnova.company dans les 14 jours suivant l’achat avec le numéro de commande, l’adresse email utilisée et une description précise du problème. Lorsque FastSpring agit comme Merchant of Record, la demande peut également être traitée selon les conditions et procédures indiquées dans son checkout.'],
        ['6. Décision et délai', 'Chaque demande recevable est examinée équitablement. Lorsqu’un remboursement est accepté, il est effectué sur le moyen de paiement d’origine par le prestataire concerné. Le délai bancaire peut varier selon le prestataire et le pays.']
      ]
    },
    license: {
      eyebrow: 'Droits d’utilisation', title: 'Licence d’utilisation', updated: 'Version 1.0 — 13 juillet 2026',
      intro: 'Cette licence définit ce que vous pouvez et ne pouvez pas faire avec les produits numériques WebNova.',
      sections: [
        ['1. Licence standard', 'Sauf indication contraire sur la fiche produit, l’achat accorde une licence non exclusive, non transférable et mondiale pour créer un seul projet final personnel ou commercial.'],
        ['2. Utilisations autorisées', 'Vous pouvez modifier le produit, l’adapter à votre marque, l’utiliser pour votre propre entreprise ou pour un client unique, et publier le projet final sous forme de site, application, document ou campagne.'],
        ['3. Utilisations interdites', 'Vous ne pouvez pas revendre, partager, sous-licencier, publier ou distribuer les fichiers sources, même modifiés. Vous ne pouvez pas transformer le produit en ressource concurrente, template, kit ou téléchargement destiné à la revente.'],
        ['4. Projets clients', 'Une licence standard peut couvrir un projet final pour un client lorsque la fiche produit l’autorise. Une licence distincte doit être achetée pour chaque client ou projet supplémentaire. Les fichiers sources ne doivent pas être mis à disposition du public.'],
        ['5. Produits IA et prompts', 'Les sorties générées avec des prompts ou agents dépendent également des conditions des fournisseurs d’IA utilisés. WebNova ne garantit pas l’exclusivité d’une sortie générée par un service tiers.'],
        ['6. Formations et contenus', 'Les vidéos, supports, eBooks et guides sont réservés à l’usage de l’acheteur. L’enregistrement, le partage d’accès, la diffusion ou la mise à disposition dans un groupe ou une entreprise sans licence adaptée sont interdits.'],
        ['7. Propriété intellectuelle', 'WebNova et ses créateurs conservent tous les droits de propriété intellectuelle sur les fichiers sources, la documentation, les marques et les contenus. La licence n’est pas une cession de propriété.'],
        ['8. Fin de licence', 'La licence prend fin automatiquement en cas de violation. Vous devez alors cesser d’utiliser le produit et supprimer toutes les copies concernées, sans préjudice des autres recours disponibles.']
      ]
    },
    terms: {
      eyebrow: 'Cadre contractuel', title: 'Conditions Générales de Vente', updated: 'En vigueur au 13 juillet 2026',
      intro: 'Les présentes conditions régissent la vente de produits numériques et de formations par WebNova Studio.',
      sections: [
        ['1. Éditeur et activité', 'WebNova Studio prépare une boutique de produits numériques standardisés basée à Maurice. Contact : hello@webnova.company — WhatsApp : +230 5857 4757. Le nom légal, l’adresse et le numéro d’enregistrement complets devront être publiés avant l’ouverture commerciale.'],
        ['2. Produits', 'Les caractéristiques essentielles, formats, compatibilités, prix et conditions de licence sont présentés sur chaque fiche produit. Les visuels sont fournis à titre de présentation et peuvent montrer des exemples de personnalisation.'],
        ['3. Commande', 'Le client vérifie le contenu de son panier, fournit des informations exactes et accepte les conditions présentées avant paiement. Aucune vente n’est actuellement conclue sur la préversion. Après activation, la commande sera confirmée uniquement après autorisation serveur du prestataire.'],
        ['4. Prix et taxes', 'Les prix sont affichés en roupies mauriciennes, sauf indication contraire. Les taxes ou conversions applicables sont précisées lors du paiement. WebNova peut modifier ses prix, sans effet rétroactif sur les commandes confirmées.'],
        ['5. Paiement et Merchant of Record', 'Si la boutique FastSpring est approuvée et activée, FastSpring agira comme Merchant of Record pour la transaction et ses conditions affichées au checkout encadreront le paiement, la fiscalité et les obligations transactionnelles correspondantes. WebNova ne conservera pas les numéros complets de carte bancaire. La licence WebNova continuera d’encadrer les droits d’utilisation des contenus.'],
        ['6. Livraison numérique', 'Après activation commerciale et paiement validé côté serveur, les produits seront mis à disposition par email et dans l’espace client. Le client devra vérifier son adresse email et conserver ses identifiants de manière confidentielle.'],
        ['7. Rétractation et remboursement', 'Lorsque le client demande l’accès immédiat au contenu numérique, il reconnaît que l’exécution commence sans attendre. Les remboursements restent régis par la politique de remboursement et les lois impératives applicables.'],
        ['8. Support', 'La durée et l’étendue du support sont indiquées sur chaque fiche. Le support couvre l’installation et l’utilisation normale, mais pas le développement sur mesure ou les outils tiers non mentionnés.'],
        ['9. Responsabilité', 'Les produits sont fournis avec soin mais sans garantie de résultat commercial. La responsabilité de WebNova est limitée, dans les limites légales, au montant payé pour le produit concerné.'],
        ['10. Droit applicable', 'Les présentes conditions sont régies par le droit mauricien, sous réserve des dispositions impératives protégeant les consommateurs dans leur pays de résidence. Les parties privilégient une résolution amiable avant toute procédure.']
      ]
    },
    privacy: {
      eyebrow: 'Protection des données', title: 'Politique de confidentialité', updated: 'Dernière mise à jour : 13 juillet 2026',
      intro: 'WebNova respecte votre vie privée et limite la collecte aux données nécessaires au fonctionnement de la plateforme.',
      sections: [
        ['1. Données collectées', 'Nous pouvons collecter votre nom, adresse email, pays, informations de commande, historique de téléchargement, préférences, demandes au support et données techniques de navigation. Les données bancaires complètes sont traitées par le prestataire de paiement.'],
        ['2. Finalités', 'Les données servent à traiter les commandes, livrer les fichiers, gérer le compte, fournir le support, prévenir la fraude, respecter les obligations légales et, avec votre accord, envoyer des informations commerciales.'],
        ['3. Bases légales', 'Le traitement repose selon le cas sur l’exécution du contrat, le respect d’une obligation légale, l’intérêt légitime de sécuriser et améliorer le service, ou votre consentement.'],
        ['4. Prestataires', 'Certaines données peuvent être transmises aux prestataires indispensables : hébergement, paiement, email transactionnel, stockage, analytics et support. Chaque prestataire ne reçoit que les informations nécessaires à sa mission.'],
        ['5. Conservation', 'Les données de commande sont conservées pendant la durée requise par les obligations comptables et fiscales. Les comptes inactifs et données marketing sont supprimés ou anonymisés selon des durées proportionnées.'],
        ['6. Cookies', 'La plateforme peut utiliser des cookies nécessaires à la session, au panier et à la sécurité. Les cookies de mesure ou marketing ne doivent être activés qu’après le recueil du consentement lorsque la loi l’exige.'],
        ['7. Vos droits', 'Selon votre situation, vous pouvez demander l’accès, la correction, la suppression, la limitation, l’opposition ou la portabilité de vos données. Écrivez à hello@webnova.company pour exercer vos droits.'],
        ['8. Sécurité', 'WebNova applique des mesures techniques et organisationnelles raisonnables : chiffrement des connexions, contrôle des accès, limitation des données et surveillance des opérations sensibles.'],
        ['9. Transferts internationaux', 'Certains prestataires peuvent traiter des données hors de Maurice. WebNova sélectionne des fournisseurs offrant des garanties contractuelles et techniques adaptées.'],
        ['10. Contact', 'Pour toute question relative à la confidentialité, contactez hello@webnova.company. Les informations relatives au responsable légal et à l’autorité compétente seront complétées avant l’ouverture commerciale.']
      ]
    }
  };

  function renderLegal(kind) {
    const legal = legalPages[kind];
    $('#pageContent').innerHTML = `
      ${breadcrumb([{ label: legal.title }])}
      <section class="legal-hero"><div class="shell"><span class="eyebrow">${legal.eyebrow}</span><h1>${legal.title}</h1><p>${legal.intro}</p><small>${legal.updated}</small></div></section>
      <section class="legal-section"><div class="shell legal-layout"><aside><h2>Sommaire</h2><nav>${legal.sections.map(([title], index) => `<a href="#section-${index + 1}">${title}</a>`).join('')}</nav><div><b>Une question ?</b><p>Contactez notre équipe avant votre achat.</p><a href="mailto:hello@webnova.company">hello@webnova.company</a></div></aside><article>${legal.sections.map(([title, body], index) => `<section id="section-${index + 1}"><h2>${title}</h2><p>${body}</p></section>`).join('')}<div class="legal-contact"><span>✦</span><div><h2>Besoin d’une précision ?</h2><p>Notre équipe peut vous aider à comprendre les conditions applicables à votre achat.</p><a class="btn btn-primary" href="mailto:hello@webnova.company">Contacter WebNova</a></div></div></article></div></section>`;
  }

  function renderPage() {
    const routes = {
      home: renderHome, catalogue: renderCatalogue, categories: renderCategories,
      bundles: renderBundles, academy: renderAcademy, product: renderProduct,
      cart: renderCart, wishlist: renderWishlist, account: renderAccount,
      orders: renderOrders, downloads: renderDownloads, licenses: renderLicenses,
      invoices: renderInvoices, checkout: renderCheckout,
      blog: renderBlog, support: renderSupport, roadmap: renderRoadmap,
      faq: renderFAQ, refunds: () => renderLegal('refunds'), license: () => renderLegal('license'),
      terms: () => renderLegal('terms'), privacy: () => renderLegal('privacy')
    };
    (routes[page] || renderHome)();
  }

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function updateCounts() {
    $$('[data-cart-count]').forEach((item) => item.textContent = cartCount());
    $$('[data-wishlist-count]').forEach((item) => item.textContent = getWishlist().length);
  }

  function addToCart(id) {
    const cart = getCart();
    cart[id] = Math.min((cart[id] || 0) + 1, 5);
    writeStore('webnova-cart', cart);
    updateCounts();
    showToast(`${findProduct(id).title} ajouté au panier`);
  }

  function toggleWishlist(id) {
    const wishlist = getWishlist();
    const exists = wishlist.includes(id);
    writeStore('webnova-wishlist', exists ? wishlist.filter((item) => item !== id) : [...wishlist, id]);
    updateCounts();
    $$(`.js-wishlist[data-id="${id}"]`).forEach((button) => {
      button.classList.toggle('is-active', !exists);
      if (button.classList.contains('wishlist-button')) button.textContent = exists ? '♡' : '♥';
      else button.textContent = exists ? '♡ Ajouter à la wishlist' : '♥ Retirer de la wishlist';
    });
    showToast(exists ? 'Retiré de la wishlist' : 'Ajouté à la wishlist');
    if (page === 'wishlist') setTimeout(renderWishlist, 180);
  }

  function setupGlobalInteractions() {
    document.addEventListener('click', (event) => {
      const addButton = event.target.closest('.js-add-cart');
      const buyButton = event.target.closest('.js-buy-now');
      const wishlistButton = event.target.closest('.js-wishlist');
      const removeButton = event.target.closest('.js-remove-cart');
      if (addButton) addToCart(addButton.dataset.id);
      if (buyButton) window.location.href = `checkout.html?buy=${buyButton.dataset.id}`;
      if (wishlistButton) toggleWishlist(wishlistButton.dataset.id);
      if (removeButton) {
        const cart = getCart(); delete cart[removeButton.dataset.id]; writeStore('webnova-cart', cart); renderCart(); updateCounts(); showToast('Produit supprimé du panier');
      }
      if (event.target.closest('[data-clear-cart]')) {
        writeStore('webnova-cart', {}); renderCart(); updateCounts();
      }
      if (event.target.closest('[data-open-search]')) openSearch();
      if (event.target.closest('[data-close-search]')) closeSearch();
      if (event.target.closest('[data-toggle-support]')) {
        const panel = $('#supportPanel');
        const isOpen = !panel.hidden;
        panel.hidden = isOpen;
        $$('[data-toggle-support]').forEach((button) => button.setAttribute('aria-expanded', String(!isOpen)));
      }
    });

    document.addEventListener('change', (event) => {
      if (event.target.matches('#languageSelect, .js-language-select')) {
        writeStore('webnova-language', event.target.value);
        window.location.reload();
        return;
      }
      if (event.target.matches('#currencySelect, .js-currency-select')) {
        writeStore('webnova-currency', event.target.value);
        window.location.reload();
        return;
      }
      if (event.target.matches('.js-quantity')) {
        const cart = getCart(); cart[event.target.dataset.id] = Number(event.target.value); writeStore('webnova-cart', cart); renderCart(); updateCounts();
      }
      if (event.target.matches('.payment-options input')) {
        $$('.payment-options label').forEach((label) => label.classList.toggle('is-selected', label.contains(event.target)));
      }
    });

    $('.mobile-toggle')?.addEventListener('click', (event) => {
      const button = event.currentTarget;
      const open = $('.mobile-nav').classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });

    $$('.newsletter-form, [data-demo-form]').forEach((form) => form.addEventListener('submit', (event) => {
      event.preventDefault(); form.reset(); showToast('Merci ! Votre inscription a bien été enregistrée.');
    }));

    $$('[data-auth-form]').forEach((form) => form.addEventListener('submit', (event) => {
      event.preventDefault(); showToast('La connexion sécurisée sera activée avec le prestataire d’authentification.');
    }));
    $$('[data-provider-login]').forEach((button) => button.addEventListener('click', () => showToast('Connexion Google à activer avant la mise en production.')));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeSearch();
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
    });
  }

  function openSearch() {
    const overlay = $('#searchOverlay');
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(() => $('#globalSearchInput').focus(), 50);
  }

  function closeSearch() {
    const overlay = $('#searchOverlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  function setupGlobalSearch() {
    const input = $('#globalSearchInput');
    if (!input) return;
    function showResults(term) {
      const normalized = term.trim();
      const matches = normalized ? searchProducts(normalized, 8) : products.filter((product) => product.isBestSeller).slice(0, 4);
      $('#globalSearchResults').innerHTML = `<div class="search-result-head"><b>${normalized ? `Recherche assistée · ${matches.length} résultat${matches.length > 1 ? 's' : ''}` : 'Sélection WebNova'}</b>${normalized ? `<a href="catalogue.html?search=${encodeURIComponent(term)}">Voir dans le catalogue →</a>` : ''}</div>${matches.length ? matches.map((product) => `<a class="search-result-item" href="product.html?id=${product.id}">${productVisual(product, 'visual-search')}<span><small>${product.collection}</small><b>${product.title}</b><i>${product.tagline}</i></span><strong>${formatPrice(product.price)}</strong></a>`).join('') : '<div class="search-empty"><b>Aucune correspondance directe.</b><p>Essayez un besoin comme « template restaurant », « automatiser mes leads » ou « améliorer mon SEO ».</p></div>'}`;
    }
    input.addEventListener('input', () => showResults(input.value));
    $$('.quick-searches button').forEach((button) => button.addEventListener('click', () => { input.value = button.dataset.searchTerm; showResults(input.value); }));
    showResults('');
  }

  renderHeader();
  renderFooter();
  renderPage();
  updateCounts();
  setupGlobalInteractions();
  setupGlobalSearch();
})();
