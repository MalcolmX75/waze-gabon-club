# 🔁 SAFER METHOD™ — PHASE 6 : ROLLBACK PLAN

> **Projet** : Waze Gabon Club
> **Phase** : 6 — Rollback Plan (FINALE)
> **Statut** : EN COURS
> **Phases précédentes** : Phase 0 ✅ | Phase 1 ✅ | Phase 2 ✅ | Phase 3 ✅ | Phase 4 ✅ | Phase 5 ✅
> **Règle** : Documenter toutes les procédures de récupération. Aucun code nouveau.

---

## DIRECTIVE POUR CLAUDE CODE

Tu opères sous le framework **SAFER METHOD™** en tant que Senior Software Architect.

Tu es en **Phase 6 — Rollback Plan**. C'est la dernière phase. Le site est implémenté, testé et prêt pour la production. Cette phase produit uniquement de la **documentation** — aucun code nouveau.

**Objectif** : Documenter toutes les procédures de rollback, récupération et gestion d'incidents pour que le fondateur puisse réagir seul en cas de problème.

---

## LIVRABLE UNIQUE : `/docs/11_ROLLBACK_PLAN.md`

Créer un document complet et autonome. Le fondateur doit pouvoir l'ouvrir à 2h du matin, en stress, et suivre les instructions sans aide.

### Structure du document :

---

