# 07 — Data Flow

> SAFER METHOD™ — Phase 2 — Security Model
> Dernière mise à jour : 26 février 2026

---

## 1. Schéma global des flux de données

```
┌──────────────────────────────────────────────────────────────────┐
│                         UTILISATEUR                              │
│                  (navigateur mobile / desktop)                   │
└────────┬──────────┬──────────┬──────────┬──────────┬─────────────┘
         │          │          │          │          │
    ① LECTURE  ② LECTURE  ③ LECTURE  ④ ÉCRITURE  ⑤ CLIC
         │          │          │          │          │
         ▼          ▼          ▼          ▼          ▼
    ┌─────────┐ ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────────┐
    │ Vercel  │ │ Google │ │ Waze   │ │Formspree│ │ Liens        │
    │ CDN     │ │ Fonts  │ │ iFrame │ │ API     │ │ externes     │
    │         │ │ CDN    │ │        │ │         │ │              │
    │ HTML    │ │ Outfit │ │ Carte  │ │ POST    │ │ WhatsApp     │
    │ JS/CSS  │ │ DM Sans│ │ live   │ │ form    │ │ Telegram     │
    │ SW      │ │        │ │ trafic │ │ data    │ │ Facebook     │
    │ PWA     │ │        │ │        │ │         │ │ Waze (deep)  │
    │ assets  │ │        │ │        │ │         │ │ App Store    │
    └─────────┘ └────────┘ └────────┘ └────┬────┘ │ Google Play  │
                                           │      └──────────────┘
                                           ▼
                                    ┌─────────────┐
                                    │ Email du    │
                                    │ fondateur   │
                                    │ (Michael)   │
                                    └─────────────┘


STOCKAGE LOCAL (navigateur uniquement)
┌──────────────────────────────────┐
│ localStorage                     │
│   └── "lang" : "fr" ou "en"     │
│                                  │
│ sessionStorage                   │
│   └── "formSubmittedAt" : timestamp │
│                                  │
│ Cache API (Service Worker)       │
│   └── "waze-gabon-v1" : HTML,   │
│       JS bundles, fonts          │
└──────────────────────────────────┘
```

---

## 2. Détail des flux

### ① Chargement du site (LECTURE)

```
Utilisateur  ──HTTPS──▶  Vercel CDN
                              │
                              ├── index.html (shell)
                              ├── assets/*.js (bundle React)
                              ├── manifest.json (PWA)
                              ├── sw.js (Service Worker)
                              ├── icon-192.png, icon-512.png
                              └── favicon.ico
```

- **Protocole** : HTTPS (TLS, certificat Vercel automatique)
- **Données envoyées par l'utilisateur** : IP, User-Agent, Referer (headers HTTP standard)
- **Données reçues** : Fichiers statiques
- **Cache** : Le SW cache les fichiers pour usage offline

### ② Chargement des polices (LECTURE)

```
Utilisateur  ──HTTPS──▶  fonts.googleapis.com  (CSS)
             ──HTTPS──▶  fonts.gstatic.com     (fichiers woff2)
```

- **Protocole** : HTTPS
- **Données envoyées** : IP, User-Agent, Referer
- **Données reçues** : Fichiers CSS et woff2 (polices Outfit, DM Sans)
- **Cache** : Le SW cache les polices après le premier chargement (cache-first)
- **Privacy** : Google reçoit l'IP de l'utilisateur. Après le premier chargement, les requêtes suivantes sont servies depuis le cache SW.

### ③ Carte live Waze (LECTURE)

```
Utilisateur  ──HTTPS──▶  embed.waze.com (iFrame)
```

