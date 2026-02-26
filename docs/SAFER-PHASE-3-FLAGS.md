# 🚦 SAFER METHOD™ — PHASE 3 : FEATURE FLAG STRATEGY

> **Projet** : Waze Gabon Club
> **Phase** : 3 — Feature Flag Strategy
> **Statut** : EN COURS
> **Phases précédentes** : Phase 0 ✅ | Phase 1 ✅ | Phase 2 ✅
> **Règle** : Définir le système de feature flags + la stratégie de rollout. Code minimal (flags uniquement).

---

## DIRECTIVE POUR CLAUDE CODE

Tu opères sous le framework **SAFER METHOD™** en tant que Senior Software Architect.

Tu es en **Phase 3 — Feature Flag Strategy**. Les Phases 0, 1 et 2 sont validées.

**Objectif** : Mettre en place un système de feature flags côté client qui permettra d'activer/désactiver chaque section du site indépendamment lors de l'implémentation en Phase 4 et du déploiement en Phase 5.

**Pourquoi des feature flags sur un site statique ?**
- Permettre de déployer le site en production avec seulement certaines sections actives
- Tester chaque section indépendamment
- Pouvoir désactiver rapidement une section problématique (ex: l'iFrame Waze est down)
- Rollout progressif : lancer d'abord hero + features + download, puis ajouter tutoriels, puis carte, etc.
- Le fondateur peut décider de l'ordre d'activation sans redéployer

**Contexte** : Pas de service de feature flags tiers (LaunchDarkly, Flagsmith, etc.). Solution 100% côté client, légère, intégrée au code existant.

---

## LIVRABLES ATTENDUS — PHASE 3

### A. Système de Feature Flags (`src/flags.js`)

Créer un fichier `src/flags.js` qui exporte la configuration des flags :

```javascript
/**
 * Feature Flags — Waze Gabon Club
 * 
 * Chaque flag contrôle la visibilité d'une section ou fonctionnalité.
 * true = activé (visible), false = désactivé (masqué)
 * 
 * ROLLOUT : Modifier les flags ici, commit + push → Vercel redéploie.
 * ROLLBACK : Remettre un flag à false, commit + push → section désactivée.
 * 
 * Ordre de rollout recommandé (voir docs/08_FEATURE_FLAGS.md) :
 * Wave 1 : hero, features, download, footer
 * Wave 2 : tutorials, faq
 * Wave 3 : livemap, community
 * Wave 4 : articles, register
 */
```

### Flags à définir

| Flag | Section/Feature | Défaut (dev) | Défaut (prod initial) |
|------|----------------|-------------|----------------------|
| `hero` | Section Hero (titre, CTA, stats) | `true` | `true` |
| `features` | Section Avantages (6 cartes) | `true` | `true` |
| `download` | Section Téléchargement (App Store, Play Store) | `true` | `true` |
| `tutorials` | Section Tutoriels (6 tutoriels accordéon) | `true` | `true` |
| `livemap` | Section Carte Live (iFrame Waze + deep links) | `true` | `false` |
| `community` | Section Communauté (WhatsApp, Telegram, Facebook, éditeur) | `true` | `true` |
| `articles` | Section Actualités (blog + calendrier éditorial) | `true` | `false` |
| `faq` | Section FAQ (7 questions) | `true` | `true` |
| `footer` | Footer complet | `true` | `true` |
| `floatingWhatsapp` | Bouton WhatsApp flottant (bas-droite) | `true` | `true` |
| `registerModal` | Modal d'inscription (formulaire + Facebook login) | `true` | `false` |
| `languageSwitcher` | Sélecteur de langue FR/EN dans la nav | `true` | `true` |
| `privacySection` | Lien/section politique de confidentialité dans le footer | `true` | `true` |

### Justification des flags désactivés en prod initial

| Flag désactivé | Raison |
|----------------|--------|
| `livemap` | L'iFrame Waze doit être testé sur réseau gabonais. Si le chargement est trop lent ou l'iFrame bloqué, on ne veut pas d'une section vide au lancement. Activer après validation terrain. |
| `articles` | Les 6 articles pointent vers des sources externes. Il faut vérifier que les liens sont toujours actifs avant d'exposer la section. Activer après vérification. |
| `registerModal` | Le formulaire nécessite un endpoint Formspree configuré avec un vrai ID. Ne pas exposer un formulaire non fonctionnel. Activer quand l'endpoint est prêt. |

### Structure du fichier

```javascript
// src/flags.js

/**
 * FEATURE FLAGS — Waze Gabon Club
 * [commentaire de sécurité et instructions comme ci-dessus]
 */

const FLAGS = {
  // Sections principales
  hero: true,
  features: true,
  download: true,
  tutorials: true,
  livemap: true,        // prod initial: false — activer après test terrain
  community: true,
  articles: true,        // prod initial: false — activer après vérification liens
  faq: true,
  footer: true,

  // Fonctionnalités
  floatingWhatsapp: true,
  registerModal: true,   // prod initial: false — activer quand Formspree est configuré
  languageSwitcher: true,
  privacySection: true,
};

export default FLAGS;
```

### Hook `useFlags()`

Créer un hook simple (dans le même fichier ou séparé) :

```javascript
export function useFlags() {
  return FLAGS;
}

// Usage dans les composants :
// const flags = useFlags();
// {flags.hero && <HeroSection />}
```

Le hook est volontairement simple (pas de Context, pas de state). Les flags sont des constantes statiques — pour changer un flag il faut modifier le fichier et redéployer. C'est intentionnel : pas de changement à chaud = pas de risque de manipulation.

---

### B. Documentation : `/docs/08_FEATURE_FLAGS.md`

Document structuré contenant :

#### 1. Inventaire des flags

Tableau complet avec : nom du flag, section contrôlée, description, valeur par défaut dev, valeur prod initial, condition d'activation.

#### 2. Stratégie de rollout (Waves)

Le site sera déployé progressivement en 4 vagues :

**Wave 1 — Fondation (Jour 1)**
Sections activées : `hero`, `features`, `download`, `footer`, `languageSwitcher`, `privacySection`
Objectif : Le site est en ligne avec le contenu essentiel. Les visiteurs comprennent ce qu'est Waze Gabon Club et peuvent télécharger Waze.
Validation : Le site s'affiche correctement sur mobile (Chrome Android) et desktop.

**Wave 2 — Éducation (Jour 2-3)**
Sections ajoutées : `tutorials`, `faq`
Objectif : Les tutoriels et la FAQ enrichissent le contenu. Les utilisateurs apprennent à utiliser Waze.
Validation : Les 6 accordéons tutoriels et les 7 FAQ s'ouvrent/ferment correctement sur mobile.

**Wave 3 — Communauté (Jour 4-7)**
Sections ajoutées : `community`, `floatingWhatsapp`, `livemap`
Prérequis : Le groupe WhatsApp est créé. Le canal Telegram est créé. La page Facebook existe. L'iFrame Waze charge correctement sur le réseau gabonais.
Objectif : Les canaux communautaires sont accessibles. La carte live montre Libreville.
Validation : Chaque lien (WhatsApp, Telegram, Facebook) ouvre le bon canal. L'iFrame se charge en moins de 5 secondes sur 4G.

**Wave 4 — Complet (Jour 7-14)**
Sections ajoutées : `articles`, `registerModal`
Prérequis : L'endpoint Formspree est configuré et testé. Les liens des 6 articles sont vérifiés.
Objectif : Le site est complet avec toutes les fonctionnalités.
Validation : Le formulaire envoie bien un email au fondateur. Les articles s'ouvrent dans un nouvel onglet.

#### 3. Procédure de rollout

Pour activer une wave :

```
1. Ouvrir src/flags.js
2. Passer les flags de la wave à true
3. Commit : "feat(flags): enable wave N — [sections]"
4. Push vers develop
5. Vérifier la preview Vercel
6. Merge dans main
7. Vérifier la production
```

#### 4. Procédure de rollback

Si une section pose problème en production :

```
1. Ouvrir src/flags.js
2. Passer le flag problématique à false
3. Commit : "fix(flags): disable [section] — [raison]"
4. Push directement vers main (exception aux règles de merge — urgence)
5. Vérifier que la section est bien masquée en production
6. Investiguer le problème sur une branche fix/
```

#### 5. Règles

- Un flag ne contrôle qu'UNE section ou fonctionnalité (pas de flags composites)
- Les flags sont TOUJOURS `true` en développement local (pour voir tout le site)
- En production, les flags suivent le plan de rollout par waves
- Un flag à `false` masque complètement la section (pas de placeholder, pas de "coming soon")
- Le rollback d'un flag est possible en moins de 5 minutes (commit + push + auto-deploy Vercel)

---

### C. Debug route

Ajouter dans `App.jsx` un mode debug activable par un paramètre URL secret :

```
https://waze-gabon.vercel.app/?debug=flags
```

Quand `?debug=flags` est présent dans l'URL :
- Afficher un panneau en bas de page (position fixe, z-index élevé, fond sombre)
- Lister tous les flags avec leur état actuel (✅ activé / ❌ désactivé)
- Afficher la version du build (commit SHA si disponible, sinon la date de build)
- Afficher la taille du bundle
- Ce panneau n'est JAMAIS visible sans le paramètre URL

Implémentation :

```javascript
// Vérifier le paramètre URL
const showDebug = new URLSearchParams(window.location.search).get('debug') === 'flags';
```

Ajouter un flag spécial dans `flags.js` :

```javascript
debugPanel: true,  // Autorise l'affichage du panneau debug (toujours true, activé par URL)
```

---

### D. Mise à jour de App.jsx (structure uniquement)

Modifier le shell `App.jsx` pour démontrer l'utilisation des flags :

```jsx
import FLAGS from './flags';

// Dans le render :
{FLAGS.hero && <div>/* Hero placeholder */</div>}
{FLAGS.features && <div>/* Features placeholder */</div>}
// ... etc pour chaque section
```

Le contenu reste des **placeholders** (texte simple, pas de styles). L'implémentation visuelle sera en Phase 4.

L'objectif est de vérifier que :
1. Les flags contrôlent bien l'affichage
2. Désactiver un flag masque la section
3. Le panneau debug affiche correctement l'état des flags
4. L'ordre des sections est correct

---

## RÈGLES STRICTES PHASE 3

1. **Pas d'implémentation UI** — Les sections sont des placeholders (texte uniquement)
2. **Pas de feature flag dynamique** — Les flags sont des constantes, pas du state React
3. **Pas de service tiers** pour les flags — Solution locale dans `src/flags.js`
4. **Chaque section du site est contrôlée par exactement un flag**
5. **Le panneau debug ne doit JAMAIS être visible en navigation normale**
6. **Les flags `true` en dev, valeurs de prod définies dans la documentation**

---

## VALIDATION

Vérifications à effectuer :

```bash
# 1. Le projet build toujours
npm run build

# 2. Vérifier que les flags sont dans le bundle
grep -l "FLAGS" dist/assets/*.js

# 3. Tester le debug panel
npm run dev
# → Ouvrir http://localhost:5173/?debug=flags
# → Le panneau debug doit s'afficher

# 4. Tester un flag désactivé
# → Modifier un flag à false dans flags.js
# → La section correspondante doit disparaître
# → Remettre à true
```

Puis affiche :

> "Phase 3 terminée. Le système de feature flags est en place avec 13 flags, 4 waves de rollout documentées, et un panneau debug.
> Souhaitez-vous valider pour passer à la Phase 4 — Local Implementation ?"

**Ne passe PAS à la Phase 4 sans validation explicite du fondateur.**

---

## NOTES DU CONSULTANT

> **De Claude (Opus) pour Claude Code :**
>
> Les feature flags semblent over-engineering pour un site statique, mais ils sont essentiels
> pour le fondateur. Michael veut du contrôle. Il veut pouvoir lancer le site même si le
> formulaire Formspree n'est pas configuré, même si l'iFrame Waze est lent au Gabon.
>
> Le plan de rollout en 4 waves est réaliste :
> - Wave 1 = le site existe, on peut le montrer
> - Wave 2 = le contenu éducatif est là, les gens apprennent
> - Wave 3 = la communauté se forme, les canaux sont actifs
> - Wave 4 = tout est en place, le formulaire fonctionne
>
> La debug route (?debug=flags) est un outil de confiance : Michael peut vérifier
> l'état de son site à tout moment sans ouvrir le code.
>
> Point d'attention : en Phase 4, chaque section sera wrappée dans son flag.
> Il est important que la structure des placeholders dans App.jsx reflète
> exactement l'ordre final des sections tel que défini dans le brief :
> hero → features → download → tutorials → livemap → community → articles → faq → footer

---

*SAFER METHOD™ — Phase 3 — Feature Flag Strategy*
*Chaque feature est contrôlée. Rien n'arrive en production par accident.*