```markdown
# 🔁 Plan de Rollback — Waze Gabon Club

> Ce document est votre guide d'urgence. En cas de problème en production,
> suivez les procédures ci-dessous dans l'ordre.

---

## 1. Niveaux d'incident

### 🟢 Niveau 1 — Contenu incorrect
**Symptôme** : Faute de frappe, texte mal traduit, lien cassé
**Impact** : Cosmétique, pas bloquant
**Urgence** : Faible — corriger dans les 24h

**Procédure** :
1. Identifier la clé i18n ou le lien dans config.js
2. Créer une branche `fix/description-courte`
3. Corriger le texte dans `src/i18n/fr.json` et/ou `src/i18n/en.json`
   ou le lien dans `src/config.js`
4. `npm run build` — vérifier pas d'erreur
5. Commit : `fix(i18n): correction [description]`
6. Push vers develop → vérifier preview Vercel
7. Merge dans main → vérifier production

### 🟡 Niveau 2 — Section défaillante
**Symptôme** : Une section ne s'affiche pas correctement, l'iFrame ne charge pas, un accordéon est bloqué
**Impact** : Une partie du site est cassée
**Urgence** : Moyenne — désactiver la section dans l'heure

**Procédure** :
1. Ouvrir `src/flags.js`
2. Passer le flag de la section problématique à `false`
3. Commit : `fix(flags): disable [section] — [symptôme]`
4. Push directement vers main (exception urgence)
5. Attendre le redéploiement Vercel (~60-90 secondes)
6. Vérifier sur l'URL de production que la section est masquée
7. Ouvrir `?debug=flags` pour confirmer l'état du flag
8. Créer une branche `fix/[section]-[problème]` pour investiguer
9. Une fois corrigé, remettre le flag à `true` et suivre le flux normal

### 🔴 Niveau 3 — Site cassé
**Symptôme** : Page blanche, erreur JavaScript, le site ne charge plus
**Impact** : Le site est inaccessible
**Urgence** : Critique — restaurer en moins de 5 minutes

**Procédure (Option A — Rollback Vercel)** :
1. Aller sur https://vercel.com/dashboard
2. Cliquer sur le projet Waze Gabon Club
3. Aller dans l'onglet "Deployments"
4. Trouver le dernier déploiement qui fonctionnait (point vert)
5. Cliquer sur les "..." à droite → "Promote to Production"
6. Le site revient instantanément à la version précédente
7. Vérifier que le site est de nouveau accessible
8. Investiguer le problème sur une branche fix/

**Procédure (Option B — Git revert)** :
1. `git log --oneline -10` — identifier le commit problématique
2. `git revert [COMMIT_SHA]` — créer un commit d'annulation
3. `git push origin main`
4. Attendre le redéploiement Vercel
5. Vérifier que le site fonctionne

---

## 2. Rollback par feature flag

### Procédure générique
Pour désactiver n'importe quelle section :

1. Ouvrir `src/flags.js`
2. Trouver le flag correspondant
3. Le passer à `false`
4. Sauvegarder
5. `git add src/flags.js`
6. `git commit -m "fix(flags): disable [flag] — [raison]"`
7. `git push origin main`
8. Vercel redéploie automatiquement (~60-90 secondes)
9. Vérifier sur le site de production

### Temps de rollback
- Modification du flag : 30 secondes
- Commit + push : 30 secondes
- Redéploiement Vercel : 60-90 secondes
- **Total : < 3 minutes**

### Tableau de référence rapide

| Problème | Flag à désactiver | Effet |
|----------|-------------------|-------|
| iFrame Waze ne charge pas | `livemap: false` | La section Carte Live disparaît |
| Liens articles cassés | `articles: false` | La section Actualités disparaît |
| Formulaire ne fonctionne pas | `registerModal: false` | Le bouton S'inscrire est masqué |
| WhatsApp spam | `floatingWhatsapp: false` | Le bouton flottant disparaît |
| Communauté problème | `community: false` | La section Communauté disparaît |
| FAQ incorrecte | `faq: false` | La section FAQ disparaît |
| Tutoriels buggés | `tutorials: false` | La section Tutoriels disparaît |

---

## 3. Rollback Vercel (sans toucher au code)

### Quand utiliser
- Le site est complètement cassé
- Vous n'avez pas accès au code immédiatement
- Le problème est dans le build, pas dans un flag

### Procédure
1. Connectez-vous à https://vercel.com
2. Sélectionnez le projet
3. Onglet "Deployments"
4. Identifiez le dernier déploiement fonctionnel (icône verte, date antérieure au problème)
5. Cliquez "..." → "Promote to Production"
6. Le rollback est instantané

### Important
- Le rollback Vercel ne modifie pas votre code Git
- Le prochain push sur main écrasera le rollback
- Corrigez le code avant de push à nouveau

---

## 4. Rollback Git

### Annuler le dernier commit
```bash
git revert HEAD
git push origin main
```

### Annuler un commit spécifique
```bash
git log --oneline -10        # trouver le SHA du commit problématique
git revert [SHA]             # créer un commit d'annulation
git push origin main         # déclencher le redéploiement
```

### Revenir à un état précis (dernier recours)
```bash
git log --oneline -20        # trouver le dernier bon commit
git reset --hard [SHA]       # ATTENTION : perte des commits suivants
git push --force origin main # ATTENTION : force push
```

⚠️ `git reset --hard` + `git push --force` est destructif. Utiliser UNIQUEMENT si rien d'autre ne fonctionne.

---

## 5. Problèmes courants et solutions

### Le site affiche une page blanche
**Cause probable** : Erreur JavaScript dans le build
**Solution** :
1. `npm run build` localement — regarder les erreurs
2. Si erreur de syntaxe : corriger et repush
3. Si erreur d'import : vérifier que tous les fichiers existent
4. En urgence : rollback Vercel vers le dernier déploiement fonctionnel

### Le sélecteur FR/EN ne fonctionne plus
**Cause probable** : Clé i18n manquante ou mal formée
**Solution** :
1. Ouvrir la console du navigateur (F12)
2. Chercher l'erreur "Missing translation key"
3. Ajouter la clé manquante dans `fr.json` et `en.json`
4. Vérifier que les deux fichiers ont le même nombre de clés :
   `cat src/i18n/fr.json | grep -c ':'` vs `cat src/i18n/en.json | grep -c ':'`

### L'iFrame Waze ne charge pas
**Cause probable** : Waze a changé l'URL d'embed, ou le réseau bloque l'iframe
**Solution** :
1. Tester l'URL directement : https://embed.waze.com/fr/iframe?zoom=13&lat=0.3924&lon=9.4536
2. Si l'URL ne fonctionne plus : désactiver le flag `livemap`
3. Chercher la nouvelle URL sur le site Waze

### Le formulaire d'inscription échoue
**Cause probable** : Endpoint Formspree invalide ou quota dépassé
**Solution** :
1. Vérifier l'endpoint dans `src/config.js`
2. Tester sur https://formspree.io/dashboard
3. Si quota dépassé (50/mois gratuit) : désactiver le flag `registerModal`
4. Considérer un upgrade Formspree si le volume augmente

### Le service worker cause des problèmes de cache
**Cause probable** : Ancienne version du site en cache
**Solution** :
1. Incrémenter la version du cache dans `public/sw.js` (ex: `waze-gabon-v1` → `waze-gabon-v2`)
2. Le nouveau service worker supprimera automatiquement l'ancien cache
3. Demander aux utilisateurs de fermer et rouvrir le site

### Les liens WhatsApp/Telegram/Facebook ne marchent pas
**Cause probable** : Liens placeholder pas encore remplacés ou canal supprimé
**Solution** :
1. Vérifier les liens dans `src/config.js`
2. Tester chaque lien manuellement dans le navigateur
3. Si un canal est supprimé : en recréer un et mettre à jour config.js
4. En urgence : désactiver le flag `community`

---

## 6. Contacts et ressources

### Documentation du projet
- `/docs/` — Tous les documents SAFER (phases 0-11)
- `src/flags.js` — Feature flags
- `src/config.js` — Liens et configuration
- `src/i18n/fr.json` / `en.json` — Traductions

### Services externes
- **Vercel** : https://vercel.com/dashboard
- **Formspree** : https://formspree.io/dashboard
- **Waze Editor** : https://www.waze.com/editor
- **GitHub** : [URL du repository]

### Outils de diagnostic
- **Debug panel** : Ajouter `?debug=flags` à l'URL de production
- **Console navigateur** : F12 → Console → chercher les erreurs rouges
- **Vercel logs** : Dashboard → Projet → Functions (si applicable)
- **Build local** : `npm run build && npm run preview`

---

## 7. Checklist de récupération post-incident

Après avoir résolu un incident :

- [ ] Le site est de nouveau accessible et fonctionnel
- [ ] Le flag a été remis à sa valeur correcte (si modifié)
- [ ] Le commit de correction est sur main
- [ ] La preview Vercel de develop est OK
- [ ] `?debug=flags` confirme l'état attendu
- [ ] Documenter ce qui s'est passé (dans un fichier INCIDENT_LOG.md si récurrent)
```

