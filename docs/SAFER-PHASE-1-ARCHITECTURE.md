# 🏗 SAFER METHOD™ — PHASE 1 : ARCHITECTURE DEFINITION

> **Projet** : Waze Gabon Club
> **Phase** : 1 — Architecture Definition
> **Statut** : EN COURS
> **Phase précédente** : Phase 0 — Discovery ✅ VALIDÉE
> **Règle** : AUCUNE implémentation de features. Uniquement le scaffolding, la structure, et la documentation d'architecture.

---

## DIRECTIVE POUR CLAUDE CODE

Tu opères sous le framework **SAFER METHOD™** en tant que Senior Software Architect.

Tu es en **Phase 1 — Architecture Definition**. La Phase 0 (Discovery) a été validée. Les livrables sont dans `/docs/`.

**Tu dois maintenant :**
1. Lire et respecter les documents Phase 0 (`/docs/00_` à `/docs/04_`)
2. Créer la structure réelle du projet (scaffolding)
3. Configurer les outils (Vite, React, PWA)
4. Implémenter le système i18n (structure uniquement, pas le contenu complet)
5. Produire la documentation d'architecture définitive

**Tu peux écrire du code** dans cette phase, mais UNIQUEMENT pour :
- Le scaffolding du projet (package.json, vite.config.js, index.html)
- La structure des fichiers et dossiers
- Le système i18n (LanguageProvider, hook, fichiers JSON de structure)
- Le manifest PWA et le service worker de base
- Le point d'entrée React (main.jsx) avec le provider i18n
- Un App.jsx VIDE (shell uniquement, pas de contenu)

**Tu ne dois PAS :**
- Implémenter les sections du site (hero, features, tutoriels, etc.)
- Copier le prototype `waze-gabon-club-v2.jsx` tel quel
- Ajouter du contenu visuel ou des styles
- Créer des composants UI

---

## LIVRABLES ATTENDUS — PHASE 1

### A. Scaffolding du projet

Crée le projet Vite + React avec la structure définie dans `04_INITIAL_ARCHITECTURE_PROPOSAL.md` :

```bash
# Initialise le projet (si pas encore fait)
npm create vite@latest . -- --template react
```

Structure finale attendue :

```
waze-gabon-club/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── icon-192.png          # Placeholder — image à fournir plus tard
│   ├── icon-512.png          # Placeholder — image à fournir plus tard
│   └── favicon.ico           # Placeholder
│
├── src/
│   ├── main.jsx              # Point d'entrée avec LanguageProvider
│   ├── App.jsx               # Shell vide avec structure de base
│   ├── config.js             # Liens externes, endpoints (WhatsApp, Telegram, Facebook, Formspree, Waze)
│   │
│   └── i18n/
│       ├── index.js          # LanguageProvider, useTranslation hook
│       ├── fr.json           # Structure des clés FR (contenu minimal)
│       └── en.json           # Structure des clés EN (contenu minimal)
│
├── index.html                # HTML racine avec meta tags, manifest link
├── package.json
├── vite.config.js
├── .gitignore
│
├── docs/                     # Phase 0 (déjà existant)
│   ├── 00_PROJECT_SUMMARY.md
│   ├── 01_RISK_MATRIX.md
│   ├── 02_CONSTRAINTS.md
│   ├── 03_ENVIRONMENTS.md
│   ├── 04_INITIAL_ARCHITECTURE_PROPOSAL.md
│   └── 05_ARCHITECTURE_DEFINITION.md   ← NOUVEAU (livrable de cette phase)
│
├── CLAUDE.md
├── WAZE-GABON-CLUB-BRIEF.md
└── waze-gabon-club-v2.jsx    # Prototype (référence, pas en production)
```

### B. Configuration Vite (`vite.config.js`)

```javascript
// Configuration minimale
// - Plugin React
// - Pas de proxy, pas de SSR
// - Build output dans dist/
```

### C. HTML racine (`index.html`)

Doit inclure :
- `<meta charset="UTF-8">`
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- `<meta name="theme-color" content="#009E49">` (vert Gabon)
- `<meta name="description" content="...">`
- Open Graph tags (og:title, og:description, og:image, og:type)
- `<link rel="manifest" href="/manifest.json">`
- `<link rel="icon" href="/favicon.ico">`
- Enregistrement du service worker
- Lien vers le point d'entrée React

### D. Manifest PWA (`public/manifest.json`)

Respecter la spécification définie dans `04_INITIAL_ARCHITECTURE_PROPOSAL.md` :
- name: "Waze Gabon Club"
- short_name: "Waze Gabon"
- start_url: "/"
- display: "standalone"
- background_color: "#0a1628"
- theme_color: "#009E49"
- Icônes 192px et 512px

