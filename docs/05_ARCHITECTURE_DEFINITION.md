# 05 — Architecture Definition

> SAFER METHOD™ — Phase 1 — Architecture Definition
> Dernière mise à jour : 26 février 2026

---

## 1. Schéma d'architecture validé

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
│  │     React 19 + Vite 7 (SPA)      │  │
│  │                                   │  │
│  │  index.html (shell + meta + SW)   │  │
│  │  src/                             │  │
│  │   ├── App.jsx (composant)        │  │
│  │   ├── main.jsx (entry point)     │  │
│  │   ├── config.js (liens externes) │  │
│  │   └── i18n/                      │  │
│  │       ├── index.jsx (provider)   │  │
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
    ┌──────────────┼──────────────┬──────────────┐
    ▼              ▼              ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Waze    │ │  Waze    │ │  Google  │ │ Formspree│
│  iFrame  │ │  Deep    │ │  Fonts   │ │ (forms)  │
│  (carte  │ │  Links   │ │  CDN     │ │          │
│  live)   │ │  (nav)   │ │          │ │          │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

### Changements par rapport à la proposition initiale (04_)

| Élément | Proposition (04_) | Réalité (05_) | Raison |
|---------|-------------------|---------------|--------|
| `src/i18n/index.js` | `.js` | `.jsx` | Le fichier contient du JSX (`<LanguageContext.Provider>`), Vite nécessite l'extension `.jsx` |
| `src/config.js` | Non mentionné | Ajouté | Centralise tous les liens externes (WhatsApp, Telegram, Facebook, Formspree, Waze) |
| Telegram | Non prévu | Ajouté | Canal broadcast pour alertes trafic structurées (complément au groupe WhatsApp) |
| Formspree | Non prévu | Ajouté | Service gratuit pour recevoir les inscriptions par email (pas de backend) |
| React | ^18 | ^19.2.0 | Vite 7 scaffold avec React 19 par défaut |
| Vite | ^6 | ^7.3.1 | Dernière version stable |
| `eslint.config.js` | Non mentionné | Inclus | Fourni par le scaffold Vite, utile pour `npm run lint` |

---

## 2. Arbre des fichiers réel

```
waze-gabon-club/
├── public/
│   ├── favicon.ico              # Placeholder (carré vert 32×32)
│   ├── icon-192.png             # Placeholder PWA (carré vert 192×192)
│   ├── icon-512.png             # Placeholder PWA (carré vert 512×512)
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service Worker (cache-first + network-first)
│
├── src/
│   ├── App.jsx                  # Shell vide (Phase 1) — contenu ajouté en Phase 4
│   ├── config.js                # Liens externes et endpoints (WhatsApp, Telegram, etc.)
│   ├── main.jsx                 # Entry point React — LanguageProvider wraps App
│   └── i18n/
│       ├── index.jsx            # LanguageProvider, useTranslation hook, detectInitialLang
│       ├── fr.json              # Traductions françaises complètes (~120 clés)
│       └── en.json              # Traductions anglaises complètes (~120 clés)
│
├── index.html                   # HTML racine (meta, OG, PWA, Google Fonts, SW registration)
├── package.json                 # Dépendances et scripts
├── package-lock.json            # Lockfile npm
├── vite.config.js               # Config Vite minimale (React plugin)
├── eslint.config.js             # Config ESLint (fournie par scaffold Vite)
├── .gitignore                   # Exclusions Git (node_modules, dist, logs, IDE)
│
├── docs/                        # Documentation SAFER METHOD™
│   ├── 00_PROJECT_SUMMARY.md    # Phase 0 — Résumé projet
│   ├── 01_RISK_MATRIX.md        # Phase 0 — Matrice des risques
│   ├── 02_CONSTRAINTS.md        # Phase 0 — Contraintes
│   ├── 03_ENVIRONMENTS.md       # Phase 0 — Environnements
│   ├── 04_INITIAL_ARCHITECTURE_PROPOSAL.md  # Phase 0 — Proposition initiale
│   ├── 05_ARCHITECTURE_DEFINITION.md        # Phase 1 — CE DOCUMENT
│   └── SAFER-PHASE-1-ARCHITECTURE.md        # Directives Phase 1
│
├── CLAUDE.md                    # Guide pour Claude Code
├── WAZE-GABON-CLUB-BRIEF.md     # Brief projet (référence)
└── waze-gabon-club-v2.jsx       # Prototype JSX (référence visuelle uniquement)
```

