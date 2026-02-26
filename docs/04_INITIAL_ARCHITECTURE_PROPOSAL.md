# 04 — Initial Architecture Proposal

> SAFER METHOD™ — Phase 0 — Discovery & Context
> Dernière mise à jour : 26 février 2026

---

## Vue d'ensemble

```
┌─────────────────────────────────────────┐
│            UTILISATEUR                  │
│   (Mobile / Desktop / PWA installée)    │
│                                         │
│   Langue : FR (défaut) ou EN            │
│   Choix persisté dans localStorage      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│          VERCEL (Hébergement)           │
│          CDN + HTTPS automatique        │
│  ┌───────────────────────────────────┐  │
│  │     React App (Vite — SPA)       │  │
│  │                                   │  │
│  │  index.html                       │  │
│  │  src/                             │  │
│  │   ├── App.jsx (composant)        │  │
│  │   ├── main.jsx (entry point)     │  │
│  │   └── i18n/                      │  │
│  │       ├── fr.json                │  │
│  │       └── en.json                │  │
│  │  public/                          │  │
│  │   ├── manifest.json (PWA)        │  │
│  │   ├── sw.js (Service Worker)     │  │
│  │   ├── icon-192.png               │  │
│  │   └── icon-512.png               │  │
│  └───────────────────────────────────┘  │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┼──────────────┐
        ▼          ▼              ▼
  ┌──────────┐ ┌──────────┐ ┌──────────────┐
  │  Waze    │ │  Waze    │ │  Google      │
  │  iFrame  │ │  Deep    │ │  Fonts CDN   │
  │  (carte  │ │  Links   │ │  (Outfit,    │
  │  live)   │ │  (nav)   │ │  DM Sans)    │
  └──────────┘ └──────────┘ └──────────────┘
  Requiert      Ouvre l'app   Requiert
  internet      Waze ou le    internet
                store         (cacheable)
```

---

## Structure des fichiers

```
waze-gabon-club/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker
│   ├── icon-192.png           # Icône PWA 192×192
│   ├── icon-512.png           # Icône PWA 512×512
│   └── favicon.ico            # Favicon navigateur
│
├── src/
│   ├── main.jsx               # Point d'entrée React (ReactDOM.createRoot)
│   ├── App.jsx                # Composant principal (issu de waze-gabon-club-v2.jsx)
│   │
│   └── i18n/
│       ├── index.js           # Logique i18n : hook useTranslation, contexte, helpers
│       ├── fr.json            # Traductions françaises (langue de référence)
│       └── en.json            # Traductions anglaises
│
├── index.html                 # HTML racine (charge main.jsx, lien manifest, meta tags)
├── package.json               # Dépendances et scripts
├── vite.config.js             # Configuration Vite
├── .gitignore                 # Exclusions Git
│
├── docs/                      # Documentation SAFER METHOD™
│   ├── 00_PROJECT_SUMMARY.md
│   ├── 01_RISK_MATRIX.md
│   ├── 02_CONSTRAINTS.md
│   ├── 03_ENVIRONMENTS.md
│   └── 04_INITIAL_ARCHITECTURE_PROPOSAL.md
│
├── CLAUDE.md                  # Guide pour Claude Code
├── WAZE-GABON-CLUB-BRIEF.md   # Brief projet (référence)
└── waze-gabon-club-v2.jsx     # Prototype JSX (référence visuelle, pas en production)
```

### Décisions structurelles

| Décision | Justification |
|----------|---------------|
| **Pas de dossier `components/`** | Le site est un composant unique. Découper en sous-composants uniquement si `App.jsx` dépasse ~1500 lignes ou si des sections deviennent réutilisables. |
| **`i18n/` dans `src/`** | Les traductions sont du code applicatif, pas des assets publics. Elles sont importées et tree-shakées par Vite. |
| **`sw.js` dans `public/`** | Le service worker doit être servi depuis la racine pour contrôler tout le scope `/`. Il n'est pas bundlé par Vite. |
| **Pas de dossier `assets/`** | Pas d'images locales en V1 (icônes emoji, polices CDN). Les icônes PWA sont dans `public/`. |

---

## Dépendances npm

### Production

| Package | Version | Rôle |
|---------|---------|------|
| `react` | ^18 | Librairie UI |
| `react-dom` | ^18 | Rendu DOM |