### E. Service Worker (`public/sw.js`)

Implémenter la stratégie de cache définie dans `04_INITIAL_ARCHITECTURE_PROPOSAL.md` :

**Cache-first (avec revalidation en arrière-plan) :**
- index.html (shell de l'app)
- Fichiers JS bundlés (hash dans le nom = immutable)
- Google Fonts (CSS + woff2)

**Network-first :**
- Tout le reste

**Non caché :**
- embed.waze.com (iFrame)
- waze.com/ul (deep links)
- Liens externes (App Store, Google Play, blog)

**Fallback offline :**
- Retourner la page cachée pour les requêtes de navigation
- Les tutoriels et FAQ sont dans le bundle JS = disponibles offline automatiquement

Nommer le cache avec un numéro de version : `waze-gabon-v1`

### F. Système i18n (`src/i18n/`)

#### `src/i18n/index.js`

Implémenter :

1. **`LanguageProvider`** — Composant React Context
   - State : `lang` (string : "fr" ou "en")
   - Initialisation : `localStorage.getItem("lang")` → `navigator.language.startsWith("fr") ? "fr" : "en"` → fallback `"fr"`
   - Fournit : `lang`, `setLang(newLang)`, `t(key)` 
   - Quand `setLang` est appelé : met à jour le state + `localStorage.setItem("lang", newLang)` + `document.documentElement.lang = newLang`

2. **`useTranslation()`** — Hook custom
   - Retourne `{ t, lang, setLang }`
   - `t(key)` : cherche la clé dans le fichier de la langue courante, retourne la clé elle-même si non trouvée (fallback visible pour debug)

3. **Support des langues** : liste configurable `["fr", "en"]` pour faciliter l'ajout futur

#### `src/i18n/fr.json` et `src/i18n/en.json`

Créer les fichiers avec la **structure complète des clés** mais un contenu **minimal** (juste assez pour tester le système). Le contenu complet sera ajouté en Phase 4.

Clés minimales requises pour validation :

```json
{
  "meta.title": "...",
  "meta.description": "...",

  "nav.home": "...",
  "nav.features": "...",
  "nav.tutorials": "...",
  "nav.map": "...",
  "nav.community": "...",
  "nav.news": "...",
  "nav.faq": "...",
  "nav.register": "...",
  "nav.langSwitch": "...",

  "hero.badge": "...",
  "hero.title.line1": "...",
  "hero.title.highlight1": "...",
  "hero.title.line2": "...",
  "hero.title.highlight2": "...",
  "hero.subtitle": "...",
  "hero.cta.tutorials": "...",
  "hero.cta.whatsapp": "...",
  "hero.cta.telegram": "...",
  "hero.cta.join": "...",
  "hero.stats.users": "...",
  "hero.stats.countries": "...",
  "hero.stats.free": "...",
  "hero.stats.realtime": "...",

  "features.badge": "...",
  "features.title": "...",
  "features.subtitle": "...",

  "download.badge": "...",
  "download.title": "...",

  "tutorials.badge": "...",
  "tutorials.title": "...",
  "tutorials.subtitle": "...",

  "map.badge": "...",
  "map.title": "...",
  "map.subtitle": "...",
  "map.navigate": "...",
  "map.openInWaze": "...",
  "map.offlineMessage": "...",
  "map.deepLinkHint": "...",

  "community.badge": "...",
  "community.title": "...",
  "community.whatsapp.title": "...",
  "community.whatsapp.desc": "...",
  "community.whatsapp.join": "...",
  "community.telegram.title": "...",
  "community.telegram.desc": "...",
  "community.telegram.join": "...",
  "community.facebook.title": "...",
  "community.facebook.desc": "...",
  "community.facebook.follow": "...",
  "community.editor.title": "...",
  "community.editor.desc": "...",
  "community.editor.open": "...",
  "community.steps.title": "...",

  "articles.badge": "...",
  "articles.title": "...",
  "articles.subtitle": "...",
  "articles.readMore": "...",
  "articles.calendar.title": "...",

  "faq.badge": "...",
  "faq.title": "...",

  "footer.description": "...",
  "footer.links.title": "...",
  "footer.download.title": "...",
  "footer.copyright": "...",
  "footer.trademark": "...",

  "register.title": "...",
  "register.subtitle": "...",
  "register.facebook": "...",
  "register.or": "...",
  "register.name": "...",
  "register.email": "...",
  "register.wazeUser": "...",
  "register.wazeUserOptional": "...",
  "register.submit": "...",
  "register.close": "...",
  "register.success.title": "...",
  "register.success.message": "..."
}
```

Remplir chaque valeur avec le texte approprié en français et en anglais.

### G. Point d'entrée (`src/main.jsx`)

```jsx
// Import React, ReactDOM
// Import LanguageProvider
// Import App
// Wrap App dans LanguageProvider
// Render dans #root
// Enregistrer le service worker
```

### H. App.jsx — Shell vide

Créer un `App.jsx` qui :
- Importe `useTranslation`
- Affiche un placeholder minimal : le titre du site, le sélecteur de langue FR/EN, et un message "Phase 1 — Architecture OK"
- Démontre que le système i18n fonctionne (changer de langue change le texte affiché)
- **PAS de sections du site, PAS de styles complexes, PAS de contenu**

Le but est de vérifier que :
1. Vite démarre correctement
2. React rend le composant
3. Le sélecteur de langue fonctionne
4. Le service worker s'enregistre
5. Le manifest PWA est détecté

### I. Documentation d'architecture (`docs/05_ARCHITECTURE_DEFINITION.md`)

Document final de cette phase contenant :

1. **Schéma d'architecture validé** (mis à jour depuis la proposition initiale si des changements ont été faits)
2. **Arbre des fichiers réel** du projet (pas la proposition, l'état réel)
3. **Dépendances installées** avec versions exactes
4. **Configuration Vite** documentée
5. **Stratégie i18n** — comment les traductions sont chargées, comment ajouter une langue
6. **Stratégie PWA** — comment le service worker fonctionne, comment le cache est géré
7. **Guide de démarrage rapide** :
   ```bash
   git clone <repo>
   cd waze-gabon-club
   npm install
   npm run dev      # → http://localhost:5173
   npm run build    # → dist/
   npm run preview  # → preview du build
   ```
8. **Checklist de validation Phase 1** :
   - [ ] `npm run dev` démarre sans erreur
   - [ ] Le sélecteur de langue FR/EN fonctionne
   - [ ] `localStorage` persiste le choix de langue
   - [ ] Le manifest PWA est détecté (DevTools > Application > Manifest)
   - [ ] Le service worker s'enregistre (DevTools > Application > Service Workers)
   - [ ] `npm run build` produit un bundle dans `dist/`
   - [ ] Le bundle total est < 150 KB gzipped
   - [ ] Pas d'erreur dans la console

---

## RÈGLES STRICTES PHASE 1

1. **Le prototype `waze-gabon-club-v2.jsx` est une RÉFÉRENCE VISUELLE UNIQUEMENT** — Ne pas le copier dans `src/`. Il reste à la racine comme documentation.
2. **App.jsx doit être un shell vide** — Le contenu sera ajouté en Phase 4 (Local Implementation)
3. **Les fichiers i18n doivent avoir la structure complète des clés** avec les vraies traductions — c'est le dictionnaire de référence
4. **Le service worker doit être fonctionnel** — Pas un placeholder vide
5. **Respecter les conventions Git** définies dans `03_ENVIRONMENTS.md`
6. **Initialiser Git** avec un premier commit sur la branche `main`, puis créer la branche `develop`
7. **Chaque fichier créé doit avoir un commentaire en-tête** expliquant son rôle

---

## VALIDATION

Une fois tous les livrables créés, exécute ces vérifications :

```bash
# 1. Le projet démarre
npm run dev

# 2. Le build fonctionne
npm run build

# 3. Vérifier la taille du bundle
du -sh dist/

# 4. Vérifier que le service worker est dans le build
ls dist/sw.js

# 5. Vérifier que le manifest est dans le build
cat dist/manifest.json
```

Puis affiche :

> "Phase 1 terminée. Le scaffolding est en place, le système i18n fonctionne, la PWA est configurée.
> Voici la checklist de validation : [liste]
> Souhaitez-vous valider pour passer à la Phase 2 — Security Model ?"

**Ne passe PAS à la Phase 2 sans validation explicite du fondateur.**

---

## STRATÉGIE COMMUNAUTAIRE : INSCRIPTION + ACCÈS DIRECT (Option A+C)

### Principe

Deux chemins coexistent sur le site :

**Chemin direct (Option C)** — Boutons visibles partout sur le site :
- 💬 **WhatsApp** — Groupe de discussion communautaire
- ✈️ **Telegram** — Canal broadcast (alertes trafic, actualités, pas de discussion)
- 📘 **Facebook** — Page publique (contenu éducatif, témoignages)

Ces boutons ne nécessitent aucune inscription. Un clic = l'utilisateur rejoint le canal. Zéro friction.

**Chemin inscription (Option A)** — Bouton "S'inscrire au Club" dans la nav :
- Ouvre un modal avec formulaire : nom, email, pseudo Waze (optionnel)
- Bouton "Continuer avec Facebook" (login social simplifié)
- À la soumission : écran de bienvenue 🎉 qui affiche les 3 liens (WhatsApp, Telegram, Facebook)
- Le formulaire envoie les données par email au fondateur via un service gratuit (Formspree ou EmailJS)
- **Pas de backend, pas de base de données**
- L'inscription n'est JAMAIS obligatoire pour accéder aux canaux

### Rôle de chaque canal

| Canal | Type | Rôle | Limite |
|-------|------|------|--------|
| **WhatsApp** | Groupe discussion | Alertes trafic temps réel, entraide, questions | 256 membres max par groupe |
| **Telegram** | Canal broadcast | Alertes structurées, actualités Waze, astuces (lecture seule) | Illimité |
| **Facebook** | Page publique | Vitrine, contenu éducatif, témoignages, SEO | Illimité |

### Impact sur les fichiers i18n

Ajouter ces clés aux fichiers de traduction :

```json
{
  "community.whatsapp.title": "...",
  "community.whatsapp.desc": "...",
  "community.whatsapp.join": "...",
  "community.telegram.title": "...",
  "community.telegram.desc": "...",
  "community.telegram.join": "...",
  "community.facebook.title": "...",
  "community.facebook.desc": "...",
  "community.facebook.follow": "..."
}
```

### Liens placeholder à prévoir

| Placeholder | Service |
|-------------|---------|
| `WHATSAPP_GROUP_LINK` | `https://chat.whatsapp.com/XXXXX` |
| `TELEGRAM_CHANNEL_LINK` | `https://t.me/wazeGabon` |
| `FACEBOOK_PAGE_LINK` | `https://facebook.com/WazeGabonClub` |
| `FORMSPREE_ENDPOINT` | `https://formspree.io/f/XXXXX` (ou EmailJS) |

Ces placeholders seront définis comme constantes dans un fichier de config (`src/config.js`) pour faciliter le remplacement.

### Fichier de configuration (`src/config.js`) — À CRÉER

```javascript
// Configuration externe — liens et endpoints
// Remplacer les valeurs avant le déploiement production

export const CONFIG = {
  links: {
    whatsapp: "https://chat.whatsapp.com/VOTRE_LIEN_ICI",
    telegram: "https://t.me/wazeGabon",
    facebook: "https://facebook.com/WazeGabonClub",
  },
  form: {
    // Formspree endpoint (gratuit, 50 soumissions/mois)
    // Créer un compte sur formspree.io et remplacer l'ID
    endpoint: "https://formspree.io/f/VOTRE_ID_ICI",
  },
  waze: {
    editorUrl: "https://www.waze.com/editor",
    blogUrl: "https://blog.google/waze/",
    forumUrl: "https://www.waze.com/discuss",
    appStoreUrl: "https://apps.apple.com/app/waze-navigation-live-traffic/id323229106",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.waze",
  },
  map: {
    iframeSrc: "https://embed.waze.com/fr/iframe?zoom=13&lat=0.3924&lon=9.4536&ct=livemap",
  },
};
```

---

## NOTES DU CONSULTANT

> **De Claude (Opus) pour Claude Code :**
>
> Le fondateur (Michael) valorise la discipline et la simplicité. Ne sur-ingénierie pas.
> Si un choix te semble plus simple que ce qui est décrit ici, propose-le — mais documente pourquoi.
>
> Le prototype JSX est un guide visuel riche mais dense (~750 lignes). En Phase 4, on le découpera
> intelligemment. Pour l'instant, concentre-toi sur les fondations : si le i18n, le SW et la PWA
> sont solides, tout le reste suivra.
>
> Points d'attention :
> - Les polices Google Fonts (Outfit + DM Sans) doivent être chargées dans index.html
>   ET cachées par le service worker dès le premier chargement
> - Le sélecteur de langue doit être visible mais discret (pas un dropdown complexe,
>   juste un bouton FR | EN dans la nav)
> - Les icônes PWA peuvent être des placeholders pour l'instant (carré coloré avec "W"),
>   on les remplacera par de vraies icônes plus tard
> - N'oublie pas le `<html lang="fr">` dynamique qui change avec la langue sélectionnée
> - Le fichier `src/config.js` centralise TOUS les liens externes — jamais de lien en dur dans les composants
> - Telegram est un canal broadcast (pas un groupe) — les utilisateurs reçoivent les alertes sans pouvoir répondre
> - Le formulaire d'inscription utilise Formspree en V1 — migration possible vers un backend si la communauté grandit

---

*SAFER METHOD™ — Phase 1 — Architecture Definition*
*Le code de cette phase est du scaffolding, pas de l'implémentation.*
