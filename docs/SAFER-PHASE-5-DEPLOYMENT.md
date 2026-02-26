# 🚀 SAFER METHOD™ — PHASE 5 : CONTROLLED DEPLOYMENT

> **Projet** : Waze Gabon Club
> **Phase** : 5 — Controlled Deployment
> **Statut** : EN COURS
> **Phases précédentes** : Phase 0 ✅ | Phase 1 ✅ | Phase 2 ✅ | Phase 3 ✅ | Phase 4 ✅
> **Règle** : Déployer avec les flags Wave 1 uniquement. Vérifier tout avant de toucher à main.

---

## DIRECTIVE POUR CLAUDE CODE

Tu opères sous le framework **SAFER METHOD™** en tant que Senior Software Architect.

Tu es en **Phase 5 — Controlled Deployment**. Le site est complet localement. Maintenant on prépare le déploiement en production sur Vercel, en suivant la stratégie de rollout par waves définie en Phase 3.

**Objectif** : Préparer et exécuter le premier déploiement en production (Wave 1), vérifier que tout fonctionne, documenter la procédure.

---

## ÉTAPE 1 : CONFIGURATION DES FLAGS POUR LA PRODUCTION (WAVE 1)

### Créer un fichier de configuration production

Modifier `src/flags.js` pour refléter la **Wave 1 — Fondation** :

```javascript
const FLAGS = {
  // === WAVE 1 — Fondation (activé au lancement) ===
  hero: true,
  features: true,
  download: true,
  footer: true,
  languageSwitcher: true,
  privacySection: true,

  // === WAVE 2 — Éducation (à activer Jour 2-3) ===
  tutorials: true,       // WAVE 2 — activer après test mobile
  faq: true,             // WAVE 2 — activer après test mobile

  // === WAVE 3 — Communauté (à activer Jour 4-7) ===
  community: true,       // WAVE 3 — activer quand les canaux sont créés
  floatingWhatsapp: true, // WAVE 3 — activer avec community
  livemap: false,         // WAVE 3 — activer après test réseau gabonais

  // === WAVE 4 — Complet (à activer Jour 7-14) ===
  articles: false,        // WAVE 4 — activer après vérification des liens
  registerModal: false,   // WAVE 4 — activer quand Formspree est configuré

  // === Système ===
  debugPanel: true,       // Toujours true — activé uniquement par ?debug=flags
};
```

**Décision stratégique du consultant** : On déploie directement Waves 1+2+3 (partiellement) car :
- Les tutoriels et FAQ fonctionnent sans dépendance externe → Wave 2 activée
- WhatsApp, Telegram, Facebook et l'éditeur fonctionnent (liens externes simples) → Community activée
- Seuls `livemap`, `articles` et `registerModal` restent désactivés car ils dépendent de conditions non encore validées

**Résumé des flags en production initiale** :
- ✅ 10 flags activés : hero, features, download, tutorials, faq, community, floatingWhatsapp, footer, languageSwitcher, privacySection
- ❌ 3 flags désactivés : livemap, articles, registerModal
- 🔧 1 flag système : debugPanel (toujours true)

---

## ÉTAPE 2 : PRÉ-DEPLOYMENT CHECKLIST

Exécuter ces vérifications **avant** de merge dans main :

### A. Build de production

```bash
# 1. Clean build
rm -rf dist/
npm run build

# 2. Vérifier la taille du bundle
# Attendu : < 150 KB gzip (dernière mesure : 80.75 KB)
ls -la dist/assets/

# 3. Vérifier que le build contient les flags
grep -c "FLAGS" dist/assets/*.js

# 4. Preview locale du build de production
npm run preview
# → Ouvrir http://localhost:4173
```

### B. Vérifications fonctionnelles sur le build de production

```bash
# Lancer le serveur de preview
npm run preview
```