---

## 3. Dépendances installées

### Production (2 packages)

| Package | Version | Rôle |
|---------|---------|------|
| `react` | ^19.2.0 | Librairie UI |
| `react-dom` | ^19.2.0 | Rendu DOM |

### Développement (8 packages)

| Package | Version | Rôle |
|---------|---------|------|
| `vite` | ^7.3.1 | Bundler et dev server |
| `@vitejs/plugin-react` | ^5.1.1 | Support JSX/React dans Vite |
| `eslint` | ^9.39.1 | Linter JavaScript |
| `@eslint/js` | ^9.39.1 | Config ESLint de base |
| `eslint-plugin-react-hooks` | ^7.0.1 | Règles pour les hooks React |
| `eslint-plugin-react-refresh` | ^0.4.24 | Support React Fast Refresh |
| `globals` | ^16.5.0 | Variables globales pour ESLint |
| `@types/react` | ^19.2.7 | Types TypeScript pour l'éditeur |
| `@types/react-dom` | ^19.2.3 | Types TypeScript pour l'éditeur |

### Bundle de production

| Métrique | Valeur |
|----------|--------|
| JS total (gzip) | **69.50 KB** |
| HTML | 1.72 KB (0.80 KB gzip) |
| Taille dist/ | 244 KB |
| Temps de build | ~400ms |

**69.50 KB gzip < 150 KB objectif** — largement sous la cible.

---

## 4. Configuration Vite

