# 06 — Security Model

> SAFER METHOD™ — Phase 2 — Security Model
> Dernière mise à jour : 26 février 2026

---

## 1. Contexte

Waze Gabon Club est un site communautaire **statique** (SPA React sur Vercel). Il n'y a pas de backend, pas de base de données, pas d'authentification. La seule opération d'écriture est le formulaire d'inscription envoyé vers Formspree.

Le modèle de sécurité est donc **allégé mais pas inexistant**. Les protections sont proportionnées au risque réel.

---

## 2. Threat Model (Modèle de menaces)

### Formulaire d'inscription

| ID | Menace | Surface | Probabilité | Impact | Protection |
|----|--------|---------|-------------|--------|------------|
| T01 | **Spam bot** — Soumission en masse du formulaire, épuise le quota Formspree (50/mois plan gratuit) | Formulaire | Élevée | Moyen | Honeypot `_gotcha` (supporté nativement par Formspree). Rate limiting côté client (60s cooldown + sessionStorage). Formspree a aussi son propre anti-spam intégré. |
| T02 | **XSS stored** — Injection de script via les champs nom/email/pseudo, affiché dans l'email reçu par le fondateur | Formulaire | Faible | Faible | Validation côté client : pas de balises HTML dans les champs. Formspree échappe le HTML dans ses emails. Le contenu n'est jamais réaffiché sur le site (pas de backend). |
| T03 | **Interception d'emails** — Données du formulaire transitent en clair | Formulaire | Faible | Moyen | Formspree utilise HTTPS (TLS en transit). Les données sont : nom, email, pseudo Waze (optionnel) — pas de données sensibles (pas de mot de passe, pas de paiement). |

### Intégrations tierces

| ID | Menace | Surface | Probabilité | Impact | Protection |
|----|--------|---------|-------------|--------|------------|
| T04 | **iFrame compromis** — L'iFrame Waze charge du contenu malveillant | iFrame Waze | Très faible | Critique | L'iFrame est hébergé par Google (embed.waze.com), infrastructure hautement sécurisée. L'attribut `sandbox` n'est pas applicable (Waze nécessite les interactions). Le risque est accepté car la source est Google. |
| T05 | **Google Fonts tracking** — Les requêtes vers fonts.googleapis.com permettent le fingerprinting | Google Fonts CDN | Élevée | Faible | Risque accepté en V1 (Google Fonts est standard). Le service worker cache les polices après le premier chargement, réduisant les requêtes subséquentes. Migration future possible vers le self-hosting des polices. |
| T06 | **Supply chain CDN** — Un CDN tiers est compromis et sert du contenu modifié | Google Fonts, Waze embed | Très faible | Critique | Pas de script externe chargé directement (pas de `<script src="cdn...">`, seulement des CSS fonts et un iFrame). Pas de SRI (Subresource Integrity) nécessaire car pas de scripts externes. |

### Service Worker

| ID | Menace | Surface | Probabilité | Impact | Protection |
|----|--------|---------|-------------|--------|------------|
| T07 | **Cache poisoning** — Un attaquant injecte du contenu malveillant dans le cache SW | Service Worker | Très faible | Critique | Le SW est servi depuis notre domaine via HTTPS (Vercel). Le cache est versionné (`waze-gabon-v1`). Seules les réponses avec `response.ok` sont cachées. Un attaquant devrait compromettre le CDN Vercel ou faire un MITM sur HTTPS — risque très faible. |
| T08 | **SW obsolète** — Les utilisateurs restent sur une version vulnérable car le SW ne se met pas à jour | Service Worker | Moyenne | Moyen | `skipWaiting()` + `clients.claim()` dans le SW pour activation immédiate. Nettoyage des anciens caches dans l'événement `activate`. Le nom du cache (`waze-gabon-v1`) doit être incrémenté à chaque mise à jour significative. |

### Contenu côté client

| ID | Menace | Surface | Probabilité | Impact | Protection |
|----|--------|---------|-------------|--------|------------|
| T09 | **XSS via i18n** — Un fichier de traduction contient du HTML qui est injecté sans échappement | Fichiers JSON i18n | Très faible | Critique | Les fichiers JSON ne contiennent que du texte brut (vérifié). Le hook `useTranslation()` retourne des chaînes rendues par React via JSX, qui échappe automatiquement le HTML. Pas de `dangerouslySetInnerHTML`. |
| T10 | **XSS via config** — Un lien dans config.js contient du `javascript:` au lieu de `https://` | config.js | Très faible | Critique | Commentaire de sécurité dans config.js rappelant que tous les liens doivent commencer par `https://`. Les liens sont des attributs `href` sur des `<a>`, pas des appels `eval()`. Vérification manuelle à chaque modification. |
| T11 | **Clickjacking** — Le site est chargé dans un iFrame malveillant pour tromper l'utilisateur | Site entier | Faible | Moyen | Header `X-Frame-Options: DENY` dans vercel.json. Empêche tout site tiers d'embarquer Waze Gabon Club dans un iFrame. |

### Vie privée