Vérifier manuellement dans le navigateur (http://localhost:4173) :

**Sections visibles (flags true) :**
- [ ] Hero s'affiche avec les animations
- [ ] Features affiche les 6 cartes
- [ ] Download affiche les 2 cartes iOS/Android
- [ ] Tutorials affiche les 6 accordéons (s'ouvrent/ferment)
- [ ] FAQ affiche les 7 questions (s'ouvrent/ferment)
- [ ] Community affiche les 4 cartes (WhatsApp, Facebook, Telegram, Éditeur)
- [ ] Footer affiche tous les liens et le copyright
- [ ] Sélecteur FR/EN fonctionne et change tout le texte
- [ ] Bouton WhatsApp flottant est visible
- [ ] Section confidentialité est accessible

**Sections masquées (flags false) :**
- [ ] Pas de section Carte Live visible
- [ ] Pas de section Articles visible
- [ ] Pas de bouton "S'inscrire" visible (ou le bouton est présent mais le modal ne s'ouvre pas)

**Debug panel :**
- [ ] http://localhost:4173/?debug=flags affiche le panneau
- [ ] Le panneau liste les 14 flags avec leur état correct
- [ ] Sans ?debug=flags, le panneau est invisible

**Navigation :**
- [ ] Les liens de navigation ne pointent que vers les sections visibles
- [ ] Pas de lien vers "Carte Live" ou "Actualités" si les flags sont false
- [ ] La navigation mobile (hamburger) fonctionne

### C. Vérifications de sécurité

```bash
# Vérifier que vercel.json est présent avec les headers
cat vercel.json

# Vérifier qu'aucun lien externe n'est sans protection
grep -rn 'target="_blank"' src/ | grep -v 'noopener'
# → Devrait retourner 0 résultats

# Vérifier que le honeypot est en place
grep -rn '_gotcha' src/
# → Devrait trouver le champ dans le formulaire

# Vérifier qu'il n'y a pas de texte en dur dans App.jsx
# (chercher des chaînes françaises qui ne sont pas dans un commentaire)
grep -n '"[A-Z][a-zéèàêïôù]' src/App.jsx | grep -v '//' | grep -v 'const\|key\|id\|type\|font\|color\|background\|border\|animation\|grid\|display\|position\|padding\|margin\|width\|height\|flex\|align\|justify\|overflow\|cursor\|transition\|transform\|opacity\|linear-gradient\|radial-gradient\|clamp\|minmax'
# → Tout texte visible doit passer par t()
```

### D. Vérification PWA

```bash
# Vérifier le manifest
cat public/manifest.json

# Vérifier le service worker
cat public/sw.js

# Vérifier que le service worker est enregistré
grep -rn 'serviceWorker' src/
```

### E. Vérification du fichier de configuration

```bash
# Vérifier que config.js contient les bons liens
cat src/config.js

# Vérifier les liens placeholder qui doivent être remplacés
grep -rn 'VOTRE_LIEN\|VOTRE_PAGE\|YOUR_FORMSPREE' src/
# → Lister tous les placeholders restants
# → Les liens WhatsApp/Telegram/Facebook DOIVENT être remplacés par les vrais liens
# → L'endpoint Formspree peut rester en placeholder (registerModal est désactivé)
```

⚠️ **IMPORTANT** : Si des liens placeholder sont encore présents pour WhatsApp, Telegram ou Facebook, les signaler dans le rapport. Le fondateur devra les remplacer avec les vrais liens avant le merge dans main.

---

## ÉTAPE 3 : DOCUMENTATION DE DÉPLOIEMENT

### Créer `/docs/09_DEPLOYMENT_GUIDE.md`

Contenu :

```markdown
# Guide de déploiement — Waze Gabon Club

## Hébergement

- **Plateforme** : Vercel (plan gratuit)
- **Framework** : Vite (détecté automatiquement par Vercel)
- **Build command** : `npm run build`
- **Output directory** : `dist`
- **Install command** : `npm install`
- **Node.js version** : 20.x (LTS)

## Connexion Vercel

### Première configuration

1. Aller sur https://vercel.com
2. Se connecter avec GitHub
3. Importer le repository `waze-gabon-club`
4. Vercel détecte automatiquement Vite
5. Vérifier les settings :
   - Framework Preset : Vite
   - Build Command : `npm run build`
   - Output Directory : `dist`
6. Cliquer "Deploy"

### Déploiements automatiques

- Push sur `main` → déploiement en production
- Push sur `develop` ou feature branches → preview deployment
- Chaque preview a une URL unique

## Domaine

### Par défaut
`waze-gabon-club.vercel.app` (ou le nom choisi)

### Domaine personnalisé (optionnel, futur)
1. Acheter un domaine (ex: wazegazbon.club, wazegabon.com)
2. Dans Vercel > Settings > Domains
3. Ajouter le domaine
4. Configurer les DNS chez le registrar

## Variables d'environnement

Aucune variable d'environnement requise pour V1.
Tout est dans le code côté client (config.js, flags.js).

## Headers de sécurité

Configurés dans `vercel.json` :
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

## Procédure de déploiement standard

1. Développer sur une branche feature/
2. Tester localement (`npm run dev`)
3. Build de vérification (`npm run build && npm run preview`)
4. Push et créer une PR vers develop
5. Vérifier la preview Vercel
6. Merge dans develop
7. Tester la preview develop
8. Merge develop dans main
9. Vérifier la production

## Procédure de rollback

### Rollback d'une section (via feature flag)
1. Modifier le flag dans src/flags.js → false
2. Commit : "fix(flags): disable [section] — [raison]"
3. Push vers main (exception urgence)
4. Vercel redéploie en ~60 secondes
5. Vérifier que la section est masquée

### Rollback complet (vers un commit précédent)
1. Dans Vercel > Deployments
2. Trouver le dernier déploiement fonctionnel
3. Cliquer "..." > "Promote to Production"
4. Le site revient instantanément à la version précédente
5. Investiguer le problème sur une branche fix/

## Vérification post-déploiement

Après chaque déploiement en production :
1. Vérifier l'URL de production
2. Ouvrir `?debug=flags` pour voir l'état des flags
3. Tester le sélecteur FR/EN
4. Tester un tutoriel (ouverture/fermeture)
5. Tester un lien externe (ouvre un nouvel onglet)
6. Tester sur mobile (Chrome Android)
```

### Créer `/docs/10_ROLLOUT_PLAN.md`

Contenu :

```markdown
# Plan de rollout — Waze Gabon Club

## État actuel des flags

| Flag | État | Wave |
|------|------|------|
| hero | ✅ ON | 1 |
| features | ✅ ON | 1 |
| download | ✅ ON | 1 |
| tutorials | ✅ ON | 2 |
| faq | ✅ ON | 2 |
| community | ✅ ON | 3 |
| floatingWhatsapp | ✅ ON | 3 |
| livemap | ❌ OFF | 3 |
| articles | ❌ OFF | 4 |
| registerModal | ❌ OFF | 4 |
| footer | ✅ ON | 1 |
| languageSwitcher | ✅ ON | 1 |
| privacySection | ✅ ON | 1 |
| debugPanel | 🔧 SYSTEM | — |

## Waves restantes

### Wave 3 (partiel) — Activer livemap
**Prérequis** :
- Tester l'iFrame Waze depuis une connexion gabonaise (4G Airtel ou Moov)
- L'iFrame doit charger en moins de 5 secondes
- Si l'iFrame ne charge pas, garder le flag à false

**Procédure** :
1. Modifier livemap: true dans flags.js
2. Commit : "feat(flags): enable livemap wave 3"
3. Push vers develop → vérifier preview
4. Merge dans main → vérifier production

### Wave 4 — Activer articles + registerModal
**Prérequis articles** :
- Vérifier que les 6 URLs d'articles sont toujours actives (pas de 404)
- Mettre à jour les articles si nécessaire

**Prérequis registerModal** :
- Créer un compte Formspree (formspree.io)
- Créer un formulaire
- Copier l'endpoint (ex: https://formspree.io/f/xyzabc)
- Remplacer le placeholder dans config.js
- Tester l'envoi depuis le preview Vercel

**Procédure** :
1. Modifier articles: true et registerModal: true dans flags.js
2. Mettre à jour config.js avec l'endpoint Formspree réel
3. Commit : "feat(flags): enable wave 4 — articles + register"
4. Push vers develop → tester le formulaire sur preview
5. Merge dans main → vérifier production

## Liens à configurer avant le déploiement

Les liens suivants DOIVENT être remplacés dans config.js :

| Lien | Placeholder actuel | Action requise |
|------|-------------------|----------------|
| WhatsApp | VOTRE_LIEN_ICI | Créer le groupe WhatsApp et copier le lien d'invitation |
| Telegram | VOTRE_LIEN_TELEGRAM | Créer le canal Telegram et copier le lien |
| Facebook | VOTRE_PAGE_ICI | Créer la page Facebook et copier l'URL |
| Formspree | YOUR_FORMSPREE_ID | Créer le formulaire sur formspree.io (Wave 4) |

⚠️ WhatsApp, Telegram et Facebook sont utilisés par la section Community (activée en prod).
Ils DOIVENT être configurés avant le déploiement initial.
```

---

## ÉTAPE 4 : PRÉPARATION DE LA BRANCHE MAIN

```bash
# 1. S'assurer que develop est à jour
git checkout develop
git pull

# 2. Vérifier l'état des flags (Wave 1+2+3 partiel)
cat src/flags.js

# 3. Build final de vérification
npm run build

# 4. Créer la branche de release
git checkout -b release/v1.0.0

# 5. Commit les flags de production si modifiés
git add src/flags.js
git commit -m "feat(flags): set production flags for v1.0.0 — waves 1+2+3 partial"

# 6. Merge dans develop (pour la preview)
git checkout develop
git merge release/v1.0.0
git push

# 7. Vérifier la preview Vercel de develop
# → URL fournie par Vercel dans le terminal ou le dashboard

# 8. Si la preview est OK, merge dans main
git checkout main
git merge develop
git push

# 9. Vérifier la production Vercel
```

---

## ÉTAPE 5 : VÉRIFICATION POST-DÉPLOIEMENT

Après le déploiement sur main :

```bash
# L'URL de production sera affichée par Vercel
# Format : https://waze-gabon-club.vercel.app ou le nom choisi
```

**Checklist post-déploiement :**

- [ ] Le site s'affiche à l'URL de production
- [ ] `?debug=flags` affiche le panneau avec les bons états
- [ ] Les 10 sections activées sont visibles
- [ ] Les 3 sections désactivées sont invisibles
- [ ] Le sélecteur FR/EN fonctionne
- [ ] Les liens WhatsApp / Telegram / Facebook s'ouvrent correctement
- [ ] Les tutoriels s'ouvrent et se ferment
- [ ] La FAQ s'ouvre et se ferme
- [ ] Le bouton WhatsApp flottant est visible
- [ ] Le site est responsive sur mobile
- [ ] Les headers de sécurité sont présents (vérifier dans DevTools > Network > Response Headers)
- [ ] Le manifest PWA est accessible (/manifest.json)
- [ ] Le service worker est enregistré

**Test rapide des headers de sécurité** (depuis un terminal) :

```bash
# Remplacer URL par l'URL réelle de production
curl -I https://waze-gabon-club.vercel.app 2>/dev/null | grep -E "x-frame|x-content|referrer|permissions"
```

---

## VALIDATION

Afficher un rapport structuré :

```
Phase 5 — Controlled Deployment

URL de production : [URL]
Build size : [X] KB gzip
Flags activés : [liste]
Flags désactivés : [liste]
Liens placeholder restants : [liste ou "aucun"]
Headers de sécurité : [OK / problème]
PWA : [OK / problème]

Checklist :
✅ / ❌ [chaque item de la checklist]
```

Puis :

> "Phase 5 terminée. Le site est déployé en production avec [X] sections activées.
> Souhaitez-vous valider pour passer à la Phase 6 — Rollback Plan ?"

**Ne passe PAS à la Phase 6 sans validation explicite du fondateur.**

---

## ⚠️ NOTE IMPORTANTE SUR LES LIENS PLACEHOLDER

Si Claude Code détecte des liens placeholder (VOTRE_LIEN_ICI, etc.) encore présents dans config.js, il doit :

1. **Lister clairement** tous les placeholders restants
2. **Ne PAS bloquer** le déploiement — les liens fonctionneront quand même (ils ouvriront une page WhatsApp/Telegram/Facebook générique)
3. **Recommander** au fondateur de les remplacer dès que possible
4. **Indiquer** que le formulaire d'inscription (registerModal) est désactivé par flag, donc le placeholder Formspree n'est pas urgent

Le fondateur doit créer ses canaux communautaires et mettre à jour les liens. C'est une action humaine, pas une action Claude Code.

---

## NOTES DU CONSULTANT

> **De Claude (Opus) pour Claude Code :**
>
> Le déploiement sur Vercel est simple (push → auto-deploy) mais cette phase
> existe pour s'assurer qu'on ne déploie pas de problème en production.
>
> Les vraies questions avant le premier déploiement :
> 1. Le build passe-t-il sans erreur ?
> 2. Les flags sont-ils correctement configurés ?
> 3. Les liens placeholder sont-ils identifiés ?
> 4. Le panneau debug fonctionne-t-il ?
> 5. Le site est-il utilisable sur mobile ?
>
> Si le repository n'est pas encore connecté à Vercel, guide le fondateur
> pour la première configuration. Le fondateur a un compte GitHub.
> La connexion GitHub → Vercel est une action que le fondateur doit faire
> lui-même (authentification OAuth).
>
> Point important : le premier déploiement est un moment clé pour Michael.
> C'est le moment où son projet existe sur internet. Fais en sorte que
> l'expérience soit propre et sans surprise.

---

*SAFER METHOD™ — Phase 5 — Controlled Deployment*
*Rien n'arrive en production par accident. Chaque déploiement est vérifié.*
