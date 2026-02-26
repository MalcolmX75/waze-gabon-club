# Plan de Rollback — Waze Gabon Club

> Ce document est votre guide d'urgence. En cas de probleme en production,
> suivez les procedures ci-dessous dans l'ordre.

---

## 1. Niveaux d'incident

### Niveau 1 — Contenu incorrect
**Symptome** : Faute de frappe, texte mal traduit, lien casse
**Impact** : Cosmetique, pas bloquant
**Urgence** : Faible — corriger dans les 24h

**Procedure** :
1. Identifier la cle i18n ou le lien dans config.js
2. Creer une branche `fix/description-courte`
3. Corriger le texte dans `src/i18n/fr.json` et/ou `src/i18n/en.json`
   ou le lien dans `src/config.js`
4. `npm run build` — verifier pas d'erreur
5. Commit : `fix(i18n): correction [description]`
6. Push vers develop → verifier preview Vercel
7. Merge dans main → verifier production

### Niveau 2 — Section defaillante
**Symptome** : Une section ne s'affiche pas correctement, l'iFrame ne charge pas, un accordeon est bloque
**Impact** : Une partie du site est cassee
**Urgence** : Moyenne — desactiver la section dans l'heure

**Procedure** :
1. Ouvrir `src/flags.js`
2. Passer le flag de la section problematique a `false`
3. Commit : `fix(flags): disable [section] — [symptome]`
4. Push directement vers main (exception urgence)
5. Attendre le redeploiement Vercel (~60-90 secondes)
6. Verifier sur l'URL de production que la section est masquee
7. Ouvrir `?debug=flags` pour confirmer l'etat du flag
8. Creer une branche `fix/[section]-[probleme]` pour investiguer
9. Une fois corrige, remettre le flag a `true` et suivre le flux normal

### Niveau 3 — Site casse
**Symptome** : Page blanche, erreur JavaScript, le site ne charge plus
**Impact** : Le site est inaccessible
**Urgence** : Critique — restaurer en moins de 5 minutes

**Procedure (Option A — Rollback Vercel)** :
1. Aller sur https://vercel.com/dashboard
2. Cliquer sur le projet Waze Gabon Club
3. Aller dans l'onglet "Deployments"
4. Trouver le dernier deploiement qui fonctionnait (point vert)
5. Cliquer sur les "..." a droite → "Promote to Production"
6. Le site revient instantanement a la version precedente
7. Verifier que le site est de nouveau accessible
8. Investiguer le probleme sur une branche fix/

**Procedure (Option B — Git revert)** :
1. `git log --oneline -10` — identifier le commit problematique
2. `git revert [COMMIT_SHA]` — creer un commit d'annulation
3. `git push origin main`
4. Attendre le redeploiement Vercel
5. Verifier que le site fonctionne

---

## 2. Rollback par feature flag

### Procedure generique
Pour desactiver n'importe quelle section :

1. Ouvrir `src/flags.js`
2. Trouver le flag correspondant
3. Le passer a `false`
4. Sauvegarder
5. `git add src/flags.js`
6. `git commit -m "fix(flags): disable [flag] — [raison]"`
7. `git push origin main`
8. Vercel redeploie automatiquement (~60-90 secondes)
9. Verifier sur le site de production

### Temps de rollback
- Modification du flag : 30 secondes
- Commit + push : 30 secondes
- Redeploiement Vercel : 60-90 secondes
- **Total : < 3 minutes**

### Tableau de reference rapide

| Probleme | Flag a desactiver | Effet |
|----------|-------------------|-------|
| iFrame Waze ne charge pas | `livemap: false` | La section Carte Live disparait |
| Liens articles casses | `articles: false` | La section Actualites disparait |
| Formulaire ne fonctionne pas | `registerModal: false` | Le bouton S'inscrire est masque |
| WhatsApp spam | `floatingWhatsapp: false` | Le bouton flottant disparait |
| Communaute probleme | `community: false` | La section Communaute disparait |
| FAQ incorrecte | `faq: false` | La section FAQ disparait |
| Tutoriels bugges | `tutorials: false` | La section Tutoriels disparait |

---

## 3. Rollback Vercel (sans toucher au code)

### Quand utiliser
- Le site est completement casse
- Vous n'avez pas acces au code immediatement
- Le probleme est dans le build, pas dans un flag

### Procedure
1. Connectez-vous a https://vercel.com
2. Selectionnez le projet
3. Onglet "Deployments"
4. Identifiez le dernier deploiement fonctionnel (icone verte, date anterieure au probleme)
5. Cliquez "..." → "Promote to Production"
6. Le rollback est instantane