| ID | Menace | Surface | Probabilité | Impact | Protection |
|----|--------|---------|-------------|--------|------------|
| T12 | **Exposition IP** — Les requêtes vers Google Fonts, Waze, Formspree exposent l'IP de l'utilisateur | Requêtes réseau | Élevée | Faible | Risque accepté — inhérent au fonctionnement du web. Google Fonts et Waze sont des services Google (même politique de confidentialité). Formspree ne reçoit l'IP que lors de la soumission du formulaire. Header `Referrer-Policy: strict-origin-when-cross-origin` limite les informations envoyées. |
| T13 | **Vol localStorage** — Un XSS permet de lire les données localStorage | localStorage | Très faible | Faible | Le seul contenu de localStorage est la préférence de langue (`"fr"` ou `"en"`) — aucune donnée sensible. Même en cas de XSS, le vol de cette information est sans conséquence. |

### Liens externes

| ID | Menace | Surface | Probabilité | Impact | Protection |
|----|--------|---------|-------------|--------|------------|
| T14 | **Phishing via liens** — Un lien WhatsApp/Telegram/Facebook est remplacé par un lien de phishing | config.js (repo) | Très faible | Critique | Tous les liens sont centralisés dans `config.js` (un seul fichier à auditer). Les modifications du repo sont trackées par Git. Vérification manuelle avant chaque déploiement. |
| T15 | **Reverse tabnapping** — Un lien `target="_blank"` sans protection permet au site cible de manipuler `window.opener` | Liens `<a>` | Moyenne | Moyen | Helper `externalLinkProps` avec `rel="noopener noreferrer"` appliqué à tous les liens externes. |

---

## 3. Résumé des risques

### Risques acceptés (pas de protection supplémentaire)

| ID | Risque | Raison de l'acceptation |
|----|--------|------------------------|
| T04 | iFrame Waze compromis | Source = Google, infrastructure de premier plan |
| T05 | Google Fonts tracking | Standard de l'industrie, cache SW réduit l'impact |
| T06 | Supply chain CDN | Pas de scripts externes, seulement CSS + iFrame |
| T12 | Exposition IP | Inhérent au web, données non sensibles |
| T13 | Vol localStorage | Contenu sans valeur (préférence de langue uniquement) |

### Risques mitigés (protections en place)

| ID | Risque | Protection |
|----|--------|------------|
| T01 | Spam formulaire | Honeypot + rate limiting + Formspree anti-spam |
| T02 | XSS formulaire | Validation + échappement + pas de réaffichage |
| T07 | Cache poisoning | HTTPS + versioning + vérification response.ok |
| T08 | SW obsolète | skipWaiting + activate cleanup |
| T09 | XSS i18n | Texte brut + échappement React |
| T10 | XSS config | Commentaire sécurité + liens https:// uniquement |
| T11 | Clickjacking | X-Frame-Options: DENY |
| T14 | Phishing liens | config.js centralisé + Git tracking |
| T15 | Reverse tabnapping | rel="noopener noreferrer" |

---

## 4. Politique de confidentialité simplifiée

Voir les clés i18n `privacy.*` dans `src/i18n/fr.json` et `en.json`. Cette politique sera affichée dans le footer du site.

### Points clés

1. **Données collectées** : Nom, email, pseudo Waze (optionnel) — uniquement via le formulaire d'inscription volontaire
2. **Finalité** : Accueillir le membre et l'inviter aux canaux communautaires
3. **Destinataire** : Formspree (service tiers, USA) qui transmet par email au fondateur
4. **Pas de cookies** : Aucun cookie de tracking, aucun cookie publicitaire
5. **localStorage** : Uniquement pour la préférence de langue (FR/EN)
6. **Services tiers** : Google Fonts (polices), Waze/Google (carte live), Formspree (formulaire)
7. **Données NON collectées** : Pas de localisation GPS, pas d'historique de navigation, pas de données Waze, pas d'analytics

---

## 5. Content Security Policy (CSP) — Planification V2

Une CSP stricte n'est **pas implémentée en V1** pour les raisons suivantes :

| Directive | Problème |
|-----------|----------|
| `script-src` | Vite injecte des scripts inline en dev (HMR) ; le SW registration est un script inline |
| `style-src` | Les styles inline React sont omniprésents dans le prototype |
| `frame-src` | L'iFrame `embed.waze.com` nécessite une exception |
| `font-src` | Google Fonts (`fonts.gstatic.com`) nécessite une exception |
| `connect-src` | Formspree (`formspree.io`) nécessite une exception |

**Plan V2** : Quand les styles seront stabilisés et que les scripts inline seront éliminés (nonces ou hashes), implémenter une CSP stricte :

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src https://embed.waze.com;
  connect-src 'self' https://formspree.io;
  img-src 'self' data:;
  object-src 'none';
  base-uri 'self';
```

---

## 6. Protections implémentées — Résumé

| Protection | Fichier | Menaces couvertes |
|------------|---------|-------------------|
| Headers de sécurité Vercel | `vercel.json` | T11 (clickjacking), fingerprinting, MIME sniffing |
| Honeypot anti-spam | `src/utils/form.js` | T01 (spam bot) |
| Validation formulaire | `src/utils/form.js` | T02 (XSS formulaire) |
| Rate limiting client | `src/utils/form.js` | T01 (spam bot) |
| Helper liens externes | `src/utils/externalLink.js` | T15 (reverse tabnapping) |
| Commentaire sécurité config | `src/config.js` | T10 (XSS config), T14 (phishing) |
| Cache versionné SW | `public/sw.js` | T07 (cache poisoning), T08 (SW obsolète) |
| Politique de confidentialité | `src/i18n/fr.json`, `en.json` | Transparence vie privée |

---

*SAFER METHOD™ — Phase 2 — Security Model*
*La sécurité est proportionnée au risque. Pas de sur-ingénierie, pas de négligence.*
