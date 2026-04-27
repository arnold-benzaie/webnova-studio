/* ==========================================================================
   WebNova Studio — Main Script
   - Bilingual FR/EN switcher
   - Smooth scroll
   - Scroll-triggered animations
   - Mobile menu
   - Navbar effects
   ========================================================================== */

(() => {
  'use strict';

  /* ----- TRANSLATIONS (FR / EN) ----- */
  const translations = {
    fr: {
      'nav.services': 'Services',
      'nav.pricing': 'Tarifs',
      'nav.process': 'Processus',
      'nav.about': 'À propos',
      'nav.contact': 'Contact',
      'nav.cta': 'Demander un devis',

      'hero.badge': 'Agence web certifiée à Maurice',
      'hero.title1': 'Votre site web',
      'hero.title2': 'professionnel',
      'hero.title3': 'en quelques jours.',
      'hero.subtitle': 'Création de sites web modernes, e-commerce et WhatsApp Business intégré. Livraison rapide à partir de',
      'hero.ctaPrimary': 'WhatsApp maintenant',
      'hero.ctaSecondary': 'Voir les services',
      'hero.trust1': 'livraison express',
      'hero.trust2': 'responsive mobile',
      'hero.trust3': 'optimisé Google',
      'hero.fastBadge': 'Rapide',

      'services.eyebrow': 'Nos services',
      'services.title': 'Tout ce dont votre business a besoin',
      'services.subtitle': 'Des solutions web complètes adaptées au marché mauricien.',
      'services.popular': 'Populaire',
      'services.web.title': 'Sites Vitrine',
      'services.web.desc': 'Sites web modernes, rapides et responsive pour présenter votre business avec élégance.',
      'services.web.f1': 'Design sur mesure',
      'services.web.f2': '100% responsive',
      'services.web.f3': 'Optimisé SEO Google',
      'services.web.f4': 'Hébergement inclus',
      'services.wa.title': 'WhatsApp Business',
      'services.wa.desc': 'Bouton WhatsApp intégré, chatbot, catalogue produits — convertissez vos visiteurs directement.',
      'services.wa.f1': 'Bouton flottant 24/7',
      'services.wa.f2': 'Messages pré-remplis',
      'services.wa.f3': 'Catalogue WhatsApp',
      'services.wa.f4': 'Notifications auto',
      'services.ecom.title': 'E-commerce',
      'services.ecom.desc': 'Boutique en ligne complète avec paiement, gestion de stock et livraison à Maurice.',
      'services.ecom.f1': 'Paiement sécurisé',
      'services.ecom.f2': 'Gestion produits',
      'services.ecom.f3': 'Module livraison MU',
      'services.ecom.f4': 'Tableau de bord',

      'process.eyebrow': 'Notre processus',
      'process.title': "De l'idée au lancement en 4 étapes",
      'process.s1.title': 'Discussion',
      'process.s1.desc': 'On échange sur WhatsApp. Vous me dites votre vision, vos couleurs, vos exemples.',
      'process.s2.title': 'Maquette',
      'process.s2.desc': 'Je vous présente une maquette personnalisée. Vous validez ou demandez des ajustements.',
      'process.s3.title': 'Développement',
      'process.s3.desc': 'Je code votre site avec les dernières technologies. Rapide, sécurisé, optimisé SEO.',
      'process.s4.title': 'Livraison',
      'process.s4.desc': 'Mise en ligne, formation rapide, et support continu sur WhatsApp.',

      'pricing.eyebrow': 'Tarifs transparents',
      'pricing.title': 'Des prix pensés pour Maurice',
      'pricing.subtitle': 'Pas de surprise. Pas de frais cachés. Juste des résultats.',
      'pricing.popular': '⭐ Le plus choisi',
      'pricing.cta': 'Choisir ce pack',
      'pricing.starter.name': 'Starter',
      'pricing.starter.tag': 'Site vitrine simple',
      'pricing.starter.f1': '1 page (one-page)',
      'pricing.starter.f2': 'Design responsive',
      'pricing.starter.f3': 'Bouton WhatsApp',
      'pricing.starter.f4': 'Formulaire contact',
      'pricing.starter.f5': 'Hébergement 1 an',
      'pricing.starter.f6': 'Livraison 48h',
      'pricing.pro.name': 'Pro',
      'pricing.pro.tag': 'Business complet',
      "pricing.pro.f1": "Jusqu'à 5 pages",
      'pricing.pro.f2': 'Design premium sur mesure',
      'pricing.pro.f3': 'WhatsApp Business intégré',
      'pricing.pro.f4': 'SEO Google avancé',
      'pricing.pro.f5': 'Animations modernes',
      'pricing.pro.f6': 'Hébergement 1 an + email pro',
      'pricing.pro.f7': 'Support 3 mois',
      'pricing.ecom.name': 'E-commerce',
      'pricing.ecom.tag': 'Boutique en ligne',
      'pricing.ecom.f1': 'Boutique illimitée',
      'pricing.ecom.f2': 'Paiement en ligne (MCB, MyT)',
      'pricing.ecom.f3': 'Gestion stock + commandes',
      'pricing.ecom.f4': 'Module livraison Maurice',
      'pricing.ecom.f5': 'Catalogue WhatsApp sync',
      'pricing.ecom.f6': 'Hébergement pro + email',
      'pricing.ecom.f7': 'Support 6 mois',
      "pricing.note": "Besoin d'autre chose ? Demandez un devis personnalisé sur WhatsApp.",

      'about.eyebrow': 'À propos',
      'about.title1': 'Le studio web qui parle',
      'about.title2': 'votre langue.',
      'about.p1': 'WebNova Studio est une agence digitale basée à Maurice. Nous concevons des sites web modernes pour les PME, freelances et e-commerçants qui veulent une présence en ligne professionnelle sans se ruiner.',
      'about.p2': 'Notre force : combiner design soigné, technologies récentes et intégration WhatsApp — l\'outil de communication n°1 à Maurice.',
      'about.stat1': 'délai express',
      'about.stat2': 'bilingue',
      'about.stat3': 'à partir de',
      'about.tagline': 'Digital · Innovation · Mauritius',

      'contact.eyebrow': 'Prêt à démarrer ?',
      'contact.title1': 'Discutons de votre projet',
      'contact.title2': 'sur WhatsApp.',
      'contact.subtitle': 'Réponse sous 1h. Devis gratuit. Aucune obligation.',
      'contact.cta': '+230 5857 4757',

      'footer.tagline': 'Digital · Innovation · Mauritius',
      'footer.servicesTitle': 'Services',
      'footer.s1': 'Sites vitrine',
      'footer.s2': 'E-commerce',
      'footer.s3': 'WhatsApp Business',
      'footer.s4': 'Tarifs',
      'footer.companyTitle': 'Entreprise',
      'footer.c1': 'À propos',
      'footer.c2': 'Processus',
      'footer.c3': 'Contact',
      'footer.contactTitle': 'Contact',
      'footer.rights': 'Tous droits réservés.',
      'footer.made': 'Conçu avec ❤️ à Maurice',

      'float.tooltip': 'Discutons !'
    },
    en: {
      'nav.services': 'Services',
      'nav.pricing': 'Pricing',
      'nav.process': 'Process',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.cta': 'Get a quote',

      'hero.badge': 'Certified web agency in Mauritius',
      'hero.title1': 'Your',
      'hero.title2': 'professional',
      'hero.title3': 'website in days.',
      'hero.subtitle': 'Modern websites, e-commerce and integrated WhatsApp Business. Fast delivery starting from',
      'hero.ctaPrimary': 'WhatsApp now',
      'hero.ctaSecondary': 'View services',
      'hero.trust1': 'express delivery',
      'hero.trust2': 'mobile responsive',
      'hero.trust3': 'Google optimized',
      'hero.fastBadge': 'Fast',

      'services.eyebrow': 'Our services',
      'services.title': 'Everything your business needs',
      'services.subtitle': 'Complete web solutions tailored for the Mauritian market.',
      'services.popular': 'Popular',
      'services.web.title': 'Showcase Sites',
      'services.web.desc': 'Modern, fast and responsive websites to showcase your business with elegance.',
      'services.web.f1': 'Custom design',
      'services.web.f2': '100% responsive',
      'services.web.f3': 'Google SEO optimized',
      'services.web.f4': 'Hosting included',
      'services.wa.title': 'WhatsApp Business',
      'services.wa.desc': 'Integrated WhatsApp button, chatbot, product catalog — convert visitors directly.',
      'services.wa.f1': '24/7 floating button',
      'services.wa.f2': 'Pre-filled messages',
      'services.wa.f3': 'WhatsApp catalog',
      'services.wa.f4': 'Auto notifications',
      'services.ecom.title': 'E-commerce',
      'services.ecom.desc': 'Complete online store with payments, stock management and Mauritius delivery.',
      'services.ecom.f1': 'Secure payment',
      'services.ecom.f2': 'Product management',
      'services.ecom.f3': 'MU delivery module',
      'services.ecom.f4': 'Dashboard',

      'process.eyebrow': 'Our process',
      'process.title': 'From idea to launch in 4 steps',
      'process.s1.title': 'Discussion',
      'process.s1.desc': 'We chat on WhatsApp. You share your vision, colors, examples.',
      'process.s2.title': 'Mockup',
      'process.s2.desc': 'I present a custom mockup. You validate or request adjustments.',
      'process.s3.title': 'Development',
      'process.s3.desc': 'I code your site with the latest technologies. Fast, secure, SEO optimized.',
      'process.s4.title': 'Delivery',
      'process.s4.desc': 'Going live, quick training, and ongoing WhatsApp support.',

      'pricing.eyebrow': 'Transparent pricing',
      'pricing.title': 'Pricing designed for Mauritius',
      'pricing.subtitle': 'No surprises. No hidden fees. Just results.',
      'pricing.popular': '⭐ Most chosen',
      'pricing.cta': 'Choose this pack',
      'pricing.starter.name': 'Starter',
      'pricing.starter.tag': 'Simple showcase site',
      'pricing.starter.f1': '1 page (one-page)',
      'pricing.starter.f2': 'Responsive design',
      'pricing.starter.f3': 'WhatsApp button',
      'pricing.starter.f4': 'Contact form',
      'pricing.starter.f5': '1 year hosting',
      'pricing.starter.f6': '48h delivery',
      'pricing.pro.name': 'Pro',
      'pricing.pro.tag': 'Complete business',
      'pricing.pro.f1': 'Up to 5 pages',
      'pricing.pro.f2': 'Premium custom design',
      'pricing.pro.f3': 'WhatsApp Business integrated',
      'pricing.pro.f4': 'Advanced Google SEO',
      'pricing.pro.f5': 'Modern animations',
      'pricing.pro.f6': '1 year hosting + pro email',
      'pricing.pro.f7': '3 months support',
      'pricing.ecom.name': 'E-commerce',
      'pricing.ecom.tag': 'Online store',
      'pricing.ecom.f1': 'Unlimited store',
      'pricing.ecom.f2': 'Online payment (MCB, MyT)',
      'pricing.ecom.f3': 'Stock + orders management',
      'pricing.ecom.f4': 'Mauritius delivery module',
      'pricing.ecom.f5': 'WhatsApp catalog sync',
      'pricing.ecom.f6': 'Pro hosting + email',
      'pricing.ecom.f7': '6 months support',
      'pricing.note': 'Need something else? Get a custom quote on WhatsApp.',

      'about.eyebrow': 'About',
      'about.title1': 'The web studio that speaks',
      'about.title2': 'your language.',
      'about.p1': 'WebNova Studio is a digital agency based in Mauritius. We design modern websites for SMEs, freelancers and e-merchants who want a professional online presence without breaking the bank.',
      'about.p2': "Our strength: combining elegant design, modern technologies and WhatsApp integration — the #1 communication tool in Mauritius.",
      'about.stat1': 'express delivery',
      'about.stat2': 'bilingual',
      'about.stat3': 'starting from',
      'about.tagline': 'Digital · Innovation · Mauritius',

      'contact.eyebrow': 'Ready to start?',
      'contact.title1': "Let's discuss your project",
      'contact.title2': 'on WhatsApp.',
      'contact.subtitle': 'Reply within 1h. Free quote. No obligation.',
      'contact.cta': '+230 5857 4757',

      'footer.tagline': 'Digital · Innovation · Mauritius',
      'footer.servicesTitle': 'Services',
      'footer.s1': 'Showcase sites',
      'footer.s2': 'E-commerce',
      'footer.s3': 'WhatsApp Business',
      'footer.s4': 'Pricing',
      'footer.companyTitle': 'Company',
      'footer.c1': 'About',
      'footer.c2': 'Process',
      'footer.c3': 'Contact',
      'footer.contactTitle': 'Contact',
      'footer.rights': 'All rights reserved.',
      'footer.made': 'Crafted with ❤️ in Mauritius',

      'float.tooltip': "Let's chat!"
    }
  };

  /* ----- LANGUAGE MANAGEMENT ----- */
  const STORAGE_KEY = 'webnova-lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || (navigator.language.startsWith('en') ? 'en' : 'fr');

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = translations[lang][key];
      if (text !== undefined) el.textContent = text;
    });

    // Update lang switch UI
    const switchEl = document.getElementById('langSwitch');
    if (switchEl) {
      switchEl.querySelector('.lang-fr').classList.toggle('active', lang === 'fr');
      switchEl.querySelector('.lang-en').classList.toggle('active', lang === 'en');
    }

    // Update title
    if (lang === 'en') {
      document.title = 'WebNova Studio — Professional Website Creation in Mauritius | Rs 9,000';
    } else {
      document.title = 'WebNova Studio — Création de Sites Web Professionnels à Maurice | Rs 9,000';
    }
  }

  /* ----- NAVBAR SCROLL EFFECT ----- */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  /* ----- INTERSECTION OBSERVER (Scroll animations) ----- */
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function setupAnimations() {
    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
  }

  /* ----- MOBILE MENU ----- */
  function setupMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    // Close on link click
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  /* ----- SMOOTH SCROLL ----- */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ----- LANGUAGE SWITCH ----- */
  function setupLangSwitch() {
    const btn = document.getElementById('langSwitch');
    if (!btn) return;
    btn.addEventListener('click', () => {
      applyLanguage(currentLang === 'fr' ? 'en' : 'fr');
    });
  }

  /* ----- DYNAMIC YEAR ----- */
  function setupYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ----- ANALYTICS HELPERS (WhatsApp click tracking) ----- */
  function trackWhatsApp() {
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      link.addEventListener('click', () => {
        // Hook for analytics (Google Analytics / Meta Pixel) when added
        if (window.fbq) window.fbq('track', 'Contact');
        if (window.gtag) window.gtag('event', 'whatsapp_click', { event_category: 'engagement' });
      });
    });
  }

  /* ----- INIT ----- */
  function init() {
    applyLanguage(currentLang);
    setupAnimations();
    setupMobileMenu();
    setupSmoothScroll();
    setupLangSwitch();
    setupYear();
    trackWhatsApp();

    // Scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mark hero as visible immediately
    setTimeout(() => {
      document.querySelectorAll('.hero [data-aos]').forEach(el => el.classList.add('in-view'));
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
