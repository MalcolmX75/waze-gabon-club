# 🔄 SAFER METHOD™ — MIGRATION : VITE + REACT → NEXT.JS APP ROUTER

> **Projet** : Waze Gabon Club
> **Opération** : Migration de stack (Vite → Next.js)
> **Statut** : CRITIQUE — Refondation technique
> **Ce qui est préservé** : Documentation SAFER, i18n, contenu, design, flags, sécurité
> **Ce qui change** : Scaffolding, routing, rendu (CSR → SSR/SSG), structure fichiers

---

## DIRECTIVE POUR CLAUDE CODE

Le projet Waze Gabon Club a été construit en Vite + React (SPA). C'est une erreur architecturale : un site communautaire qui doit être indexé par Google ne peut pas être un SPA. On migre vers **Next.js App Router** pour le SEO, le routing natif, et l'écosystème Vercel.

**Tu dois** :
1. Créer un nouveau projet Next.js dans un nouveau dossier
2. Migrer tout le contenu existant (i18n, flags, config, sécurité, design)
3. Restructurer pour le App Router
4. Ajouter les metadata SSR pour le SEO
5. Vérifier que tout fonctionne en local

**Tu ne dois PAS** :
- Perdre du contenu (259 clés i18n, 6 tutoriels, 7 FAQ, 6 articles, 6 deep links)
- Changer le design (couleurs, animations, layout — tout reste identique)
- Ajouter des dépendances inutiles (pas de Tailwind, pas de UI library)
- Supprimer l'ancien projet (on le garde comme référence)

---

## ÉTAPE 1 : NOUVEAU PROJET NEXT.JS

```bash
# Créer le nouveau projet à côté de l'ancien
cd ..
npx create-next-app@latest waze-gabon-club-next \
  --app \
  --no-tailwind \
  --no-eslint \
  --no-src-dir \
  --js \
  --import-alias "@/*"

cd waze-gabon-club-next
```

Options explicites :
- `--app` : App Router (pas Pages Router)
- `--no-tailwind` : On utilise du CSS inline comme le prototype
- `--no-eslint` : On ajoute plus tard si besoin
- `--no-src-dir` : Structure plate (`app/` à la racine, pas `src/app/`)
- `--js` : JavaScript, pas TypeScript (cohérent avec le projet existant)

---

## ÉTAPE 2 : STRUCTURE DU PROJET

```
waze-gabon-club-next/
│
├── app/
│   ├── layout.js              # Layout racine (fonts, metadata globale, providers)
│   ├── page.js                # Page d'accueil (toutes les sections)
│   ├── globals.css            # Styles globaux (animations, classes utilitaires)
│   ├── favicon.ico
│   └── manifest.json          # PWA manifest (copié depuis l'ancien projet)
│
├── components/
│   ├── Navigation.js          # Barre de navigation fixe
│   ├── Hero.js                # Section hero
│   ├── Features.js            # Section avantages
│   ├── Download.js            # Section téléchargement
│   ├── Tutorials.js           # Section tutoriels (client component — accordéon)
│   ├── LiveMap.js             # Section carte live (client component — iframe)
│   ├── Community.js           # Section communauté
│   ├── Articles.js            # Section actualités
│   ├── FAQ.js                 # Section FAQ (client component — accordéon)
│   ├── Privacy.js             # Section confidentialité
│   ├── Footer.js              # Footer
│   ├── FloatingWhatsApp.js    # Bouton WhatsApp flottant
│   ├── RegisterModal.js       # Modal inscription (client component — formulaire)
│   ├── DebugPanel.js          # Panneau debug (client component)
│   └── LanguageSwitcher.js    # Sélecteur FR/EN (client component)
│
├── lib/
│   ├── config.js              # ← COPIER depuis ancien projet (src/config.js)
│   ├── flags.js               # ← COPIER depuis ancien projet (src/flags.js)
│   ├── colors.js              # Constantes de couleurs (objet C du prototype)
│   ├── data.js                # Données statiques (DEEP_LINKS, TUTORIALS, ARTICLES, FAQS)
│   └── i18n/
│       ├── index.js           # ← COPIER et adapter depuis ancien projet (src/i18n/index.js)
│       ├── fr.json            # ← COPIER depuis ancien projet (src/i18n/fr.json)
│       └── en.json            # ← COPIER depuis ancien projet (src/i18n/en.json)
│
├── utils/
│   ├── form.js                # ← COPIER depuis ancien projet (src/utils/form.js)
│   └── externalLink.js        # ← COPIER depuis ancien projet (src/utils/externalLink.js)
│
├── public/
│   ├── icons/                 # Icônes PWA (placeholder)
│   └── sw.js                  # Service worker (copier et adapter)
│
├── docs/                      # ← COPIER TOUT le dossier /docs/ de l'ancien projet
│
├── next.config.js             # Config Next.js (headers sécurité, etc.)
├── package.json
└── README.md                  # ← COPIER et adapter depuis ancien projet
```

