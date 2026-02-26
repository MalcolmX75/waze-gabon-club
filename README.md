# Waze Gabon Club

La premiere communaute Waze du Gabon.

## Stack technique

- Next.js 15 + React 19 (App Router, SSR/SSG)
- PWA installable
- Heberge sur Vercel (gratuit)
- Bilingue FR/EN (259 cles par langue)
- 14 feature flags pour le rollout progressif
- SEO : metadata SSR, Open Graph, Twitter Cards

## Demarrage local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build production

```bash
npm run build
npm run start
# → http://localhost:3000
```

## Debug

Ajouter `?debug=flags` a l'URL pour voir l'etat des feature flags.

## Documentation

Tous les documents du projet sont dans `/docs/` :

| Document | Contenu |
|----------|---------|
| 00_PROJECT_SUMMARY.md | Vision, personas, scope, KPIs |
| 01_RISK_MATRIX.md | 14 risques identifies |
| 02_CONSTRAINTS.md | Contraintes techniques, budget, humaines |
| 03_ENVIRONMENTS.md | Environnements, Git strategy, conventions |
| 04_INITIAL_ARCHITECTURE_PROPOSAL.md | Architecture initiale |
| 05_ARCHITECTURE_DEFINITION.md | Architecture detaillee |
| 06_SECURITY_MODEL.md | Modele de menaces (15 threats) |
| 07_DATA_FLOW.md | Flux de donnees et services tiers |
| 08_FEATURE_FLAGS.md | 14 flags, 4 waves de rollout |
| 09_DEPLOYMENT_GUIDE.md | Guide Vercel complet |
| 10_ROLLOUT_PLAN.md | Etat des flags et waves |
| 11_ROLLBACK_PLAN.md | Procedures de recuperation |

## Feature flags

Les sections du site sont controlees par des feature flags dans `lib/flags.js`.
Voir `docs/08_FEATURE_FLAGS.md` pour le detail.

## Communaute

- WhatsApp : (lien a configurer)
- Telegram : t.me/wazeGabon
- Facebook : facebook.com/WazeGabonClub

## Licence

Initiative communautaire. Waze est une marque de Google LLC.