**C'est tout.** Pas de router, pas de state manager, pas de librairie CSS, pas de librairie i18n tierce.

### Développement

| Package | Version | Rôle |
|---------|---------|------|
| `vite` | ^6 | Bundler / dev server |
| `@vitejs/plugin-react` | ^4 | Support JSX dans Vite |

### Packages explicitement exclus

| Package | Raison de l'exclusion |
|---------|----------------------|
| `react-router-dom` | SPA single-page, pas de routing nécessaire |
| `react-i18next` / `i18next` | Trop lourd pour 2 langues. Solution custom légère suffisante. |
| `tailwindcss` | Le prototype utilise du CSS inline. Pas de refactoring CSS en V1. |
| `styled-components` / `emotion` | Même raison — CSS inline conservé du prototype. |
| `axios` | Pas d'appels API. |
| `redux` / `zustand` | État local avec `useState` suffisant. |

---

## Stratégie d'internationalisation (i18n)

### Approche : solution custom légère

Pas de librairie i18n tierce. Un hook React custom `useTranslation()` basé sur React Context.

### Architecture

```
src/i18n/
├── index.js       # LanguageProvider, useTranslation hook, helpers
├── fr.json        # { "hero.title": "Conduisez plus malin au Gabon", ... }
└── en.json        # { "hero.title": "Drive smarter in Gabon", ... }
```

### Fonctionnement

1. **`LanguageProvider`** — Contexte React qui expose la langue courante et la fonction `setLanguage`
2. **`useTranslation()`** — Hook qui retourne une fonction `t(key)` pour accéder aux traductions
3. **Fichiers JSON plats** — Clés en dot-notation (`"section.element"`), valeurs = chaînes traduites
4. **Persistance** — La langue choisie est stockée dans `localStorage` sous la clé `lang`
5. **Détection initiale** — Au premier chargement : vérifier `localStorage`, puis `navigator.language`, puis fallback `fr`
6. **Sélecteur** — Bouton FR/EN dans la barre de navigation

### Structure des clés de traduction

```json
{
  "nav.home": "Accueil",
  "nav.features": "Avantages",
  "nav.tutorials": "Tutoriels",
  "nav.map": "Carte Live",
  "nav.community": "Communauté",
  "nav.news": "Actualités",
  "nav.faq": "FAQ",
  "nav.register": "S'inscrire",

  "hero.badge": "La 1ère communauté Waze du Gabon",
  "hero.title": "Conduisez plus malin au Gabon",
  "hero.subtitle": "Rejoignez la communauté...",

  "tutorials.install.title": "Installer Waze",
  "tutorials.install.step1.title": "Téléchargez l'application",
  "tutorials.install.step1.desc": "Ouvrez l'App Store...",

  "faq.q1.question": "Waze est-il gratuit au Gabon ?",
  "faq.q1.answer": "Oui, Waze est 100% gratuit..."
}
```

### Stratégie URL

**Pas de préfixe URL (`/fr/`, `/en/`)** — La langue est gérée côté client via `localStorage`. Raisons :
- SPA sans routing — ajouter des routes juste pour la langue serait du over-engineering
- Pas de SEO multilingue nécessaire (pas de SSR, pas de sitemap)
- Simplifie le déploiement (une seule URL, pas de redirections)

### Extensibilité

Pour ajouter une nouvelle langue (ex: espagnol) :
1. Créer `src/i18n/es.json` avec les mêmes clés
2. Ajouter `"es"` à la liste des langues supportées dans `index.js`
3. Ajouter l'option au sélecteur de langue

### Ce qui n'est PAS traduit

