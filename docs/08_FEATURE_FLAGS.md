# 08 — Feature Flags

> SAFER METHOD™ — Phase 3 — Feature Flag Strategy
> Dernière mise à jour : 26 février 2026

---

## 1. Inventaire des flags

| Flag | Section contrôlée | Description | Dev | Prod initial | Condition d'activation |
|------|-------------------|-------------|-----|-------------|----------------------|
| `hero` | Hero | Titre, badge, CTAs, stats | `true` | `true` | — |
| `features` | Avantages | 6 cartes de fonctionnalités Waze | `true` | `true` | — |
| `download` | Téléchargement | Liens App Store + Google Play | `true` | `true` | — |
| `tutorials` | Tutoriels | 6 tutoriels interactifs en accordéon | `true` | `true` | — |
| `livemap` | Carte Live | iFrame Waze + 6 deep links Libreville | `true` | `false` | Activer après test terrain : l'iFrame charge en <5s sur 4G gabonaise |
| `community` | Communauté | Cartes WhatsApp, Telegram, Facebook, éditeur + 4 étapes | `true` | `true` | — |
| `articles` | Actualités | 6 articles blog + calendrier éditorial | `true` | `false` | Activer après vérification que les 6 liens sources sont toujours actifs |
| `faq` | FAQ | 7 questions/réponses en accordéon | `true` | `true` | — |
| `footer` | Footer | Logo, liens, téléchargement, copyright, trademark | `true` | `true` | — |
| `floatingWhatsapp` | Bouton WhatsApp | Bouton flottant bas-droite avec animation pulse | `true` | `true` | — |
| `registerModal` | Modal inscription | Formulaire nom/email/pseudo + Facebook login + Formspree | `true` | `false` | Activer quand l'endpoint Formspree est créé et testé |
| `languageSwitcher` | Sélecteur FR/EN | Bouton de changement de langue dans la navigation | `true` | `true` | — |
| `privacySection` | Confidentialité | Lien/texte politique de confidentialité dans le footer | `true` | `true` | — |
| `debugPanel` | Panneau debug | Panneau technique activé par `?debug=flags` dans l'URL | `true` | `true` | Toujours true, activation par paramètre URL uniquement |

**Total : 14 flags** (13 fonctionnels + 1 debug)

---

## 2. Stratégie de rollout (Waves)

### Wave 1 — Fondation (Jour 1)

**Flags activés :** `hero`, `features`, `download`, `footer`, `languageSwitcher`, `privacySection`, `floatingWhatsapp`, `debugPanel`

**Objectif :** Le site est en ligne avec le contenu essentiel. Les visiteurs comprennent ce qu'est Waze Gabon Club, voient les avantages de Waze, et peuvent télécharger l'application.

**Validation :**
- Le site s'affiche correctement sur Chrome Android (mobile)
- Le site s'affiche correctement sur Safari iOS
- Le site s'affiche correctement sur desktop (Chrome, Firefox)
- Le sélecteur de langue FR/EN fonctionne
- Les liens App Store et Google Play s'ouvrent dans de nouveaux onglets
- Le bouton WhatsApp flottant est visible et cliquable
- Le footer affiche la mention trademark Waze/Google

---

### Wave 2 — Éducation (Jour 2-3)

**Flags ajoutés :** `tutorials`, `faq`

**Objectif :** Le contenu éducatif enrichit le site. Les utilisateurs apprennent à installer Waze, personnaliser leur profil, naviguer, signaler le trafic et éditer la carte.

**Validation :**
- Les 6 accordéons tutoriels s'ouvrent et se ferment correctement sur mobile
- Un seul tutoriel ouvert à la fois
- Les 7 FAQ s'ouvrent et se ferment correctement
- Le texte est lisible sur petit écran (pas de débordement)
- Les ancres de navigation (`#tutorials`, `#faq`) fonctionnent

---

### Wave 3 — Communauté (Jour 4-7)

**Flags ajoutés :** `community`, `livemap`

**Prérequis :**
- [ ] Le groupe WhatsApp est créé et le lien d'invitation est valide
- [ ] Le canal Telegram `@wazeGabon` est créé
- [ ] La page Facebook "Waze Gabon Club" existe
- [ ] L'iFrame Waze charge correctement sur le réseau gabonais (test Airtel 4G)
- [ ] Les liens placeholder dans `config.js` sont remplacés par les vrais liens

**Objectif :** Les canaux communautaires sont accessibles depuis le site. La carte live montre le trafic de Libreville en temps réel.