---

## ÉTAPE 3 : MIGRATION FICHIER PAR FICHIER

### A. Fichiers à COPIER tels quels (aucune modification)

```bash
# Depuis l'ancien projet waze-gabon-club/
cp src/i18n/fr.json      ../waze-gabon-club-next/lib/i18n/fr.json
cp src/i18n/en.json      ../waze-gabon-club-next/lib/i18n/en.json
cp src/utils/form.js     ../waze-gabon-club-next/utils/form.js
cp src/utils/externalLink.js ../waze-gabon-club-next/utils/externalLink.js
cp -r docs/              ../waze-gabon-club-next/docs/
```

### B. Fichiers à COPIER et ADAPTER

#### `lib/config.js`
Copier `src/config.js` → adapter les imports si nécessaire.
Le contenu reste identique (liens WhatsApp, Telegram, Facebook, Formspree, Waze).

#### `lib/flags.js`
Copier `src/flags.js` → adapter les exports.
Les flags restent identiques (10 ON, 3 OFF, 1 SYSTEM).

#### `lib/i18n/index.js`
Le hook `useTranslation()` doit être adapté pour Next.js :

```javascript
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import fr from './fr.json';
import en from './en.json';

const translations = { fr, en };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('fr');

  useEffect(() => {
    const saved = localStorage.getItem('waze-gabon-lang');
    if (saved && translations[saved]) setLang(saved);
  }, []);

  const switchLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('waze-gabon-lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLang, translations: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const { lang, switchLang, translations } = useContext(LanguageContext);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return { t, lang, switchLang };
}
```

**IMPORTANT** : Le `LanguageProvider` doit être un Client Component (`'use client'`).

### C. Fichiers à CRÉER

#### `lib/colors.js`
```javascript
const C = {
  green: "#009E49", yellow: "#FCD116", blue: "#3A75C4",
  waze: "#33CCFF", dark: "#0a1628", card: "#ffffff",
  bg: "#f5f7fa", text: "#1a1a2e", muted: "#64748b",
  accent: "#00b4d8", success: "#10b981", danger: "#ef4444",
  whatsapp: "#25D366", facebook: "#1877F2", telegram: "#0088cc",
};

export default C;
```

#### `lib/data.js`
Extraire les données statiques du prototype :
- `DEEP_LINKS` (6 destinations Libreville)
- `TUTORIALS` (6 tutoriels × 4 étapes — les IDs et icônes, pas le texte qui vient de i18n)
- `ARTICLES` (6 articles avec dates, sources, URLs, tags)
- `FAQS` (7 items — le texte vient de i18n)

