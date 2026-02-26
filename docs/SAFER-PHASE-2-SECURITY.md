# 🔐 SAFER METHOD™ — PHASE 2 : SECURITY MODEL

> **Projet** : Waze Gabon Club
> **Phase** : 2 — Security Model
> **Statut** : EN COURS
> **Phase précédente** : Phase 1 — Architecture Definition ✅ VALIDÉE
> **Règle** : Documentation de sécurité + implémentation des protections. Pas d'implémentation de features/UI.

---

## DIRECTIVE POUR CLAUDE CODE

Tu opères sous le framework **SAFER METHOD™** en tant que Senior Software Architect & Security Engineer.

Tu es en **Phase 2 — Security Model**. Les Phases 0 et 1 sont validées.

**Contexte de sécurité** : Ce projet est un site communautaire statique (SPA React sur Vercel, pas de backend, pas de base de données, pas d'authentification). Le modèle de sécurité est donc **allégé** par rapport à un SaaS ou une fintech, mais il n'est pas inexistant.

Les surfaces d'attaque sont :
- Le formulaire d'inscription (envoi vers Formspree)
- Les intégrations tierces (iFrame Waze, Google Fonts)
- Le service worker (cache poisoning potentiel)
- Le contenu côté client (XSS via i18n ou config)
- La vie privée des utilisateurs (requêtes vers des domaines tiers)
- Les liens externes (phishing potentiel si les liens sont compromis)

**Tu dois :**
1. Produire la documentation de sécurité
2. Implémenter les protections concrètes dans le code existant
3. Ne PAS toucher aux composants UI ou au contenu

---

## LIVRABLES ATTENDUS — PHASE 2

### A. Documentation : `/docs/06_SECURITY_MODEL.md`

Document structuré contenant les sections suivantes :

#### 1. Threat Model (Modèle de menaces)

Tableau des menaces identifiées :

| ID | Menace | Surface | Probabilité | Impact | Protection |
|----|--------|---------|-------------|--------|------------|

Menaces à évaluer :

**Formulaire d'inscription :**
- T01 : Spam bot qui soumet le formulaire en masse (abuse Formspree quota)
- T02 : Injection de script via les champs du formulaire (XSS stored si les données sont affichées quelque part)
- T03 : Collecte d'emails par des tiers (si les données transitent en clair)

**Intégrations tierces :**
- T04 : L'iFrame Waze charge du contenu malveillant (compromission du CDN Waze)
- T05 : Google Fonts tracking (requêtes vers les serveurs Google = fingerprinting potentiel)
- T06 : CDN tiers modifié (supply chain attack via fonts ou scripts externes)

**Service Worker :**
- T07 : Cache poisoning — un attaquant injecte du contenu malveillant dans le cache SW
- T08 : Le service worker ne se met pas à jour — les utilisateurs restent sur une version obsolète/vulnérable

**Contenu côté client :**
- T09 : XSS via les fichiers de traduction i18n (si une clé contient du HTML non échappé)
- T10 : XSS via config.js (si un lien externe est modifié pour contenir du JavaScript)
- T11 : Clickjacking — le site est chargé dans un iFrame malveillant

**Vie privée :**
- T12 : Les requêtes vers Google Fonts, Waze embed, Formspree exposent l'IP de l'utilisateur
- T13 : localStorage accessible par d'autres scripts sur le même domaine (XSS → vol de préférences)

**Liens externes :**
- T14 : Un lien WhatsApp/Telegram/Facebook est remplacé par un lien de phishing (compromission du repo)
- T15 : Les liens `target="_blank"` sans `rel="noopener noreferrer"` permettent le reverse tabnapping

#### 2. Data Flow (Flux de données)

Schéma textuel des données qui entrent et sortent du site :

```
UTILISATEUR
    │
    ├── [LECTURE] Charge le site (HTML/JS/CSS) ← Vercel CDN
    │
    ├── [LECTURE] Charge les polices ← Google Fonts CDN
    │
    ├── [LECTURE] Charge la carte live ← embed.waze.com (iFrame)
    │
    ├── [ÉCRITURE] Soumet le formulaire d'inscription
    │       └── nom, email, pseudo Waze → Formspree → email du fondateur
    │
    ├── [CLIC] Deep links Waze → ouvre l'app Waze (pas de données envoyées au site)
    │
    ├── [CLIC] Liens WhatsApp/Telegram/Facebook → ouvre l'app tierce
    │
    └── [LOCAL] Stockage langue dans localStorage (jamais envoyé au réseau)
```

Identifier :
- Quelles données sont collectées (nom, email, pseudo Waze — via Formspree uniquement)
- Où elles transitent (client → Formspree API → email fondateur)
- Ce qui est stocké localement (langue uniquement, dans localStorage)
- Ce qui n'est JAMAIS collecté (localisation GPS, historique de navigation, données Waze)

#### 3. Politique de confidentialité simplifiée

Rédiger un texte court (pas un document juridique) qui sera affiché dans le footer ou une page dédiée, en français et en anglais. Contenu :

- Ce que le site collecte : nom, email, pseudo Waze (optionnel) via le formulaire d'inscription
- Pourquoi : uniquement pour accueillir le membre et l'inviter aux canaux communautaires
- Où les données sont envoyées : Formspree (service tiers basé aux USA)
- Ce que le site ne collecte PAS : pas de cookies de tracking, pas de localisation, pas de données Waze
- Services tiers qui reçoivent des requêtes : Google Fonts (polices), Waze/Google (carte live), Formspree (formulaire)
- localStorage : utilisé uniquement pour la préférence de langue
- Contact : email du fondateur pour toute question

Ajouter les clés i18n correspondantes dans fr.json et en.json :

```json
{
  "privacy.title": "...",
  "privacy.intro": "...",
  "privacy.collected": "...",
  "privacy.purpose": "...",
  "privacy.thirdParty": "...",
  "privacy.notCollected": "...",
  "privacy.localStorage": "...",
  "privacy.contact": "..."
}
```

---

### B. Implémentation des protections

#### B1. Headers de sécurité — `vercel.json`

Créer un fichier `vercel.json` à la racine du projet avec les headers de sécurité :

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

Explications :
- `X-Frame-Options: DENY` — Empêche le clickjacking (T11)
- `X-Content-Type-Options: nosniff` — Empêche le MIME sniffing
- `Referrer-Policy` — Limite les informations envoyées aux sites tiers
- `Permissions-Policy` — Le site n'a pas besoin de caméra, micro ou géolocalisation

**Note** : Pas de Content-Security-Policy strict pour l'instant car l'iFrame Waze et Google Fonts nécessitent des exceptions. Documenter pourquoi dans le security model et proposer une CSP future quand les dépendances seront stabilisées.

#### B2. Protection du formulaire

Dans `src/config.js` ou un utilitaire dédié, ajouter :

1. **Validation côté client** des champs du formulaire :
   - Nom : 2-100 caractères, pas de balises HTML
   - Email : format email valide (regex simple)
   - Pseudo Waze : 0-50 caractères, alphanumérique + tirets/underscores uniquement
   - Échapper tout HTML dans les valeurs avant envoi

2. **Honeypot anti-spam** :
   - Ajouter un champ caché `<input type="text" name="_gotcha" style="display:none">` dans le formulaire
   - Si ce champ est rempli → c'est un bot → ne pas soumettre
   - Formspree supporte nativement le champ `_gotcha`

3. **Rate limiting côté client** (basique) :
   - Après une soumission réussie, désactiver le bouton pendant 60 secondes
   - Stocker un timestamp dans sessionStorage pour empêcher les soumissions multiples dans la même session
   - Ce n'est PAS une protection serveur (Formspree a ses propres limites) mais ça réduit l'abus accidentel

#### B3. Sécurisation des liens externes

Vérifier que TOUS les liens `<a>` vers des sites externes dans le code ont :
- `target="_blank"` (ouvre dans un nouvel onglet)
- `rel="noopener noreferrer"` (protection contre le reverse tabnapping T15)

Créer un helper si nécessaire :

```javascript
// src/utils/externalLink.js
export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
};
```

#### B4. Sécurisation du Service Worker

Vérifier dans `public/sw.js` :

1. **Versioning du cache** : le nom du cache inclut un numéro de version (`waze-gabon-v1`)
2. **Nettoyage des anciens caches** : dans l'événement `activate`, supprimer tous les caches qui ne correspondent pas à la version courante
3. **Pas de cache pour les requêtes POST** (formulaire Formspree)
4. **Pas de cache pour les domaines tiers sensibles** (formspree.io)

#### B5. Sanitization des traductions i18n

Vérifier que le hook `useTranslation` retourne du texte brut, jamais du HTML non échappé.

Si une traduction doit contenir du formatage (gras, liens), utiliser une convention explicite :
- Pas de `dangerouslySetInnerHTML`
- Pas de HTML dans les fichiers JSON
- Si un texte nécessite du gras, le découper en clés : `"hero.subtitle.before"`, `"hero.subtitle.bold"`, `"hero.subtitle.after"`

#### B6. Validation de `config.js`

Ajouter un commentaire d'en-tête dans `config.js` qui rappelle :

```javascript
/**
 * SÉCURITÉ : Ce fichier contient tous les liens externes du site.
 * Toute modification doit être vérifiée manuellement.
 * Ne JAMAIS accepter de valeurs provenant de l'utilisateur ou de paramètres URL.
 * Tous les liens doivent commencer par https://
 */
```

---

### C. Documentation : `/docs/07_DATA_FLOW.md`

Document séparé avec le schéma complet du flux de données (tel que décrit en section A.2), incluant :

- Schéma visuel (ASCII art)
- Tableau des données collectées
- Tableau des services tiers contactés (avec leur politique de confidentialité)
- Ce qui est stocké côté client (localStorage uniquement)
- Durée de rétention des données (Formspree : selon leur politique ; localStorage : jusqu'à suppression manuelle)

---

## RÈGLES STRICTES PHASE 2

1. **Pas de sur-ingénierie** — C'est un site communautaire statique, pas une banque. Les protections doivent être proportionnées au risque.
2. **Pas de CSP strict** en V1 — L'iFrame Waze et Google Fonts rendraient la politique trop permissive pour être utile. Documenter et planifier pour V2.
3. **Pas de backend de sécurité** — Toutes les protections sont côté client ou via les headers Vercel.
4. **Documenter chaque décision** — Pourquoi on fait ou ne fait pas quelque chose.
5. **Le formulaire est la seule surface d'écriture** — Toutes les autres interactions sont en lecture seule ou des clics vers des liens externes.
6. **Ne pas modifier App.jsx** au-delà de l'ajout des clés i18n de confidentialité.
7. **Ne pas implémenter de features UI** — Le contenu visuel sera ajouté en Phase 4.

---

## VALIDATION

Une fois les livrables créés, affiche :

1. La liste des fichiers créés ou modifiés
2. Le résumé du modèle de menaces (nombre de menaces, nombre de protections)
3. La checklist de validation :

```
- [ ] vercel.json créé avec les headers de sécurité
- [ ] Honeypot anti-spam préparé (helper ou documentation)
- [ ] Helper externalLinkProps créé
- [ ] Service worker vérifié (versioning, nettoyage, pas de cache POST)
- [ ] Traductions i18n : pas de HTML brut dans les valeurs
- [ ] config.js : commentaire de sécurité ajouté
- [ ] docs/06_SECURITY_MODEL.md créé
- [ ] docs/07_DATA_FLOW.md créé
- [ ] Clés i18n de confidentialité ajoutées (fr.json + en.json)
- [ ] npm run build fonctionne toujours sans erreur
- [ ] Pas de régression (le shell App.jsx affiche toujours le sélecteur FR/EN)
```

Puis demande :

> "Phase 2 terminée. Le modèle de sécurité est documenté et les protections de base sont en place.
> Souhaitez-vous valider pour passer à la Phase 3 — Feature Flag Strategy ?"

**Ne passe PAS à la Phase 3 sans validation explicite du fondateur.**

---

*SAFER METHOD™ — Phase 2 — Security Model*
*La sécurité est proportionnée au risque. Pas de sur-ingénierie, pas de négligence.*