```javascript
// vite.config.js — Configuration minimale
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

- **Pas de proxy** — Pas de backend
- **Pas de SSR** — SPA client-side uniquement
- **Build output** — `dist/` (défaut Vite)
- **Dev server** — `localhost:5173` (démarrage ~100ms)
- **Les fichiers dans `public/`** sont copiés tels quels dans `dist/` (sw.js, manifest.json, icônes)

---

## 5. Stratégie i18n

### Architecture

```
src/i18n/
├── index.jsx    # LanguageProvider (React Context) + useTranslation hook
├── fr.json      # ~120 clés de traduction en français
└── en.json      # ~120 clés de traduction en anglais
```

### Fonctionnement

1. **`LanguageProvider`** — Wraps l'app dans `main.jsx`. Fournit `lang`, `setLang(newLang)`, `t(key)` via React Context.

2. **Détection initiale** (dans cet ordre) :
   - `localStorage.getItem("lang")` — choix précédent de l'utilisateur
   - `navigator.language` — langue du navigateur (si `fr` → français, sinon anglais)
   - Fallback → `"fr"`

3. **Changement de langue** (`setLang`) :
   - Met à jour le state React → re-render immédiat
   - Persiste dans `localStorage`
   - Met à jour `document.documentElement.lang` (attribut `<html lang="...">`)

4. **Fonction `t(key)`** :
   - Cherche la clé dans le JSON de la langue courante
   - Si non trouvée, retourne la clé elle-même (visible pour debug)

### Structure des clés

Convention `section.element` ou `section.sous-section.element` :

```
nav.home, nav.features, nav.register
hero.badge, hero.title.line1, hero.cta.whatsapp
tutorials.install.step1.title, tutorials.install.step1.desc
faq.q1.question, faq.q1.answer
```

### Ajouter une nouvelle langue

1. Créer `src/i18n/xx.json` avec les mêmes clés que `fr.json`
2. Importer le fichier dans `src/i18n/index.jsx` et l'ajouter à `translations`
3. Ajouter le code langue à `SUPPORTED_LANGS`
4. Mettre à jour le sélecteur de langue dans la navigation

### Ce qui n'est pas traduit

- Noms propres (Libreville, Waze, Airtel, Moov Africa)
- URLs et deep links (dans `config.js`)
- Coordonnées GPS
- Contenu de l'iFrame Waze (géré par Waze)

---

## 6. Stratégie PWA (Service Worker)

### Cache versionné

Nom du cache : `waze-gabon-v1` — incrémenter à chaque déploiement significatif.

### Pré-cache à l'installation

```
/, /manifest.json, /icon-192.png, /icon-512.png
```

### Stratégies de cache par type de ressource

| Ressource | Stratégie | Raison |
|-----------|-----------|--------|
| Navigation (HTML) | Network-first, fallback cache | Toujours servir la dernière version si possible |
| JS/CSS bundlés (`/assets/*.[hash].*`) | Cache-first | Fichiers immutables (hash dans le nom) |
| Google Fonts (CSS + woff2) | Cache-first | Polices stables, économise la bande passante |
| Tout le reste | Network-first, fallback cache | Comportement sûr par défaut |

### Domaines jamais cachés

```
embed.waze.com, waze.com, apps.apple.com, play.google.com, formspree.io
```

### Cycle de vie

- **Install** : pré-cache les assets statiques, `skipWaiting()` pour activation immédiate
- **Activate** : supprime les anciens caches (noms différents de `CACHE_NAME`), `clients.claim()` pour contrôler toutes les pages
- **Fetch** : applique la stratégie selon le type de requête

### Offline

- Les tutoriels, FAQ, features sont dans le bundle JS → accessibles offline automatiquement
- La carte live affiche un message offline (`map.offlineMessage`)
- Les deep links Waze restent cliquables (ouvrent l'app native)

---

## 7. Guide de démarrage rapide

```bash
# Cloner le projet
git clone <repo-url>
cd waze-gabon

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev        # → http://localhost:5173

# Build de production
npm run build      # → dist/

# Preview du build de production
npm run preview    # → http://localhost:4173

# Linter
npm run lint
```

### Scripts disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| `dev` | `vite` | Dev server avec HMR |
| `build` | `vite build` | Build de production dans `dist/` |
| `preview` | `vite preview` | Servir le build localement |
| `lint` | `eslint .` | Vérifier le code avec ESLint |

---

## 8. Checklist de validation Phase 1

- [x] `npm run dev` démarre sans erreur (~100ms)
- [x] `npm run build` produit un bundle dans `dist/` (~400ms)
- [x] Le bundle total est 69.50 KB gzipped (< 150 KB objectif)
- [x] Le sélecteur de langue FR/EN fonctionne (bouton dans le shell)
- [x] `localStorage` persiste le choix de langue (clé `lang`)
- [x] `document.documentElement.lang` change avec la langue
- [x] Le manifest PWA est dans `dist/manifest.json`
- [x] Le service worker est dans `dist/sw.js`
- [x] Les icônes PWA sont dans `dist/` (192px, 512px)
- [x] Les meta tags (OG, description, theme-color) sont dans `index.html`
- [x] Google Fonts (Outfit + DM Sans) sont chargées dans `index.html`
- [x] Le service worker s'enregistre dans `index.html`
- [x] `src/config.js` centralise tous les liens externes
- [x] Les fichiers i18n contiennent ~120 clés FR et EN complètes
- [x] Le prototype `waze-gabon-club-v2.jsx` reste à la racine (non copié dans `src/`)
- [x] Pas d'erreur dans la console au build

---

*SAFER METHOD™ — Phase 1 — Architecture Definition*
*Le code de cette phase est du scaffolding, pas de l'implémentation.*