- **Protocole** : HTTPS
- **Données envoyées** : IP, User-Agent (dans le contexte de l'iFrame)
- **Données reçues** : Carte interactive avec trafic temps réel de Libreville
- **Isolation** : L'iFrame est isolé du contexte parent (same-origin policy)
- **Cache** : NON caché (données temps réel)
- **Offline** : Message "carte indisponible" affiché à la place

### ④ Soumission du formulaire (ÉCRITURE)

```
Utilisateur  ──HTTPS POST──▶  formspree.io/f/{ID}
                                     │
                                     ▼
                              Email au fondateur
```

- **Protocole** : HTTPS POST
- **Données envoyées** :

| Champ | Type | Requis | Validation |
|-------|------|--------|------------|
| `name` | String | Oui | 2-100 chars, pas de HTML |
| `email` | String | Oui | Format email valide |
| `wazeUser` | String | Non | 0-50 chars, alphanumérique + tirets/underscores |
| `_gotcha` | String | — | Honeypot anti-spam (doit rester vide) |

- **Données reçues** : Confirmation de soumission (succès/erreur)
- **Destinataire final** : Le fondateur reçoit un email avec les données
- **Cache** : NON caché (requête POST)
- **Rate limiting** : 60s cooldown côté client + limites Formspree côté serveur

### ⑤ Liens externes (CLIC)

```
Utilisateur  ──clic──▶  Application tierce (nouvel onglet)
```

| Destination | URL type | Action |
|-------------|----------|--------|
| WhatsApp | `https://chat.whatsapp.com/...` | Ouvre l'app WhatsApp / web |
| Telegram | `https://t.me/...` | Ouvre l'app Telegram / web |
| Facebook | `https://facebook.com/...` | Ouvre la page Facebook |
| Waze (deep link) | `https://waze.com/ul?ll=...` | Ouvre l'app Waze / redirige vers le store |
| App Store | `https://apps.apple.com/...` | Ouvre l'App Store |
| Google Play | `https://play.google.com/...` | Ouvre le Play Store |
| Waze Editor | `https://www.waze.com/editor` | Ouvre l'éditeur de carte Waze |

- **Données envoyées par le site** : Aucune (simple navigation)
- **Protection** : `rel="noopener noreferrer"` sur tous les liens `target="_blank"`

---

## 3. Inventaire des données collectées

| Donnée | Source | Stockage | Durée de rétention | Données sensibles ? |
|--------|--------|----------|--------------------|--------------------|
| Préférence de langue | Choix utilisateur | localStorage navigateur | Jusqu'à suppression manuelle | Non |
| Timestamp soumission | Automatique | sessionStorage navigateur | Durée de la session | Non |
| Cache SW | Automatique | Cache API navigateur | Jusqu'à mise à jour du SW | Non |
| Nom | Formulaire volontaire | Formspree → email fondateur | Selon politique Formspree | Non |
| Email | Formulaire volontaire | Formspree → email fondateur | Selon politique Formspree | Oui (PII) |
| Pseudo Waze | Formulaire volontaire (optionnel) | Formspree → email fondateur | Selon politique Formspree | Non |

### Données NON collectées

| Donnée | Raison |
|--------|--------|
| Localisation GPS | Pas d'API de géolocalisation utilisée |
| Historique de navigation | Pas de backend, pas d'analytics |
| Données de l'app Waze | Aucun accès (les deep links ouvrent l'app native) |
| Cookies | Aucun cookie posé par le site |
| Adresse IP | Non stockée par le site (mais visible par Vercel, Google Fonts, Formspree) |
| Identifiant appareil | Non collecté |

---

## 4. Services tiers contactés

| Service | Domaine | Données reçues | Politique de confidentialité |
|---------|---------|----------------|------------------------------|
| **Vercel** | `*.vercel.app` | IP, User-Agent (logs serveur) | https://vercel.com/legal/privacy-policy |
| **Google Fonts** | `fonts.googleapis.com`, `fonts.gstatic.com` | IP, User-Agent | https://policies.google.com/privacy |
| **Waze (Google)** | `embed.waze.com` | IP, User-Agent (dans l'iFrame) | https://policies.google.com/privacy |
| **Formspree** | `formspree.io` | Nom, email, pseudo Waze, IP | https://formspree.io/legal/privacy-policy |

---

## 5. Stockage côté client

| Mécanisme | Clé | Valeur | Accès |
|-----------|-----|--------|-------|
| `localStorage` | `"lang"` | `"fr"` ou `"en"` | Persistant, même domaine uniquement |
| `sessionStorage` | `"formSubmittedAt"` | Timestamp Unix (ms) | Session courante uniquement |
| Cache API (SW) | `"waze-gabon-v1"` | HTML, JS, CSS, fonts | Géré par le Service Worker |

Aucun de ces mécanismes ne contient de données personnelles.

---

## 6. Durée de rétention

| Donnée | Rétention | Contrôle |
|--------|-----------|----------|
| localStorage (langue) | Indéfinie, jusqu'à suppression manuelle | L'utilisateur peut supprimer via les paramètres du navigateur |
| sessionStorage (timestamp) | Durée de la session navigateur | Supprimé automatiquement à la fermeture |
| Cache SW | Jusqu'à la prochaine version du SW | Supprimé automatiquement lors de l'activation d'un nouveau SW |
| Données Formspree | Selon la politique Formspree (30 jours par défaut sur le plan gratuit) | Le fondateur peut supprimer les soumissions dans le dashboard Formspree |

---

*SAFER METHOD™ — Phase 2 — Security Model*