**Validation :**
- Le lien WhatsApp ouvre le bon groupe
- Le lien Telegram ouvre le bon canal
- Le lien Facebook ouvre la bonne page
- Le lien éditeur de carte ouvre `waze.com/editor`
- L'iFrame se charge en moins de 5 secondes sur 4G
- Les 6 deep links ouvrent Waze avec la bonne destination (ou le store si Waze n'est pas installé)

---

### Wave 4 — Complet (Jour 7-14)

**Flags ajoutés :** `articles`, `registerModal`

**Prérequis :**
- [ ] L'endpoint Formspree est créé (`formspree.io/f/XXXXX`) et testé
- [ ] Un email de test a été reçu par le fondateur via Formspree
- [ ] Les 6 liens d'articles sont vérifiés (pas de 404, contenus toujours en ligne)
- [ ] Le lien dans `config.js` pour Formspree est mis à jour

**Objectif :** Le site est complet avec toutes les fonctionnalités. Les visiteurs peuvent s'inscrire et les actualités Waze sont visibles.

**Validation :**
- Le formulaire d'inscription envoie un email au fondateur
- Le honeypot anti-spam fonctionne (soumission bloquée si champ `_gotcha` rempli)
- Le rate limiting empêche la soumission multiple (60s cooldown)
- L'écran de succès s'affiche après inscription
- Les 6 articles s'ouvrent dans un nouvel onglet avec `rel="noopener noreferrer"`
- Le calendrier éditorial Facebook est visible

---

## 3. Procédure de rollout

Pour activer une wave :

```
1. Ouvrir src/flags.js
2. Passer les flags de la wave à true
3. Commit : git commit -m "feat(flags): enable wave N — [sections]"
4. Push vers develop
5. Vérifier la preview Vercel (URL auto-générée)
6. Tester sur mobile (Chrome Android) + desktop
7. Créer une PR develop → main
8. Merge dans main
9. Vérifier la production
10. Passer au prérequis de la wave suivante
```

### Convention de commit pour les flags

```
feat(flags): enable wave 1 — hero, features, download, footer
feat(flags): enable wave 2 — tutorials, faq
feat(flags): enable wave 3 — community, livemap
feat(flags): enable wave 4 — articles, registerModal
```

---

## 4. Procédure de rollback

Si une section pose problème en production :

```
1. Ouvrir src/flags.js
2. Passer le flag problématique à false
3. Commit : git commit -m "fix(flags): disable [section] — [raison courte]"
4. Push directement vers main (exception aux règles de merge — urgence)
5. Vérifier que la section est masquée en production (~2 min auto-deploy Vercel)
6. Créer une branche fix/[description] pour investiguer le problème
7. Quand le fix est prêt : réactiver le flag + merge le fix via develop
```

### Exemples de rollback

```
fix(flags): disable livemap — iFrame timeout sur réseau Airtel
fix(flags): disable registerModal — Formspree quota dépassé
fix(flags): disable articles — lien blog.google/waze retourne 404
```

**Temps de rollback** : < 5 minutes (commit + push + auto-deploy Vercel)

---

## 5. Debug Panel

### Activation

Ajouter `?debug=flags` à l'URL :

```
http://localhost:5173/?debug=flags          (dev)
https://waze-gabon.vercel.app/?debug=flags  (prod)
```

### Ce qui est affiché

- Liste de tous les flags avec leur état actuel (vert = activé, rouge = désactivé)
- Compteur : `N/14 enabled`
- Date de build et mode Vite (development/production)

### Sécurité

- Le panneau n'est **jamais visible** sans le paramètre URL `?debug=flags`
- Le flag `debugPanel` doit être `true` ET le paramètre URL présent
- Pas d'information sensible dans le panneau (pas de clés API, pas de données utilisateur)
- En production, le panneau ne divulgue que l'état des flags (information publique car visible dans le code source)

---

## 6. Règles

1. **Un flag = une section** — Pas de flags composites contrôlant plusieurs sections
2. **Tous les flags sont `true` en dev** — Pour voir le site complet en développement local
3. **Les valeurs de prod suivent le plan de rollout** — Modifiées wave par wave
4. **Un flag `false` = section invisible** — Pas de placeholder "coming soon", pas de texte vide, la section n'existe pas dans le DOM
5. **Rollback en < 5 min** — Commit + push + auto-deploy, pas de processus complexe
6. **Flags statiques** — Ce sont des constantes, pas du state React. Modifier = redéployer. Pas de changement à chaud, pas de manipulation possible par l'utilisateur.

---

## 7. Architecture technique

```
src/flags.js
├── FLAGS (objet constant)
│   ├── hero: true
│   ├── features: true
│   ├── download: true
│   ├── tutorials: true
│   ├── livemap: true
│   ├── community: true
│   ├── articles: true
│   ├── faq: true
│   ├── footer: true
│   ├── floatingWhatsapp: true
│   ├── registerModal: true
│   ├── languageSwitcher: true
│   ├── privacySection: true
│   └── debugPanel: true
│
├── export default FLAGS
└── export function useFlags() → FLAGS
```

**Pourquoi pas de React Context ?** Les flags sont des constantes build-time. Ils ne changent pas au runtime. Un simple objet importé est plus léger et plus prévisible qu'un Context.

**Pourquoi `useFlags()` si c'est juste un import ?** Convention : les composants utilisent des hooks. Si un jour les flags deviennent dynamiques (ex: A/B testing), seul `useFlags()` changera — les composants restent identiques.

---

*SAFER METHOD™ — Phase 3 — Feature Flag Strategy*
*Chaque feature est contrôlée. Rien n'arrive en production par accident.*