```javascript
import C from './colors';

export const DEEP_LINKS = [
  { id: "centre-ville", lat: 0.3924, lon: 9.4536, icon: "🏙️" },
  { id: "aeroport", lat: 0.4584, lon: 9.4123, icon: "✈️" },
  { id: "stade", lat: 0.5244, lon: 9.4317, icon: "⚽" },
  { id: "marche", lat: 0.3988, lon: 9.4495, icon: "🛒" },
  { id: "hopital", lat: 0.4133, lon: 9.4478, icon: "🏥" },
  { id: "universite", lat: 0.3847, lon: 9.4419, icon: "🎓" },
];

export const TUTORIALS = [
  { id: "install", icon: "📲", color: C.waze, steps: 4 },
  { id: "profile", icon: "👤", color: C.green, steps: 4 },
  { id: "places", icon: "📍", color: C.blue, steps: 4 },
  { id: "navigate", icon: "🗺️", color: "#e85d04", steps: 4 },
  { id: "report", icon: "⚠️", color: C.danger, steps: 4 },
  { id: "editor", icon: "✏️", color: "#7c3aed", steps: 4 },
];

export const ARTICLES = [
  { id: 1, date: "Déc 2025", source: "Blog Google/Waze", url: "https://blog.google/waze/conversational-reporting-waze/", tag: "Nouveau" },
  { id: 2, date: "Nov 2025", source: "Blog Google", url: "https://blog.google/products-and-platforms/products/maps/maps-waze-new-features-information-on-the-go/", tag: "Sécurité" },
  { id: 3, date: "Nov 2025", source: "Blog Google", url: "https://blog.google/products-and-platforms/products/maps/maps-waze-new-features-information-on-the-go/", tag: "Pratique" },
  { id: 4, date: "Août 2025", source: "Waze Discuss", url: "https://www.waze.com/discuss/t/august-2025-office-hours-waze-insight/387489", tag: "Innovation" },
  { id: 5, date: "Mars 2025", source: "BMWBLOG", url: "https://www.bmwblog.com/2025/03/01/waze-instrument-cluster-carplay-android-auto-update/", tag: "CarPlay" },
  { id: 6, date: "Jan 2025", source: "Waze Community", url: "https://www.waze.com/discuss/t/the-january-2025-newsletter-has-landed/364338", tag: "Éditeurs" },
];

export const FAQ_COUNT = 7;
export const CONTRIBUTION_STEPS = 4;
```

Les titres et descriptions de chaque article, tutoriel et FAQ viennent des clés i18n (déjà existantes dans fr.json et en.json).

---

## ÉTAPE 4 : LAYOUT RACINE (`app/layout.js`)

C'est le fichier le plus important pour le SEO. Il définit les metadata globales.

```javascript
import { LanguageProvider } from '@/lib/i18n';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://waze-gabon-club.vercel.app'),
  title: {
    default: 'Waze Gabon Club — La communauté Waze du Gabon 🇬🇦',
    template: '%s | Waze Gabon Club',
  },
  description: 'Rejoignez la première communauté Waze du Gabon. Tutoriels, carte live de Libreville, signalements en temps réel et entraide entre conducteurs gabonais.',
  keywords: [
    'Waze', 'Gabon', 'Libreville', 'navigation', 'GPS', 'trafic',
    'embouteillage', 'communauté', 'conducteur', 'carte', 'itinéraire',
    'Waze Gabon', 'Waze Libreville', 'circulation Libreville',
    'application GPS Gabon', 'trafic Libreville',
  ],
  authors: [{ name: 'Waze Gabon Club' }],
  creator: 'Waze Gabon Club',
  publisher: 'Waze Gabon Club',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Waze Gabon Club — Conduisez plus malin au Gabon 🇬🇦',
    description: 'La première communauté Waze du Gabon. Tutoriels, carte live, alertes trafic et entraide.',
    url: 'https://waze-gabon-club.vercel.app',
    siteName: 'Waze Gabon Club',
    locale: 'fr_GA',
    type: 'website',
    // image à ajouter plus tard
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waze Gabon Club — Conduisez plus malin au Gabon 🇬🇦',
    description: 'La première communauté Waze du Gabon.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    // apple: '/icons/apple-touch-icon.png', — à ajouter plus tard
  },
};

export const viewport = {
  themeColor: '#009E49',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
```

