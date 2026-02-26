# Guide de déploiement — Waze Gabon Club

> SAFER METHOD™ — Phase 5 — Controlled Deployment
> Dernière mise à jour : 26 février 2026

---

## Hébergement

- **Plateforme** : Vercel (plan gratuit)
- **Framework** : Vite (détecté automatiquement par Vercel)
- **Build command** : `npm run build`
- **Output directory** : `dist`
- **Install command** : `npm install`
- **Node.js version** : 20.x (LTS)

---

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

---

## Domaine

### Par défaut

`waze-gabon-club.vercel.app` (ou le nom choisi)

### Domaine personnalisé (optionnel, futur)

1. Acheter un domaine (ex: wazegabon.club, wazegabon.com)
2. Dans Vercel > Settings > Domains
3. Ajouter le domaine
4. Configurer les DNS chez le registrar

---

## Variables d'environnement

Aucune variable d'environnement requise pour V1.
Tout est dans le code côté client (config.js, flags.js).

---

## Headers de sécurité

Configurés dans `vercel.json` :

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

---

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

---

## Procédure de rollback

### Rollback d'une section (via feature flag)

1. Modifier le flag dans `src/flags.js` → `false`
2. Commit : `fix(flags): disable [section] — [raison]`
3. Push vers main (exception urgence)
4. Vercel redéploie en ~60 secondes
5. Vérifier que la section est masquée

### Rollback complet (vers un commit précédent)

1. Dans Vercel > Deployments
2. Trouver le dernier déploiement fonctionnel
3. Cliquer "..." > "Promote to Production"
4. Le site revient instantanément à la version précédente
5. Investiguer le problème sur une branche fix/

---

## Vérification post-déploiement

Après chaque déploiement en production :

1. Vérifier l'URL de production
2. Ouvrir `?debug=flags` pour voir l'état des flags
3. Tester le sélecteur FR/EN
4. Tester un tutoriel (ouverture/fermeture)
5. Tester un lien externe (ouvre un nouvel onglet)
6. Tester sur mobile (Chrome Android)

---

*SAFER METHOD™ — Phase 5 — Deployment Guide*