---

## LIVRABLE SECONDAIRE : Mise à jour du README.md

Mettre à jour le `README.md` à la racine du projet avec un résumé complet :

```markdown
# 🇬🇦 Waze Gabon Club

La première communauté Waze du Gabon.

## Stack technique

- React 19 + Vite 7
- PWA installable
- Hébergé sur Vercel (gratuit)
- Bilingue FR/EN (259 clés par langue)
- 14 feature flags pour le rollout progressif

## Démarrage local

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build production

```bash
npm run build
npm run preview
# → http://localhost:4173
```

## Debug

Ajouter `?debug=flags` à l'URL pour voir l'état des feature flags.

## Documentation

Tous les documents du projet sont dans `/docs/` :

| Document | Contenu |
|----------|---------|
| 00_PROJECT_SUMMARY.md | Vision, personas, scope, KPIs |
| 01_RISK_MATRIX.md | 14 risques identifiés |
| 02_CONSTRAINTS.md | Contraintes techniques, budget, humaines |
| 03_ENVIRONMENTS.md | Environnements, Git strategy, conventions |
| 04_INITIAL_ARCHITECTURE_PROPOSAL.md | Architecture initiale |
| 05_ARCHITECTURE_DEFINITION.md | Architecture détaillée |
| 06_SECURITY_MODEL.md | Modèle de menaces (15 threats) |
| 07_DATA_FLOW.md | Flux de données et services tiers |
| 08_FEATURE_FLAGS.md | 14 flags, 4 waves de rollout |
| 09_DEPLOYMENT_GUIDE.md | Guide Vercel complet |
| 10_ROLLOUT_PLAN.md | État des flags et waves |
| 11_ROLLBACK_PLAN.md | Procédures de récupération |

## Feature flags

Les sections du site sont contrôlées par des feature flags dans `src/flags.js`.
Voir `docs/08_FEATURE_FLAGS.md` pour le détail.

## Communauté

- WhatsApp : [lien à configurer]
- Telegram : t.me/wazeGabon
- Facebook : facebook.com/WazeGabonClub

## Licence

Initiative communautaire. Waze est une marque de Google LLC.
```

