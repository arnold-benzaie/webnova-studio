/* WebNova Marketplace — catalogue source of truth.
   Replace demo checkout/download values with provider URLs after the payment
   and secure-delivery provider is selected. */

window.WebNovaData = (() => {
  const products = [
    {
      id: 'restaurant-pro', title: 'Restaurant Pro', category: 'Templates', collection: 'Restaurant',
      type: 'Template', price: 2490, oldPrice: 3490, rating: 4.9, reviews: 48, sales: 326,
      badge: 'Meilleure vente', icon: 'RE', accent: '#f59e0b', format: 'HTML · CSS · JS', fileSize: '18 MB',
      tagline: 'Un site complet pour transformer les visiteurs en réservations.',
      description: 'Un template premium pensé pour les restaurants, cafés et traiteurs. Menu digital, réservation WhatsApp, galerie, avis et référencement local sont déjà structurés pour accélérer votre lancement.',
      features: ['8 pages responsives', 'Menu filtrable', 'Réservation WhatsApp', 'SEO local inclus', 'Design mobile-first', 'Documentation PDF'],
      compatible: 'Tous navigateurs modernes', updates: '12 mois', support: '30 jours', isBestSeller: true, isNew: false
    },
    {
      id: 'ecommerce-aurora', title: 'Aurora Commerce', category: 'Templates', collection: 'E-commerce',
      cover: 'assets/products/aurora-commerce-cover.png',
      type: 'Template', price: 3990, oldPrice: 5490, rating: 4.9, reviews: 37, sales: 214,
      badge: 'Premium', icon: 'EC', accent: '#8b5cf6', format: 'Next.js · Tailwind', fileSize: '34 MB',
      tagline: 'Une boutique élégante, rapide et conçue pour convertir.',
      description: 'Template e-commerce complet avec catalogue, variantes, panier, recherche et tunnel d’achat. Idéal pour lancer rapidement une marque moderne avec une expérience mobile premium.',
      features: ['12 pages e-commerce', 'Panier et wishlist', 'Filtres avancés', 'Pages produit premium', 'SEO technique', 'Figma inclus'],
      compatible: 'Node.js 20+', updates: 'À vie', support: '60 jours', isBestSeller: true, isNew: true
    },
    {
      id: 'landing-saas-convert', title: 'Convert SaaS', category: 'Templates', collection: 'Landing Pages',
      type: 'Template', price: 1490, oldPrice: 1990, rating: 4.8, reviews: 29, sales: 402,
      badge: 'Conversion', icon: 'LP', accent: '#06b6d4', format: 'HTML · Tailwind', fileSize: '9 MB',
      tagline: 'Une landing page optimisée pour transformer le trafic en prospects.',
      description: 'Landing page SaaS prête pour vos campagnes publicitaires, avec sections bénéfices, preuves sociales, prix, FAQ et appels à l’action testés pour la conversion.',
      features: ['Score Lighthouse 95+', 'Sections modulaires', 'Formulaire lead', 'Animations légères', 'Mobile-first', 'Guide de personnalisation'],
      compatible: 'Tous navigateurs modernes', updates: '12 mois', support: '30 jours', isBestSeller: true, isNew: false
    },
    {
      id: 'portfolio-nova', title: 'Nova Portfolio', category: 'Templates', collection: 'Portfolio',
      type: 'Template', price: 1190, oldPrice: 1590, rating: 4.7, reviews: 22, sales: 184,
      badge: 'Créateurs', icon: 'PO', accent: '#ec4899', format: 'HTML · CSS · JS', fileSize: '11 MB',
      tagline: 'Présentez vos meilleurs projets avec une signature visuelle forte.',
      description: 'Portfolio premium pour développeurs, designers, photographes et freelances. Projets filtrables, témoignages, services et formulaire de contact sont prêts à personnaliser.',
      features: ['6 styles de projets', 'Mode sombre', 'CV téléchargeable', 'Animations fluides', 'Formulaire contact', 'Documentation'],
      compatible: 'Tous navigateurs modernes', updates: '12 mois', support: '30 jours', isBestSeller: false, isNew: true
    },
    {
      id: 'hotel-luxe', title: 'Hôtel Luxe', category: 'Templates', collection: 'Hôtel',
      type: 'Template', price: 3290, oldPrice: 4490, rating: 4.8, reviews: 31, sales: 151,
      badge: 'Hospitality', icon: 'HT', accent: '#14b8a6', format: 'HTML · CSS · JS', fileSize: '26 MB',
      tagline: 'Une expérience digitale cinq étoiles pour vos futurs clients.',
      description: 'Template complet pour hôtels, villas et maisons d’hôtes avec chambres, tarifs, services, galerie et demande de réservation intégrée.',
      features: ['Pages chambres', 'Galerie immersive', 'Formulaire réservation', 'Multilingue-ready', 'Google Maps', 'SEO touristique'],
      compatible: 'Tous navigateurs modernes', updates: '12 mois', support: '45 jours', isBestSeller: false, isNew: false
    },
    {
      id: 'immobilier-prime', title: 'Prime Immobilier', category: 'Templates', collection: 'Immobilier',
      type: 'Template', price: 3490, oldPrice: 4790, rating: 4.8, reviews: 26, sales: 139,
      badge: 'Agence', icon: 'IM', accent: '#3b82f6', format: 'React · Tailwind', fileSize: '31 MB',
      tagline: 'Des annonces claires et une recherche pensée pour générer des visites.',
      description: 'Template immobilier avec recherche multicritère, fiches de biens, galerie, carte et prise de rendez-vous. Adapté aux agences et promoteurs.',
      features: ['Recherche multicritère', 'Fiches de biens', 'Galerie photos', 'Carte interactive-ready', 'WhatsApp agent', 'Tableau comparatif'],
      compatible: 'Node.js 20+', updates: '12 mois', support: '45 jours', isBestSeller: true, isNew: false
    },
    {
      id: 'avocat-authority', title: 'Authority Legal', category: 'Templates', collection: 'Avocat',
      type: 'Template', price: 2190, oldPrice: 2890, rating: 4.8, reviews: 18, sales: 96,
      badge: 'Professionnel', icon: 'AV', accent: '#d4a72c', format: 'HTML · CSS · JS', fileSize: '14 MB',
      tagline: 'Une présence digitale crédible pour votre cabinet.',
      description: 'Template sobre et rassurant pour avocats, notaires et consultants. Domaines d’expertise, équipe, publications et prise de rendez-vous inclus.',
      features: ['7 pages complètes', 'Prise de rendez-vous', 'Profils équipe', 'Blog-ready', 'Mentions légales', 'SEO professionnel'],
      compatible: 'Tous navigateurs modernes', updates: '12 mois', support: '30 jours', isBestSeller: false, isNew: false
    },
    {
      id: 'medica-care', title: 'Medica Care', category: 'Templates', collection: 'Médecin',
      type: 'Template', price: 2290, oldPrice: 2990, rating: 4.9, reviews: 21, sales: 112,
      badge: 'Santé', icon: 'MD', accent: '#22c55e', format: 'HTML · CSS · JS', fileSize: '16 MB',
      tagline: 'Une interface rassurante pour faciliter la prise de rendez-vous.',
      description: 'Template pour médecins, cliniques et professionnels de santé, avec spécialités, horaires, équipe et contact rapide.',
      features: ['Pages spécialités', 'Horaires du cabinet', 'Profils praticiens', 'Rendez-vous WhatsApp', 'Accessibilité renforcée', 'FAQ patients'],
      compatible: 'Tous navigateurs modernes', updates: '12 mois', support: '30 jours', isBestSeller: false, isNew: true
    },
    {
      id: 'beauty-glow', title: 'Glow Beauty', category: 'Templates', collection: 'Beauté',
      type: 'Template', price: 1890, oldPrice: 2490, rating: 4.7, reviews: 25, sales: 173,
      badge: 'Tendance', icon: 'BT', accent: '#f472b6', format: 'Shopify-ready UI', fileSize: '22 MB',
      tagline: 'Un univers premium pour salons, spas et marques beauté.',
      description: 'Template élégant avec services, tarifs, avant/après, réservation et boutique de produits. Conçu pour Instagram et mobile.',
      features: ['Catalogue services', 'Avant / après', 'Réservation en ligne-ready', 'Galerie Instagram', 'Cartes cadeaux', 'Mobile premium'],
      compatible: 'HTML / Shopify adaptation', updates: '12 mois', support: '30 jours', isBestSeller: true, isNew: false
    },
    {
      id: 'ui-kit-orbit', title: 'Orbit UI Kit', category: 'Design', collection: 'Kits UI/UX',
      type: 'Kit UI/UX', price: 2890, oldPrice: 3990, rating: 4.9, reviews: 42, sales: 288,
      badge: 'Figma', icon: 'UI', accent: '#a855f7', format: 'Figma', fileSize: '68 MB',
      tagline: 'Construisez des interfaces cohérentes deux fois plus vite.',
      description: 'Système UI complet avec composants, variables, variantes et écrans prêts pour SaaS, dashboards et applications mobiles.',
      features: ['420+ composants', 'Variables Figma', 'Light & Dark', 'Auto-layout', '36 écrans', 'Design tokens'],
      compatible: 'Figma', updates: 'À vie', support: '60 jours', isBestSeller: true, isNew: true
    },
    {
      id: 'icons-nova', title: 'Nova Icons 1200', category: 'Design', collection: 'Icônes Premium',
      type: 'Pack design', price: 990, oldPrice: 1490, rating: 4.8, reviews: 35, sales: 467,
      badge: '1200 icônes', icon: 'IC', accent: '#60a5fa', format: 'SVG · PNG · Figma', fileSize: '44 MB',
      tagline: 'Une bibliothèque cohérente pour tous vos produits numériques.',
      description: 'Pack de 1 200 icônes premium en trois styles, optimisées pour le web, les applications et les présentations.',
      features: ['1 200 icônes', '3 styles', 'SVG et PNG', 'Composants Figma', 'Licence commerciale', 'Mises à jour incluses'],
      compatible: 'Figma · Web · Mobile', updates: 'À vie', support: '30 jours', isBestSeller: true, isNew: false
    },
    {
      id: 'seo-launch-pack', title: 'SEO Launch Pack', category: 'Marketing & SEO', collection: 'Packs SEO',
      type: 'Pack marketing', price: 1790, oldPrice: 2490, rating: 4.8, reviews: 30, sales: 244,
      badge: 'SEO', icon: 'SE', accent: '#10b981', format: 'PDF · Sheets · Notion', fileSize: '12 MB',
      tagline: 'La méthode complète pour lancer un site visible sur Google.',
      description: 'Audit, recherche de mots-clés, modèles de contenus, checklist technique et tableau de suivi réunis dans un pack opérationnel.',
      features: ['Audit SEO 80 points', 'Keyword planner', 'Briefs de contenu', 'Checklist technique', 'Tableau KPI', 'Tutoriels vidéo'],
      compatible: 'Google Sheets · Notion', updates: '12 mois', support: '30 jours', isBestSeller: true, isNew: false
    },
    {
      id: 'google-business-booster', title: 'Google Business Booster', category: 'Marketing & SEO', collection: 'Google Business Profile',
      type: 'Pack marketing', price: 1490, oldPrice: 1990, rating: 4.9, reviews: 44, sales: 381,
      badge: 'Local SEO', icon: 'GB', accent: '#4285f4', format: 'PDF · Canva · Sheets', fileSize: '29 MB',
      tagline: 'Optimisez votre visibilité locale et obtenez plus d’appels.',
      description: 'Pack complet pour créer, optimiser et animer une fiche Google Business Profile avec calendrier de posts et réponses aux avis.',
      features: ['Audit de fiche', '50 modèles de posts', 'Réponses aux avis', 'Plan photos', 'Suivi du classement', 'Checklist anti-suspension'],
      compatible: 'Google Business Profile', updates: '12 mois', support: '30 jours', isBestSeller: true, isNew: true
    },
    {
      id: 'guide-digital-products', title: 'Guide Produits Numériques', category: 'Ressources', collection: 'Guides PDF',
      type: 'Guide PDF', price: 590, oldPrice: 890, rating: 4.7, reviews: 19, sales: 218,
      badge: 'Guide', icon: 'PDF', accent: '#ef4444', format: 'PDF', fileSize: '8 MB',
      tagline: 'De l’idée à la première vente, sans oublier la livraison.',
      description: 'Guide pratique pour choisir, produire, tarifer et vendre une ressource numérique avec une stratégie adaptée aux débutants.',
      features: ['86 pages', 'Plan d’action 30 jours', 'Exemples de prix', 'Outils recommandés', 'Checklist lancement', 'Cas pratiques'],
      compatible: 'PDF universel', updates: 'Édition 2026', support: 'Email', isBestSeller: false, isNew: true
    },
    {
      id: 'ebook-ai-business', title: 'IA pour PME', category: 'Ressources', collection: 'eBooks',
      type: 'eBook', price: 790, oldPrice: 1090, rating: 4.8, reviews: 24, sales: 176,
      badge: 'eBook', icon: 'AI', accent: '#8b5cf6', format: 'PDF · EPUB', fileSize: '10 MB',
      tagline: 'Des cas d’usage concrets pour automatiser une petite entreprise.',
      description: 'Un eBook accessible qui explique comment utiliser l’IA pour le marketing, le service client, les ventes et les opérations.',
      features: ['112 pages', '25 cas d’usage', 'Prompts inclus', 'Plans d’automatisation', 'Budget outils', 'Glossaire IA'],
      compatible: 'PDF · EPUB', updates: 'Édition 2026', support: 'Email', isBestSeller: false, isNew: true
    },
    {
      id: 'checklist-launch', title: 'Checklist Lancement Web', category: 'Ressources', collection: 'Checklists',
      type: 'Checklist', price: 390, oldPrice: 590, rating: 4.7, reviews: 17, sales: 309,
      badge: '120 contrôles', icon: 'CL', accent: '#fbbf24', format: 'PDF · Notion', fileSize: '5 MB',
      tagline: 'Ne laissez aucun détail compromettre votre mise en ligne.',
      description: 'Checklist professionnelle couvrant contenu, responsive, SEO, sécurité, analytics, formulaires et déploiement.',
      features: ['120 points de contrôle', 'Version Notion', 'Version imprimable', 'Priorités P0-P2', 'Responsables', 'Validation finale'],
      compatible: 'PDF · Notion', updates: '12 mois', support: 'Email', isBestSeller: true, isNew: false
    },
    {
      id: 'n8n-lead-machine', title: 'n8n Lead Machine', category: 'Automatisation', collection: 'Automatisations n8n',
      type: 'Workflow', price: 2690, oldPrice: 3690, rating: 4.9, reviews: 33, sales: 199,
      badge: 'Automatisation', icon: 'n8n', accent: '#ff6d5a', format: 'JSON · PDF', fileSize: '7 MB',
      tagline: 'Capturez, enrichissez et relancez vos prospects automatiquement.',
      description: 'Workflow n8n prêt à importer pour centraliser les leads, enrichir les données, notifier l’équipe et déclencher des relances personnalisées.',
      features: ['Workflow importable', 'Lead scoring', 'Relance email', 'Notification WhatsApp-ready', 'Google Sheets CRM', 'Guide vidéo'],
      compatible: 'n8n Cloud & Self-hosted', updates: '12 mois', support: '45 jours', isBestSeller: true, isNew: true
    },
    {
      id: 'airtable-crm', title: 'Airtable CRM OS', category: 'Automatisation', collection: 'Workflows Airtable',
      type: 'Base Airtable', price: 2190, oldPrice: 2990, rating: 4.8, reviews: 27, sales: 166,
      badge: 'CRM', icon: 'AT', accent: '#fcb400', format: 'Airtable · PDF', fileSize: '6 MB',
      tagline: 'Pilotez prospects, ventes et relances dans un espace simple.',
      description: 'Base Airtable structurée avec pipeline commercial, activités, contacts, offres, automatisations et tableau de bord.',
      features: ['Pipeline complet', 'Vues par commercial', 'Automatisations', 'Dashboard KPI', 'Modèles d’emails', 'Guide de déploiement'],
      compatible: 'Airtable', updates: '12 mois', support: '30 jours', isBestSeller: false, isNew: true
    },
    {
      id: 'ai-agent-support', title: 'Agent IA Support 24/7', category: 'Intelligence artificielle', collection: 'Agents IA',
      type: 'Agent IA', price: 4990, oldPrice: 6490, rating: 4.9, reviews: 21, sales: 88,
      badge: 'Agent IA', icon: 'AG', accent: '#06b6d4', format: 'n8n · Prompt · Docs', fileSize: '21 MB',
      tagline: 'Un assistant prêt à répondre, qualifier et escalader les demandes.',
      description: 'Architecture d’agent IA pour support client avec base de connaissances, qualification, historique et transfert humain.',
      features: ['Workflow n8n', 'Prompt système', 'Base de connaissances', 'Escalade humaine', 'Journal des échanges', 'Guide sécurité'],
      compatible: 'OpenAI · Claude · Gemini', updates: '12 mois', support: '60 jours', isBestSeller: true, isNew: true
    },
    {
      id: 'prompts-chatgpt-pro', title: 'ChatGPT Business Prompts', category: 'Intelligence artificielle', collection: 'Prompts ChatGPT',
      type: 'Pack de prompts', price: 690, oldPrice: 990, rating: 4.8, reviews: 39, sales: 512,
      badge: '250 prompts', icon: 'GPT', accent: '#10a37f', format: 'PDF · Notion', fileSize: '9 MB',
      tagline: 'Des prompts structurés pour les tâches quotidiennes d’une entreprise.',
      description: 'Bibliothèque de prompts pour stratégie, vente, marketing, service client, analyse et productivité.',
      features: ['250 prompts', '12 fonctions métier', 'Variables guidées', 'Exemples de réponses', 'Version Notion', 'Mises à jour'],
      compatible: 'ChatGPT', updates: 'À vie', support: 'Email', isBestSeller: true, isNew: false
    },
    {
      id: 'prompts-claude-research', title: 'Claude Research Prompts', category: 'Intelligence artificielle', collection: 'Prompts Claude',
      type: 'Pack de prompts', price: 690, oldPrice: 990, rating: 4.8, reviews: 18, sales: 143,
      badge: 'Recherche', icon: 'CLD', accent: '#d97757', format: 'PDF · Notion', fileSize: '7 MB',
      tagline: 'Analysez des documents et produisez des synthèses de haut niveau.',
      description: 'Prompts spécialisés pour recherche, analyse longue, rédaction structurée et exploitation de documents.',
      features: ['120 prompts', 'Analyse documentaire', 'Cadres de synthèse', 'Rédaction longue', 'Contrôle qualité', 'Cas pratiques'],
      compatible: 'Claude', updates: '12 mois', support: 'Email', isBestSeller: false, isNew: true
    },
    {
      id: 'prompts-gemini-content', title: 'Gemini Content Studio', category: 'Intelligence artificielle', collection: 'Prompts Gemini',
      type: 'Pack de prompts', price: 690, oldPrice: 990, rating: 4.7, reviews: 16, sales: 118,
      badge: 'Contenu', icon: 'GM', accent: '#4285f4', format: 'PDF · Sheets', fileSize: '8 MB',
      tagline: 'Planifiez et produisez du contenu multicanal plus rapidement.',
      description: 'Prompts optimisés pour la recherche, la planification éditoriale et la création de contenus avec Gemini.',
      features: ['150 prompts', 'Calendriers éditoriaux', 'SEO content', 'Social media', 'YouTube', 'Modèles Sheets'],
      compatible: 'Google Gemini', updates: '12 mois', support: 'Email', isBestSeller: false, isNew: true
    },
    {
      id: 'prompts-midjourney-brand', title: 'Midjourney Brand Lab', category: 'Intelligence artificielle', collection: 'Prompts Midjourney',
      type: 'Pack de prompts', price: 890, oldPrice: 1290, rating: 4.8, reviews: 28, sales: 206,
      badge: 'Visuels IA', icon: 'MJ', accent: '#e879f9', format: 'PDF · Notion', fileSize: '18 MB',
      tagline: 'Créez une direction visuelle cohérente pour votre marque.',
      description: 'Prompts et recettes visuelles pour branding, produits, publicités, réseaux sociaux et moodboards.',
      features: ['180 prompts', '30 styles visuels', 'Paramètres expliqués', 'Brand consistency', 'Moodboards', 'Exemples inclus'],
      compatible: 'Midjourney', updates: '12 mois', support: 'Email', isBestSeller: true, isNew: false
    },
    {
      id: 'fitness-club-pro', title: 'Fitness Club Pro', category: 'Templates', collection: 'Fitness',
      type: 'Template', price: 2290, oldPrice: 2990, rating: 0, reviews: 0, sales: 0,
      badge: 'En préparation', icon: 'FIT', accent: '#84cc16', format: 'HTML · CSS · JS', fileSize: '19 MB',
      tagline: 'Présentez vos programmes, coachs et abonnements avec énergie.',
      description: 'Template moderne pour salles de sport, coachs et studios fitness avec planning, programmes, profils coachs, tarifs et demandes d’essai.',
      features: ['Planning des cours', 'Profils coachs', 'Grille des abonnements', 'Calculateur d’objectif', 'Essai WhatsApp-ready', 'Documentation PDF'],
      compatible: 'Tous navigateurs modernes', updates: '12 mois prévus', support: '30 jours prévus', isBestSeller: false, isNew: true
    },
    {
      id: 'landing-page-collection', title: 'Landing Page Collection', category: 'Templates', collection: 'Landing Page Collection',
      type: 'Collection de templates', price: 2990, oldPrice: 3990, rating: 0, reviews: 0, sales: 0,
      badge: '12 modèles', icon: 'LP+', accent: '#0ea5e9', format: 'HTML · Tailwind · Figma', fileSize: '74 MB',
      tagline: 'Douze landing pages pour SaaS, services, événements et applications.',
      description: 'Collection modulaire de landing pages conçues pour différents objectifs de conversion, avec variantes de hero, prix, preuves, FAQ et formulaires.',
      features: ['12 landing pages', '48 sections modulaires', 'Fichiers Figma', 'Formulaires prêts à connecter', 'SEO technique', 'Guide A/B testing'],
      compatible: 'Tous navigateurs modernes', updates: '12 mois prévus', support: '45 jours prévus', isBestSeller: false, isNew: true
    },
    {
      id: 'nova-admin-panel', title: 'Nova Admin Panel', category: 'Templates', collection: 'Admin Panel',
      type: 'Template application', price: 3890, oldPrice: 4990, rating: 0, reviews: 0, sales: 0,
      badge: 'Application UI', icon: 'ADM', accent: '#6366f1', format: 'React · Tailwind · Figma', fileSize: '52 MB',
      tagline: 'Une base claire pour construire un back-office professionnel.',
      description: 'Template d’administration responsive avec tableaux, rôles, formulaires, paramètres, journal d’activité et états vides documentés.',
      features: ['24 écrans', 'Navigation responsive', 'Tables et filtres', 'Gestion des rôles UI', 'Light & Dark', 'Figma inclus'],
      compatible: 'Node.js 20+', updates: '12 mois prévus', support: '60 jours prévus', isBestSeller: false, isNew: true
    },
    {
      id: 'email-marketing-growth', title: 'Email Marketing Growth Pack', category: 'Marketing & SEO', collection: 'Email Marketing',
      type: 'Pack marketing', price: 1490, oldPrice: 1990, rating: 0, reviews: 0, sales: 0,
      badge: '80 emails', icon: 'EM', accent: '#f97316', format: 'Docs · Sheets · HTML', fileSize: '16 MB',
      tagline: 'Planifiez des séquences email cohérentes de l’accueil à la fidélisation.',
      description: 'Pack éditorial avec séquences d’onboarding, lancement, panier abandonné, réactivation et newsletters, accompagné d’un calendrier et de mesures KPI.',
      features: ['80 modèles d’emails', '10 séquences complètes', 'Calendrier 90 jours', 'Objets A/B', 'Dashboard KPI', 'Versions texte et HTML'],
      compatible: 'Brevo · Mailchimp · Klaviyo-ready', updates: '12 mois prévus', support: '30 jours prévus', isBestSeller: false, isNew: true
    },
    {
      id: 'canva-social-content', title: 'Canva Social Content Pack', category: 'Design', collection: 'Canva Social Pack',
      type: 'Pack Canva', price: 1190, oldPrice: 1590, rating: 0, reviews: 0, sales: 0,
      badge: '180 designs', icon: 'CNV', accent: '#00c4cc', format: 'Canva · PDF', fileSize: 'Lien Canva',
      tagline: 'Une bibliothèque sociale cohérente pour publier plus vite.',
      description: 'Pack de modèles éditables pour Instagram, Facebook, LinkedIn et stories avec formats promotion, conseil, témoignage et lancement.',
      features: ['180 modèles', '4 réseaux sociaux', 'Formats feed & story', 'Styles facilement modifiables', 'Guide de marque', 'Calendrier éditorial'],
      compatible: 'Canva', updates: '12 mois prévus', support: '30 jours prévus', isBestSeller: false, isNew: true
    },
    {
      id: 'startup-ui-kit', title: 'Startup UI Kit', category: 'Design', collection: 'Startup UI',
      type: 'Kit UI/UX', price: 2490, oldPrice: 3290, rating: 0, reviews: 0, sales: 0,
      badge: 'Figma', icon: 'SUI', accent: '#a855f7', format: 'Figma', fileSize: '61 MB',
      tagline: 'Passez de l’idée au prototype SaaS avec un système cohérent.',
      description: 'Kit UI destiné aux startups avec onboarding, authentification, billing, équipe, notifications et paramètres, construit avec variables et auto-layout.',
      features: ['32 écrans SaaS', '260 composants', 'Variables Figma', 'Light & Dark', 'Prototype inclus', 'Design tokens'],
      compatible: 'Figma', updates: 'À vie prévues', support: '60 jours prévus', isBestSeller: false, isNew: true
    },
    {
      id: 'analytics-dashboard-ui', title: 'Analytics Dashboard UI', category: 'Design', collection: 'Dashboard UI',
      type: 'Kit UI/UX', price: 2190, oldPrice: 2890, rating: 0, reviews: 0, sales: 0,
      badge: 'Data UI', icon: 'DSH', accent: '#38bdf8', format: 'Figma · Charts', fileSize: '47 MB',
      tagline: 'Présentez les données complexes avec une hiérarchie visuelle nette.',
      description: 'Bibliothèque de dashboards pour ventes, marketing, finance et opérations avec graphiques, tableaux, filtres et états responsives.',
      features: ['18 dashboards', '40 graphiques', 'Tables avancées', 'Filtres et périodes', 'Responsive variants', 'Documentation data-viz'],
      compatible: 'Figma', updates: '12 mois prévus', support: '45 jours prévus', isBestSeller: false, isNew: true
    },
    {
      id: 'ai-prompt-master-bundle', title: 'AI Prompt Master Bundle', category: 'Intelligence artificielle', collection: 'Prompt Bundles',
      type: 'Bundle de prompts', price: 1990, oldPrice: 2790, rating: 0, reviews: 0, sales: 0,
      badge: '700 prompts', icon: 'AIP', accent: '#c084fc', format: 'PDF · Notion · Sheets', fileSize: '28 MB',
      tagline: 'Une bibliothèque structurée pour ChatGPT, Claude et Gemini.',
      description: 'Bundle transversal de prompts pour stratégie, recherche, contenu, ventes, service client et analyse, avec variables et exemples de validation.',
      features: ['700 prompts', '3 assistants IA', '18 fonctions métier', 'Variables guidées', 'Exemples commentés', 'Checklist qualité'],
      compatible: 'ChatGPT · Claude · Gemini', updates: '12 mois prévus', support: 'Email prévu', isBestSeller: false, isNew: true
    },
    {
      id: 'portfolio-pro-bundle', title: 'Portfolio Pro Bundle', category: 'Bundles', collection: 'Portfolio Bundles',
      type: 'Bundle Premium', price: 3590, oldPrice: 5190, rating: 0, reviews: 0, sales: 0,
      badge: 'Bundle en préparation', icon: 'PFB', accent: '#ec4899', format: 'Templates · Figma · PDF', fileSize: '112 MB',
      tagline: 'Construisez une présence complète pour présenter vos compétences.',
      description: 'Bundle prévu avec Nova Portfolio, landing page personnelle, kit de cas d’étude, CV éditable et checklist de publication.',
      features: ['2 templates web', 'Kit de cas d’étude', 'CV Figma & Canva', 'Checklist portfolio', 'Guide de storytelling', 'Licence commerciale prévue'],
      compatible: 'Web · Figma · Canva', updates: '12 mois prévus', support: '45 jours prévus', isBestSeller: false, isNew: true
    },
    {
      id: 'agency-growth-bundle', title: 'Agency Growth Bundle', category: 'Bundles', collection: 'Agency Bundles',
      type: 'Bundle Premium', price: 5990, oldPrice: 8490, rating: 0, reviews: 0, sales: 0,
      badge: 'Bundle en préparation', icon: 'AGY', accent: '#f59e0b', format: 'Templates · CRM · Marketing', fileSize: '186 MB',
      tagline: 'Structurez la présentation, les leads et le suivi d’une agence.',
      description: 'Bundle de ressources numériques standardisées comprenant un template d’agence, un CRM Airtable, des modèles de propositions et un pack email.',
      features: ['Template agence', 'CRM Airtable', 'Propositions commerciales', 'Email Marketing Pack', 'Dashboard de suivi', 'Guides de configuration'],
      compatible: 'Web · Airtable · Docs', updates: '12 mois prévus', support: '60 jours prévus', isBestSeller: false, isNew: true
    },
    {
      id: 'academy-google-ads', title: 'Google Ads de Zéro à Rentable', category: 'Academy', collection: 'Google Ads',
      type: 'Formation vidéo', price: 3490, oldPrice: 4990, rating: 4.9, reviews: 46, sales: 271,
      badge: 'Formation', icon: 'ADS', accent: '#4285f4', format: 'Vidéo · PDF', fileSize: '6h 20',
      tagline: 'Créez, mesurez et optimisez des campagnes qui génèrent des ventes.',
      description: 'Formation pratique couvrant recherche de mots-clés, campagnes Search, conversion tracking, optimisation et reporting.',
      features: ['42 leçons', '6h20 de vidéo', 'Fichiers pratiques', 'Études de cas', 'Quiz', 'Certificat WebNova'],
      compatible: 'Accès en ligne', updates: 'À vie', support: 'Communauté', isBestSeller: true, isNew: false
    },
    {
      id: 'academy-seo', title: 'SEO Pratique 2026', category: 'Academy', collection: 'SEO',
      type: 'Formation vidéo', price: 2990, oldPrice: 4290, rating: 4.9, reviews: 38, sales: 229,
      badge: 'Formation', icon: 'SEO', accent: '#22c55e', format: 'Vidéo · Templates', fileSize: '5h 10',
      tagline: 'Positionnez un site avec une méthode claire et mesurable.',
      description: 'Cours complet sur la recherche de mots-clés, l’optimisation on-page, la technique, le contenu et les backlinks.',
      features: ['36 leçons', '5h10 de vidéo', 'Audit guidé', 'Templates SEO', 'Projet final', 'Certificat WebNova'],
      compatible: 'Accès en ligne', updates: 'À vie', support: 'Communauté', isBestSeller: true, isNew: false
    },
    {
      id: 'academy-google-business', title: 'Google Business Mastery', category: 'Academy', collection: 'Google Business Profile',
      type: 'Mini-cours', price: 1490, oldPrice: 1990, rating: 4.8, reviews: 23, sales: 164,
      badge: 'Mini-cours', icon: 'GBP', accent: '#fbbc04', format: 'Vidéo · Checklist', fileSize: '2h 15',
      tagline: 'Dominez les recherches locales et obtenez plus de contacts.',
      description: 'Mini-cours concret pour optimiser la fiche, publier régulièrement, obtenir des avis et suivre les performances.',
      features: ['18 leçons', '2h15 de vidéo', 'Checklist complète', 'Calendrier posts', 'Réponses aux avis', 'Certificat'],
      compatible: 'Accès en ligne', updates: '12 mois', support: 'Communauté', isBestSeller: false, isNew: true
    },
    {
      id: 'academy-ai', title: 'IA Productive pour Entrepreneurs', category: 'Academy', collection: 'IA',
      type: 'Formation vidéo', price: 3290, oldPrice: 4490, rating: 4.9, reviews: 34, sales: 207,
      badge: 'Nouveau', icon: 'IA', accent: '#8b5cf6', format: 'Vidéo · Prompts', fileSize: '4h 40',
      tagline: 'Intégrez l’IA dans vos processus sans devenir développeur.',
      description: 'Formation orientée résultats pour utiliser ChatGPT, Claude et Gemini dans les ventes, le marketing et l’organisation.',
      features: ['32 leçons', '4h40 de vidéo', '150 prompts', 'Workflows métier', 'Projet automatisé', 'Certificat'],
      compatible: 'Accès en ligne', updates: 'À vie', support: 'Communauté', isBestSeller: true, isNew: true
    },
    {
      id: 'academy-n8n', title: 'n8n Automation Builder', category: 'Academy', collection: 'n8n',
      type: 'Formation vidéo', price: 4490, oldPrice: 5990, rating: 4.9, reviews: 29, sales: 141,
      badge: 'Technique', icon: 'n8n', accent: '#ff6d5a', format: 'Vidéo · Workflows', fileSize: '7h 05',
      tagline: 'Construisez des automatisations professionnelles étape par étape.',
      description: 'De la première automatisation aux agents IA, apprenez les triggers, APIs, webhooks, données et déploiement n8n.',
      features: ['48 leçons', '7h05 de vidéo', '20 workflows', 'APIs & webhooks', 'Projet CRM', 'Certificat'],
      compatible: 'n8n Cloud & Self-hosted', updates: 'À vie', support: 'Communauté', isBestSeller: true, isNew: true
    },
    {
      id: 'academy-marketing', title: 'Marketing Digital 360', category: 'Academy', collection: 'Marketing Digital',
      type: 'Formation vidéo', price: 3990, oldPrice: 5490, rating: 4.8, reviews: 32, sales: 191,
      badge: 'Complet', icon: 'MKT', accent: '#ec4899', format: 'Vidéo · Templates', fileSize: '8h 30',
      tagline: 'Développez une stratégie digitale cohérente et rentable.',
      description: 'Positionnement, contenu, publicité, email, social media et mesure réunis dans un parcours complet.',
      features: ['54 leçons', '8h30 de vidéo', 'Plan marketing', 'Templates campagne', 'Dashboard KPI', 'Certificat'],
      compatible: 'Accès en ligne', updates: 'À vie', support: 'Communauté', isBestSeller: false, isNew: false
    },
    {
      id: 'academy-web', title: 'Créer un Site qui Vend', category: 'Academy', collection: 'Création de sites',
      type: 'Formation vidéo', price: 3790, oldPrice: 4990, rating: 4.9, reviews: 41, sales: 255,
      badge: 'Projet complet', icon: 'WEB', accent: '#3b82f6', format: 'Vidéo · Code', fileSize: '9h 10',
      tagline: 'Concevez, développez et publiez un site professionnel.',
      description: 'Une formation complète allant du brief au déploiement avec design, HTML, CSS, JavaScript, SEO et conversion.',
      features: ['62 leçons', '9h10 de vidéo', 'Projet complet', 'Code source', 'Déploiement', 'Certificat'],
      compatible: 'Navigateur · VS Code', updates: 'À vie', support: 'Communauté', isBestSeller: true, isNew: false
    },
    {
      id: 'academy-whatsapp', title: 'WhatsApp Business Growth', category: 'Academy', collection: 'WhatsApp Business',
      type: 'Mini-cours', price: 1290, oldPrice: 1790, rating: 4.8, reviews: 25, sales: 198,
      badge: 'Mini-cours', icon: 'WA', accent: '#25d366', format: 'Vidéo · Scripts', fileSize: '1h 55',
      tagline: 'Transformez WhatsApp en canal de vente structuré.',
      description: 'Catalogue, messages automatiques, scripts de vente, suivi client et campagnes WhatsApp pour petites entreprises.',
      features: ['16 leçons', '1h55 de vidéo', '30 scripts', 'Catalogue guidé', 'Pipeline de suivi', 'Certificat'],
      compatible: 'WhatsApp Business', updates: '12 mois', support: 'Communauté', isBestSeller: false, isNew: true
    },
    {
      id: 'bundle-creator', title: 'Creator Launch Bundle', category: 'Bundles', collection: 'Bundles Premium',
      type: 'Bundle Premium', price: 4990, oldPrice: 8490, rating: 4.9, reviews: 36, sales: 183,
      badge: 'Économisez 41%', icon: 'CR', accent: '#a855f7', format: 'Templates · Prompts · Guides', fileSize: '145 MB',
      tagline: 'Tout le nécessaire pour lancer une offre numérique remarquable.',
      description: 'Portfolio, landing page, UI kit, prompts, guide de lancement et checklist réunis dans un bundle avantageux.',
      features: ['6 produits inclus', 'Licence commerciale', 'Mises à jour à vie', 'Documentation', 'Bonus exclusifs', 'Support prioritaire'],
      compatible: 'Figma · Web · PDF', updates: 'À vie', support: '60 jours', isBestSeller: true, isNew: true
    },
    {
      id: 'bundle-business', title: 'Local Business Growth Bundle', category: 'Bundles', collection: 'Bundles Premium',
      type: 'Bundle Premium', price: 6490, oldPrice: 11290, rating: 4.9, reviews: 28, sales: 124,
      badge: 'Économisez 42%', icon: 'LB', accent: '#f59e0b', format: 'Templates · SEO · Formation', fileSize: '220 MB',
      tagline: 'Site, visibilité locale et acquisition dans une seule boîte à outils.',
      description: 'Template business, Google Business Booster, SEO Launch Pack et mini-cours WhatsApp Business.',
      features: ['4 produits premium', 'Template au choix', 'SEO local complet', 'Formation incluse', 'Licence commerciale', 'Support prioritaire'],
      compatible: 'Web · Google · WhatsApp', updates: 'À vie', support: '60 jours', isBestSeller: true, isNew: false
    },
    {
      id: 'bundle-automation', title: 'Automation & AI Bundle', category: 'Bundles', collection: 'Bundles Premium',
      type: 'Bundle Premium', price: 8990, oldPrice: 15670, rating: 5.0, reviews: 19, sales: 76,
      badge: 'Économisez 43%', icon: 'AU', accent: '#06b6d4', format: 'n8n · Airtable · Agents IA', fileSize: '96 MB',
      tagline: 'Automatisez les opérations, les leads et le support client.',
      description: 'n8n Lead Machine, Airtable CRM OS, Agent IA Support et formation n8n réunis dans notre bundle le plus puissant.',
      features: ['4 solutions complètes', 'Workflows importables', 'Formation 7h', 'Documentation technique', 'Mises à jour à vie', 'Support prioritaire'],
      compatible: 'n8n · Airtable · IA', updates: 'À vie', support: '90 jours', isBestSeller: true, isNew: true
    }
  ];

  const categoryGroups = [
    { name: 'Templates', icon: 'WB', description: 'Sites, boutiques, landing pages et portfolios prêts à personnaliser.', countLabel: '12 collections' },
    { name: 'Design', icon: 'UI', description: 'Kits UI/UX et ressources visuelles premium pour vos projets.', countLabel: '5 collections' },
    { name: 'Marketing & SEO', icon: 'SEO', description: 'Outils concrets pour gagner en visibilité et convertir davantage.', countLabel: '3 collections' },
    { name: 'Automatisation', icon: 'AUT', description: 'Workflows n8n et Airtable prêts à importer et adapter.', countLabel: '2 collections' },
    { name: 'Intelligence artificielle', icon: 'IA', description: 'Agents IA et bibliothèques de prompts spécialisés.', countLabel: '6 collections' },
    { name: 'Ressources', icon: 'PDF', description: 'Guides, eBooks et checklists immédiatement applicables.', countLabel: '3 collections' },
    { name: 'Academy', icon: 'AC', description: 'Formations vidéo et mini-cours orientés projets.', countLabel: '8 parcours' },
    { name: 'Bundles', icon: 'BX', description: 'Collections de ressources complémentaires proposées ensemble.', countLabel: '5 bundles' }
  ];

  const collections = [...new Set(products.map((product) => product.collection))];

  return { products, categoryGroups, collections };
})();