**Pourquoi c'est crucial** : Next.js génère ces metadata côté serveur. Google verra un `<title>`, une `<meta description>`, des Open Graph tags, etc. C'était impossible avec Vite + React SPA.

---

## ÉTAPE 5 : STYLES GLOBAUX (`app/globals.css`)

Transférer les styles qui étaient injectés via `useEffect` dans le prototype vers un vrai fichier CSS :

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,400&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

/* Reset */
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: 'DM Sans', sans-serif;
  background: #f5f7fa;
  color: #1a1a2e;
  overflow-x: hidden;
}

/* Typographie */
.heading { font-family: 'Outfit', sans-serif; }

/* Animations */
@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

.anim-up { animation: fadeUp .7s ease-out both; }
.anim-up-1 { animation: fadeUp .7s ease-out .1s both; }
.anim-up-2 { animation: fadeUp .7s ease-out .2s both; }
.anim-up-3 { animation: fadeUp .7s ease-out .3s both; }

/* Composants */
.card-lift {
  transition: transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s cubic-bezier(.4,0,.2,1);
}
.card-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,.12);
}

.gradient-text {
  background: linear-gradient(135deg, #33CCFF, #009E49);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.flag-stripe {
  height: 4px;
  background: linear-gradient(90deg, #009E49 33%, #FCD116 33% 66%, #3A75C4 66%);
}

/* Boutons Waze */
.waze-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: 50px; font-weight: 600;
  text-decoration: none; font-size: 15px; border: none; cursor: pointer;
  transition: all .3s ease; font-family: 'DM Sans', sans-serif;
}
.waze-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.15); }
.waze-btn-primary { background: linear-gradient(135deg, #33CCFF, #3A75C4); color: #fff; }
.waze-btn-green { background: linear-gradient(135deg, #009E49, #00c853); color: #fff; }
.waze-btn-outline { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,.3); }
.waze-btn-outline:hover { background: rgba(255,255,255,.1); }
.waze-btn-whatsapp { background: #25D366; color: #fff; }
.waze-btn-facebook { background: #1877F2; color: #fff; }
.waze-btn-telegram { background: #0088cc; color: #fff; }

/* Badges */
.section-badge {
  display: inline-block; padding: 6px 18px; border-radius: 20px;
  font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  margin-bottom: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .hide-mobile { display: none !important; }
  .show-mobile { display: flex !important; }
}
@media (min-width: 769px) {
  .show-mobile { display: none !important; }
}
```

Plus besoin d'injecter les styles via JavaScript. Next.js importe le CSS nativement dans `layout.js`.

---

## ÉTAPE 6 : PAGE PRINCIPALE (`app/page.js`)

La page d'accueil assemble toutes les sections. C'est un **Server Component** par défaut, avec les sections interactives marquées `'use client'`.

```javascript
import FLAGS from '@/lib/flags';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Download from '@/components/Download';
import Tutorials from '@/components/Tutorials';
import LiveMap from '@/components/LiveMap';
import Community from '@/components/Community';
import Articles from '@/components/Articles';
import FAQ from '@/components/FAQ';
import Privacy from '@/components/Privacy';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import RegisterModal from '@/components/RegisterModal';
import DebugPanel from '@/components/DebugPanel';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navigation />
      {FLAGS.hero && <Hero />}
      {FLAGS.features && <Features />}
      {FLAGS.download && <Download />}
      {FLAGS.tutorials && <Tutorials />}
      {FLAGS.livemap && <LiveMap />}
      {FLAGS.community && <Community />}
      {FLAGS.articles && <Articles />}
      {FLAGS.faq && <FAQ />}
      {FLAGS.privacySection && <Privacy />}
      {FLAGS.footer && <Footer />}
      {FLAGS.floatingWhatsapp && <FloatingWhatsApp />}
      {FLAGS.registerModal && <RegisterModal />}
      <DebugPanel />
    </div>
  );
}
```

---

## ÉTAPE 7 : COMPOSANTS (Server vs Client)

### Règle de base

- **Server Component** (par défaut) : pas de `useState`, pas de `useEffect`, pas de `onClick`. Le HTML est rendu côté serveur → Google le voit.
- **Client Component** (`'use client'` en haut du fichier) : nécessaire pour l'interactivité.

### Classification

| Composant | Type | Pourquoi |
|-----------|------|----------|
| Navigation | Client | scroll tracking, hamburger state, modal trigger |
| Hero | Client | scroll animations, particules |
| Features | Server | contenu statique, pas d'interactivité |
| Download | Server | contenu statique, liens uniquement |
| Tutorials | Client | accordéon (useState) |
| LiveMap | Client | iframe chargement dynamique |
| Community | Server | contenu statique, liens uniquement |
| Articles | Server | contenu statique, liens uniquement |
| FAQ | Client | accordéon (useState) |
| Privacy | Server | contenu statique |
| Footer | Server | contenu statique, liens uniquement |
| FloatingWhatsApp | Server | lien simple, animation CSS pure |
| RegisterModal | Client | formulaire, état, validation |
| DebugPanel | Client | URL params, état |
| LanguageSwitcher | Client | état de la langue |

**IMPORTANT pour le SEO** : Les Server Components (Features, Download, Community, Articles, Footer, Privacy) rendent leur HTML côté serveur. Google voit leur contenu directement. C'est l'avantage principal de la migration.

**IMPORTANT pour i18n et Server Components** : Les Server Components ne peuvent pas utiliser `useTranslation()` directement (c'est un hook client). Deux options :

**Option A (recommandée pour V1)** : Marquer tous les composants qui utilisent `t()` comme `'use client'`. Simple, fonctionnel. Le SEO est assuré par les metadata dans layout.js + le contenu initial rendu par Next.js même pour les client components (ils sont pre-rendered côté serveur au premier rendu).

**Option B (futur)** : Implémenter un système i18n côté serveur avec `next-intl` ou similaire. Plus complexe, à faire en V2 si nécessaire.

**Choisis Option A** pour cette migration. C'est le chemin le plus rapide et le SEO est assuré par les metadata SSR.

---

## ÉTAPE 8 : HEADERS DE SÉCURITÉ (`next.config.js`)

Remplacer `vercel.json` par la config Next.js native :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

Le fichier `vercel.json` n'est plus nécessaire pour les headers (mais peut être gardé pour d'autres configs Vercel si besoin).

---

## ÉTAPE 9 : PWA

### `public/manifest.json`
Copier depuis l'ancien projet. Aucun changement nécessaire.

### Service Worker
Next.js ne gère pas nativement les service workers. Deux options :

**Option A (simple)** : Copier `sw.js` dans `public/` et l'enregistrer via un script dans `layout.js` :

```javascript
// Dans layout.js, ajouter un composant client pour l'enregistrement SW
```

Créer `components/ServiceWorkerRegister.js` :
```javascript
'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);
  return null;
}
```

Ajouter `<ServiceWorkerRegister />` dans `layout.js`.

**Option B (futur)** : Utiliser `next-pwa`. Trop lourd pour V1.

**Choisis Option A.**

---

## ÉTAPE 10 : MIGRATION DU CONTENU

Le contenu est dans les composants. Chaque composant de `components/` doit :

1. Importer `useTranslation` de `@/lib/i18n`
2. Importer `C` de `@/lib/colors`
3. Importer les données de `@/lib/data` si nécessaire
4. Importer `externalLinkProps` de `@/utils/externalLink`
5. Importer les liens de `@/lib/config`
6. Reproduire le design exact du prototype (couleurs, espacements, animations)

**Le prototype de référence est dans l'ancien projet** : `waze-gabon-club/waze-gabon-club-v2.jsx`
**L'implémentation Phase 4 est dans** : `waze-gabon-club/src/App.jsx`

Utiliser App.jsx de l'ancien projet comme base pour chaque composant. Découper les sections du fichier monolithique en composants individuels.

---

## ÉTAPE 11 : VÉRIFICATION

```bash
# 1. Le projet démarre sans erreur
npm run dev
# → Ouvrir http://localhost:3000

# 2. Build de production
npm run build
# → Vérifier pas d'erreur

# 3. Taille du build
ls -la .next/static/chunks/ | head -20

# 4. SEO — Vérifier le HTML source
curl -s http://localhost:3000 | head -50
# → Doit contenir <title>, <meta description>, <meta og:title>, etc.
# → Doit contenir du VRAI contenu HTML (pas juste <div id="__next">)

# 5. Vérifier le rendu
# → Toutes les sections visibles (flags true)
# → FR/EN fonctionne
# → Accordéons fonctionnent
# → Liens externes s'ouvrent
# → ?debug=flags affiche le panneau

# 6. Compter les clés i18n
echo "FR: $(grep -c ':' lib/i18n/fr.json)"
echo "EN: $(grep -c ':' lib/i18n/en.json)"
# → 259 chacun

# 7. Vérifier les flags
grep -E '^\s+\w+:' lib/flags.js
```

---

## ÉTAPE 12 : GIT

```bash
# Initialiser le repo
git init
git checkout -b main
git add .
git commit -m "feat: migrate to Next.js App Router — complete site"

# Créer develop
git checkout -b develop
git push origin main develop
```

---

## RAPPORT DE MIGRATION

À la fin, afficher :

```
═══════════════════════════════════════════════════
MIGRATION VITE → NEXT.JS — RAPPORT
═══════════════════════════════════════════════════

Ancien stack : Vite 7 + React 19 (SPA)
Nouveau stack : Next.js 15 + React 19 (SSR/SSG)

Contenu migré :
- Clés i18n : [X] FR + [X] EN
- Composants : [X] (dont [Y] Server, [Z] Client)
- Feature flags : 14 (identiques)
- Documents SAFER : 11 fichiers dans /docs/

SEO :
- <title> présent dans le HTML source : ✅ / ❌
- <meta description> présent : ✅ / ❌
- Open Graph tags présents : ✅ / ❌
- Contenu visible dans le HTML source : ✅ / ❌

Build :
- npm run build : ✅ / erreur
- Taille : [X] KB

Fonctionnel :
- FR/EN : ✅ / ❌
- Accordéons : ✅ / ❌
- Liens externes : ✅ / ❌
- Debug panel : ✅ / ❌
- PWA manifest : ✅ / ❌

Prochaines étapes :
1. Connecter le nouveau repo à Vercel
2. Vérifier le déploiement
3. Exécuter la Phase 6 (Rollback Plan) sur le nouveau projet
═══════════════════════════════════════════════════
```

---

## NOTES DU CONSULTANT

> **De Claude (Opus) pour Claude Code :**
>
> Cette migration est une correction architecturale, pas une refonte.
> Le design ne change PAS. Le contenu ne change PAS. Les flags ne changent PAS.
> Seule la fondation change : Vite → Next.js.
>
> Le gain SEO est immédiat : Google verra du vrai HTML au lieu d'un div vide.
> Les metadata (title, description, Open Graph) seront dans le HTML source.
> Quand quelqu'un partage le site sur WhatsApp ou Facebook, l'aperçu
> affichera le titre et la description au lieu d'une page vide.
>
> Points d'attention :
> - Ne pas se perdre dans l'optimisation Server/Client — Option A (tout client
>   pour les composants i18n) est parfaitement acceptable pour V1
> - Les Google Fonts doivent idéalement utiliser next/font — mais l'import CSS
>   fonctionne aussi et c'est plus simple pour la migration
> - Le service worker dans public/ fonctionne tel quel avec Next.js
> - Le build Next.js sera un peu plus gros que Vite — c'est normal et attendu
>
> L'ancien projet `waze-gabon-club/` reste intact comme référence.
> Le nouveau projet est `waze-gabon-club-next/`.
> Michael pourra supprimer l'ancien quand il sera satisfait du nouveau.

---

*SAFER METHOD™ — Migration Vite → Next.js*
*La bonne fondation pour un site qui doit être trouvé.*