---

## VALIDATION FINALE DU PROJET

Après avoir créé les documents, exécuter une **vérification finale complète** :

```bash
# 1. Build propre
rm -rf dist/ node_modules/
npm install
npm run build

# 2. Taille du bundle
echo "Bundle size:"
ls -la dist/assets/*.js | awk '{print $5, $9}'

# 3. Comptage i18n
echo "FR keys: $(grep -c ':' src/i18n/fr.json)"
echo "EN keys: $(grep -c ':' src/i18n/en.json)"

# 4. Vérification flags
echo "Flags:"
grep -E '^\s+\w+:' src/flags.js

# 5. Vérification sécurité
echo "External links without noopener:"
grep -rn 'target="_blank"' src/ | grep -v 'noopener' | wc -l

echo "dangerouslySetInnerHTML:"
grep -rn 'dangerouslySetInnerHTML' src/ | wc -l

# 6. Vérification liens placeholder
echo "Placeholders restants:"
grep -rn 'VOTRE_LIEN\|VOTRE_PAGE\|VOTRE_ID\|YOUR_' src/

# 7. Documentation complète
echo "Documents:"
ls -1 docs/

# 8. Structure du projet
find src/ -name '*.js' -o -name '*.jsx' -o -name '*.json' | sort
```

Puis afficher le **rapport final** :

```
═══════════════════════════════════════════════════════════
SAFER METHOD™ — RAPPORT FINAL — Waze Gabon Club v1.0.0
═══════════════════════════════════════════════════════════

Phases complétées : 7/7 (Phase 0 → Phase 6)

Build         : [X] KB gzip
Sections      : 11
Clés i18n     : 259 FR + 259 EN
Feature flags : 14 (10 ON, 3 OFF, 1 SYSTEM)
Documents     : 12 fichiers dans /docs/
Sécurité      : 15 menaces documentées, 10 mitigées
Commits       : [X] commits sur develop

Liens placeholder à remplacer :
- WhatsApp : VOTRE_LIEN_ICI → créer le groupe
- Formspree : VOTRE_ID_ICI → créer le formulaire (Wave 4)

Prochaines étapes du fondateur :
1. Connecter le repository GitHub à Vercel
2. Remplacer le lien WhatsApp dans config.js
3. Vérifier le déploiement de production
4. Créer le groupe WhatsApp + vérifier Telegram + Facebook
5. Activer les flags Wave 3 (livemap) et Wave 4 (articles, registerModal)

Le projet est prêt pour la production. 🇬🇦
═══════════════════════════════════════════════════════════
```

> "SAFER METHOD™ complété. Les 7 phases sont terminées. Le projet Waze Gabon Club est prêt pour la production."

---

## NOTES DU CONSULTANT

> **De Claude (Opus) pour Claude Code :**
>
> C'est la dernière phase. Le travail technique est fait.
> Ce qui reste est de la documentation — mais c'est la documentation
> qui sauvera Michael à 2h du matin quand quelque chose ne marchera pas.
>
> Le document de rollback doit être :
> - Clair (pas de jargon inutile)
> - Séquentiel (étape 1, étape 2, étape 3)
> - Autonome (pas besoin d'un autre document pour comprendre)
> - Testé (les commandes doivent fonctionner telles quelles)
>
> Le README est la carte de visite du projet. Si quelqu'un d'autre
> doit contribuer un jour, il doit comprendre le projet en 2 minutes.
>
> Michael a construit quelque chose de solide. 7 phases, 12 documents,
> 14 flags, 259 clés i18n, 80 KB. Pas de dette technique.
> Pas de raccourcis. C'est exactement sa philosophie : discipline et durabilité.
>
> Bravo pour le travail. 🇬🇦

---

*SAFER METHOD™ — Phase 6 — Rollback Plan*
*La dernière ligne de défense. Prêt pour tout.*