- Les noms propres (Libreville, Waze, Airtel, Moov Africa)
- Les URLs et deep links
- Les coordonnées GPS
- Le contenu de l'iFrame Waze (géré par Waze)
- Les articles de blog (en français uniquement en V1 — les sources sont déjà en anglais, un lien vers l'original suffit)

---

## Stratégie de cache PWA (Service Worker)

### Ce qui est caché (offline disponible)

| Ressource | Stratégie | Raison |
|-----------|-----------|--------|
| `index.html` | Cache-first, revalidate en arrière-plan | Shell de l'app, doit charger instantanément |
| JS bundle (Vite output) | Cache-first (immutable, hash dans le nom) | Fichiers versionnés, ne changent jamais |
| Fichiers de traduction (fr.json, en.json) | Cache-first, revalidate | Contenu rarement modifié |
| Icônes PWA | Cache-first | Assets statiques |
| Google Fonts CSS + fichiers woff2 | Cache-first | Polices stables, économise de la bande passante |

### Ce qui n'est PAS caché

| Ressource | Raison |
|-----------|--------|
| iFrame Waze (`embed.waze.com`) | Données temps réel, requiert internet, iFrame cross-origin non cacheable |
| Deep Links Waze (`waze.com/ul?...`) | Ouvrent l'app Waze native, pas des ressources web |
| Liens externes (App Store, Google Play, blog) | Contenu tiers hors de notre contrôle |

### Fallback offline

Quand l'utilisateur est hors connexion :
- Les tutoriels, FAQ, features, et le contenu statique restent accessibles
- La section carte live affiche un message : "Carte indisponible hors connexion. Connectez-vous à internet pour voir le trafic en temps réel."
- Les deep links Waze restent cliquables (ils ouvrent l'app Waze qui a son propre mode offline)

---

## Points d'intégration externes

| Service | Type | URL | Auth | Fiabilité | Fallback |
|---------|------|-----|------|-----------|----------|
| **Waze iFrame** | Embed | `embed.waze.com/fr/iframe?...` | Aucune | Dépend de Google | Message "carte indisponible" |
| **Waze Deep Links** | Lien externe | `waze.com/ul?ll={lat},{lon}&navigate=yes` | Aucune | Stable (API publique documentée) | Redirige vers le store si app non installée |
| **Google Fonts** | CDN | `fonts.googleapis.com` | Aucune | Très stable | Polices système si CDN indisponible (cachées par le SW après premier chargement) |
| **App Store** | Lien externe | `apps.apple.com/app/...` | Aucune | Stable | Aucun (lien externe) |
| **Google Play** | Lien externe | `play.google.com/store/...` | Aucune | Stable | Aucun (lien externe) |

Aucune de ces intégrations ne nécessite de clé API, de token, ou d'authentification.

---

## Meta tags et SEO

Bien que le site soit un SPA (pas de SSR), les meta tags dans `index.html` sont importants pour le partage social (Open Graph) :

```
<title>Waze Gabon Club — La communauté Waze du Gabon</title>
<meta name="description" content="Rejoignez la première communauté Waze du Gabon. Tutoriels, carte live de Libreville, alertes trafic WhatsApp.">
<meta property="og:title" content="Waze Gabon Club">
<meta property="og:description" content="La 1ère communauté Waze du Gabon">
<meta property="og:image" content="/icon-512.png">
<meta property="og:type" content="website">
<meta name="theme-color" content="#009E49">
```

---

## Performance cible

| Métrique | Objectif | Raison |
|----------|----------|--------|
| **First Contentful Paint** | < 2s sur 3G | Utilisateurs sur réseau mobile gabonais |
| **Bundle JS total** | < 150 KB gzipped | Minimum de dépendances, CSS inline |
| **Lighthouse Performance** | > 80 | Seuil acceptable pour un SPA avec iFrame tiers |
| **Lighthouse PWA** | 100 | Manifest + SW + HTTPS + icônes = score parfait |
| **Time to Interactive** | < 3s sur 3G | Pas de data fetching, tout est statique côté client |

---

## Ce qui n'est PAS dans cette architecture (et pourquoi)

| Élément absent | Raison |
|----------------|--------|
| **SSR / Next.js** | Over-engineering pour un SPA statique sans SEO dynamique |
| **Base de données** | Pas de données persistantes en V1 |
| **Authentication** | Pas de comptes utilisateurs |
| **API routes** | Pas de backend |
| **State management (Redux, Zustand)** | `useState` suffit pour l'état local |
| **CSS modules / Tailwind** | CSS inline conservé du prototype, cohérent et fonctionnel |
| **Testing framework** | À ajouter en Phase 2 si le projet grandit |
| **CI/CD custom** | Vercel auto-deploy suffit (pas de GitHub Actions) |
| **Analytics** | Pas de tracking en V1 (pas de backend, respect de la vie privée) |
| **Notifications push** | Nécessiterait un backend (push server). Hors scope V1. |

---

*SAFER METHOD™ — Phase 0 — Discovery & Context*