### Important
- Le rollback Vercel ne modifie pas votre code Git
- Le prochain push sur main ecrasera le rollback
- Corrigez le code avant de push a nouveau

---

## 4. Rollback Git

### Annuler le dernier commit
```bash
git revert HEAD
git push origin main
```

### Annuler un commit specifique
```bash
git log --oneline -10        # trouver le SHA du commit problematique
git revert [SHA]             # creer un commit d'annulation
git push origin main         # declencher le redeploiement
```

### Revenir a un etat precis (dernier recours)
```bash
git log --oneline -20        # trouver le dernier bon commit
git reset --hard [SHA]       # ATTENTION : perte des commits suivants
git push --force origin main # ATTENTION : force push
```

**ATTENTION** : `git reset --hard` + `git push --force` est destructif. Utiliser UNIQUEMENT si rien d'autre ne fonctionne.

---

## 5. Problemes courants et solutions

### Le site affiche une page blanche
**Cause probable** : Erreur JavaScript dans le build
**Solution** :
1. `npm run build` localement — regarder les erreurs
2. Si erreur de syntaxe : corriger et repush
3. Si erreur d'import : verifier que tous les fichiers existent
4. En urgence : rollback Vercel vers le dernier deploiement fonctionnel

### Le selecteur FR/EN ne fonctionne plus
**Cause probable** : Cle i18n manquante ou mal formee
**Solution** :
1. Ouvrir la console du navigateur (F12)
2. Chercher l'erreur "Missing translation key"
3. Ajouter la cle manquante dans `fr.json` et `en.json`
4. Verifier que les deux fichiers ont le meme nombre de cles :
   `cat src/i18n/fr.json | grep -c ':'` vs `cat src/i18n/en.json | grep -c ':'`

### L'iFrame Waze ne charge pas
**Cause probable** : Waze a change l'URL d'embed, ou le reseau bloque l'iframe
**Solution** :
1. Tester l'URL directement : https://embed.waze.com/fr/iframe?zoom=13&lat=0.3924&lon=9.4536
2. Si l'URL ne fonctionne plus : desactiver le flag `livemap`
3. Chercher la nouvelle URL sur le site Waze

### Le formulaire d'inscription echoue
**Cause probable** : Endpoint Formspree invalide ou quota depasse
**Solution** :
1. Verifier l'endpoint dans `src/config.js`
2. Tester sur https://formspree.io/dashboard
3. Si quota depasse (50/mois gratuit) : desactiver le flag `registerModal`
4. Considerer un upgrade Formspree si le volume augmente

### Le service worker cause des problemes de cache
**Cause probable** : Ancienne version du site en cache
**Solution** :
1. Incrementer la version du cache dans `public/sw.js` (ex: `waze-gabon-v1` → `waze-gabon-v2`)
2. Le nouveau service worker supprimera automatiquement l'ancien cache
3. Demander aux utilisateurs de fermer et rouvrir le site

### Les liens WhatsApp/Telegram/Facebook ne marchent pas
**Cause probable** : Liens placeholder pas encore remplaces ou canal supprime
**Solution** :
1. Verifier les liens dans `src/config.js`
2. Tester chaque lien manuellement dans le navigateur
3. Si un canal est supprime : en recreer un et mettre a jour config.js
4. En urgence : desactiver le flag `community`

### Le bouton flottant WhatsApp est intrusif ou genere du spam
**Cause probable** : Lien du groupe partage publiquement
**Solution** :
1. Desactiver le flag `floatingWhatsapp: false`
2. Creer un nouveau groupe WhatsApp avec un nouveau lien
3. Mettre a jour le lien dans `src/config.js`
4. Reactiver le flag

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
- **GitHub** : (URL du repository)

### Outils de diagnostic
- **Debug panel** : Ajouter `?debug=flags` a l'URL de production
- **Console navigateur** : F12 → Console → chercher les erreurs rouges
- **Vercel logs** : Dashboard → Projet → Functions (si applicable)
- **Build local** : `npm run build && npm run preview`

---

## 7. Checklist de recuperation post-incident

Apres avoir resolu un incident :

- [ ] Le site est de nouveau accessible et fonctionnel
- [ ] Le flag a ete remis a sa valeur correcte (si modifie)
- [ ] Le commit de correction est sur main
- [ ] La preview Vercel de develop est OK
- [ ] `?debug=flags` confirme l'etat attendu
- [ ] Documenter ce qui s'est passe (dans un fichier INCIDENT_LOG.md si recurrent)

---

*SAFER METHOD™ — Phase 6 — Rollback Plan*
