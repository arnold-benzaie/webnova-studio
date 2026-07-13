# WebNova Marketplace

Plateforme premium de produits numériques développée pour WebNova Studio.

## Expérience disponible

- page d’accueil marketplace ;
- catalogue de 56 fiches produit avec recherche, filtres, tri et catégories ;
- fiches produit avec galerie, aperçu, caractéristiques, avis et recommandations ;
- Bundles Premium et WebNova Academy ;
- panier et wishlist conservés sur l’appareil ;
- checkout préparé pour un prestataire de paiement ;
- espace client avec commandes, téléchargements, licences et factures préparé pour une authentification sécurisée ;
- FAQ, politique de remboursement, licence, CGV et confidentialité ;
- design responsive conservant l’identité bleu nuit, bleu électrique et or de WebNova.

La boutique est actuellement une préversion : aucun paiement réel n’est accepté
et les avis de démonstration ont été retirés. Les produits doivent disposer de
leurs fichiers finaux avant l’ouverture commerciale.

Une couverture produit originale et une carte de partage WebNova sont stockées
dans `assets/` ; les autres visuels restent des aperçus de préproduction.

## Structure

```text
webnova-studio/
├── index.html
├── catalogue.html
├── product.html
├── categories.html
├── bundles.html
├── academy.html
├── panier.html
├── wishlist.html
├── checkout.html
├── account.html
├── orders.html
├── downloads.html
├── licenses.html
├── invoices.html
├── faq.html
├── refund-policy.html
├── license.html
├── terms.html
├── privacy.html
├── scripts/
│   ├── products.js
│   ├── main.js
│   └── validate.mjs
├── styles/main.css
├── PLATFORM_SETUP.md
├── FASTSPRING_REVIEW.md
├── sitemap.xml
├── robots.txt
└── vercel.json
```

## Développement local

```bash
python3 -m http.server 8000
```

Ouvrir ensuite `http://127.0.0.1:8000/`.

## Validation

```bash
node --check scripts/products.js
node --check scripts/main.js
node scripts/validate.mjs
```

## Activation commerciale

Consulter `PLATFORM_SETUP.md` et `FASTSPRING_REVIEW.md` avant la mise en
production. Le paiement, les
comptes clients, les emails transactionnels et les liens de téléchargement
signés doivent être connectés côté serveur avec des identifiants privés.

## Domaine

Site cible : [webnova.company](https://webnova.company/)

Support : `hello@webnova.company` · WhatsApp `+230 5857 4757`
