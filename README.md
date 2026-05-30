# WebNova Studio

> **Digital · Innovation · Mauritius**
> Création de sites web professionnels à Maurice — Sites vitrine, e-commerce, WhatsApp Business intégré.

🌐 **Live:** [webnova.mu](https://webnova.mu)
💬 **WhatsApp:** [+230 5857 4757](https://wa.me/23058574757)
📧 **Email:** hello@webnova.company

---

## ✨ Features

- 🌍 **Bilingue** — FR / EN avec switcher dynamique
- 📱 **100% Responsive** — Mobile, tablette, desktop
- ⚡ **Performance** — HTML/CSS/JS pur (zéro framework)
- 🎨 **Design moderne** — Gradient, glassmorphism, animations subtiles
- 🔍 **SEO optimisé** — Meta tags, Open Graph, Schema.org (LocalBusiness + FAQPage), sitemap.xml
- 💬 **WhatsApp intégré** — Bouton flottant pulsant + CTAs partout + formulaire lead → WhatsApp
- 🎯 **Conversion-optimized** — Promo banner, FAQ, témoignages, lead form
- 📊 **Analytics complet** — GA4, Meta Pixel, TikTok Pixel, Microsoft Clarity (heatmaps)
- ♿ **Accessible** — Focus visible, prefers-reduced-motion

## 📁 Structure

```
webnova-studio/
├── index.html              # Page principale
├── styles/main.css         # Styles complets
├── scripts/main.js         # JS + traductions FR/EN
├── assets/
│   ├── favicon.svg         # Favicon
│   └── logo.png            # Logo (à ajouter manuellement)
├── .github/workflows/
│   └── pages.yml           # Auto-deploy GitHub Pages
├── CNAME                   # Domaine custom (webnova.mu)
├── robots.txt              # SEO
├── sitemap.xml             # SEO
└── README.md
```

---

## 🚀 Déploiement (GitHub Pages — gratuit)

Le site se déploie **automatiquement** à chaque `git push` sur `main` grâce à GitHub Actions.

### Activation initiale (à faire UNE seule fois)

1. Aller sur https://github.com/arnold-benzaie/webnova-studio/settings/pages
2. **Source** : sélectionner **"GitHub Actions"**
3. Le déploiement se lance automatiquement
4. Site disponible sur : https://arnold-benzaie.github.io/webnova-studio/

### Domaine custom `webnova.mu`

1. **Acheter le domaine** chez [NIC.mu](https://nic.mu) (~Rs 2,000/an pour `.mu`)
2. **Configurer les DNS** chez votre registrar :
   ```
   Type    Name    Value
   A       @       185.199.108.153
   A       @       185.199.109.153
   A       @       185.199.110.153
   A       @       185.199.111.153
   CNAME   www     arnold-benzaie.github.io
   ```
3. Le fichier `CNAME` est déjà dans le repo
4. GitHub Pages détectera le domaine automatiquement
5. Activer **"Enforce HTTPS"** dans les settings Pages

---

## 📊 Configuration des Analytics & Pixels

Tous les scripts de tracking sont dans `index.html` (head). **Remplacez les IDs placeholder** par les vrais :

### 1️⃣ Google Analytics 4
- Créez un compte : https://analytics.google.com
- Récupérez votre **Measurement ID** (format `G-XXXXXXXXXX`)
- Dans `index.html`, remplacez les **2 occurrences** de `G-XXXXXXXXXX`

### 2️⃣ Meta Pixel (Facebook + Instagram Ads)
- Allez sur https://business.facebook.com/events_manager
- Créez un Pixel et copiez l'**ID** (16 chiffres)
- Dans `index.html`, remplacez les **2 occurrences** de `0000000000000000`
- ⭐ **Indispensable** pour faire de la pub Facebook efficacement (retargeting, conversions, audiences similaires)

### 3️⃣ TikTok Pixel (TikTok Ads)
- Allez sur https://ads.tiktok.com/
- Créez un Pixel et copiez l'ID (format `XXXXXXXXXXXXXXXXXX`)
- Dans `index.html`, remplacez les **2 occurrences** de `XXXXXXXXXXXXXXXXXX`

### 4️⃣ Microsoft Clarity (heatmaps + recordings — GRATUIT)
- Inscrivez-vous : https://clarity.microsoft.com
- Créez un projet et copiez l'**ID** (10 caractères)
- Dans `index.html`, remplacez `XXXXXXXXXX` (au-dessus de `</head>`)
- ⭐ **Très utile** : voir comment les visiteurs naviguent réellement

### 5️⃣ Formspree (formulaire lead)
- Inscrivez-vous gratuitement : https://formspree.io
- Créez un formulaire, copiez l'URL (format `https://formspree.io/f/YOUR_FORM_ID`)
- Dans `index.html`, remplacez `YOUR_FORM_ID` (chercher `formspree.io/f/`)
- Vous recevrez les leads par email automatiquement

---

## 🎨 Brand

| Couleur | Hex | Usage |
|---------|-----|-------|
| Navy | `#0a1628` | Background |
| Blue | `#3b82f6` | Primary |
| Gold | `#fbbf24` | Accent |
| Green | `#25D366` | WhatsApp |

**Fonts:** Inter (body) + Space Grotesk (headings)

---

## 📈 Stratégie publicitaire recommandée

### Phase 1 — Lancement (Mois 1)
- **Facebook/Instagram Ads** : budget Rs 200-300/jour, cibler Maurice 25-55 ans, intérêts: petite entreprise, restaurant, e-commerce
- **Audience custom** : visiteurs du site (Meta Pixel) → retargeting
- **Lookalike** : à partir des leads (après 50 conversions)

### Phase 2 — Optimisation (Mois 2-3)
- **Google Ads search** : mots-clés "création site web Maurice", "site internet Maurice prix"
- **TikTok Ads** : vidéos courtes "avant/après" de sites créés
- **Témoignages clients réels** : remplacer les placeholders dans `index.html`

### Phase 3 — Échelle (Mois 4+)
- **SEO organique** : blog avec articles ("Combien coûte un site web à Maurice", "Top 10 sites e-commerce Maurice")
- **Partenariats** : agences digitales locales, comptables, freelances
- **Programme de parrainage** : Rs 1,000 de réduction pour les références

---

## 🔧 Développement local

```bash
# Cloner
git clone https://github.com/arnold-benzaie/webnova-studio.git
cd webnova-studio

# Servir localement (Python)
python3 -m http.server 8000

# Ou avec Node.js
npx serve

# Ouvrir
open http://localhost:8000
```

---

## 📞 Contact

- **WhatsApp:** +230 5857 4757
- **Email:** hello@webnova.company
- **Facebook:** [WebNova Studio.mu](https://www.facebook.com/share/1CfikHyApE/?mibextid=wwXIfr)

---

© 2026 WebNova Studio · Conçu avec ❤️ à Maurice
Testing Jira integration TA-7
