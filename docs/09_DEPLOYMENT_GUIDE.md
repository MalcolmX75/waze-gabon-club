# Guide de deploiement — Waze Gabon Club

> SAFER METHOD(tm) — Phase 5 — Controlled Deployment
> Derniere mise a jour : 27 fevrier 2026

---

## Hebergement

- **Plateforme** : Vercel (plan gratuit)
- **Framework** : Next.js 15 (detecte automatiquement par Vercel)
- **Build command** : `npm run build`
- **Output directory** : `.next/` (gere automatiquement par Vercel pour Next.js)
- **Install command** : `npm install`
- **Node.js version** : 20.x (LTS)
- **Dev server** : `npm run dev` → http://localhost:3000
- **Preview locale** : `npm run start` (apres build)

---

## Connexion Vercel

### Premiere configuration

1. Aller sur https://vercel.com
2. Se connecter avec GitHub
3. Importer le repository `MalcolmX75/waze-gabon-club`
4. Vercel detecte automatiquement Next.js 15
5. Verifier les settings :
   - Framework Preset : **Next.js** (auto-detecte)
   - Build Command : `npm run build`
   - Output Directory : laisser vide (Next.js gere `.next/` automatiquement)
6. Cliquer "Deploy"

### Deploiements automatiques

- Push sur `main` → deploiement en production
- Push sur `develop` ou feature branches → preview deployment
- Chaque preview a une URL unique (ex: `waze-gabon-club-abc123.vercel.app`)

---

## Domaine

### Domaine principal

`wazegabon.com` — configure dans Vercel > Settings > Domains.

### Configuration DNS

1. Dans Vercel > Settings > Domains > ajouter `wazegabon.com`
2. Configurer les DNS chez le registrar :
   - Type `A` → `76.76.21.21`
   - Type `CNAME` pour `www` → `cname.vercel-dns.com`
3. Vercel fournit automatiquement le certificat SSL (Let's Encrypt)
4. Redirection `www.wazegabon.com` → `wazegabon.com` configuree dans Vercel

---

## Variables d'environnement

Aucune variable d'environnement requise pour V1.
Tout est dans le code cote client (`lib/config.js`, `lib/flags.js`).

> Si des variables sont ajoutees plus tard, les configurer dans Vercel > Settings > Environment Variables pour chaque environnement (Production, Preview, Development).

---

## Headers de securite

Configures dans `next.config.mjs` via la fonction `headers()` :

```js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
  ];
}
```

> **Note migration** : les headers sont maintenant dans `next.config.mjs` et non plus dans `vercel.json`. Next.js gere nativement les headers HTTP via sa configuration.

---

## SEO

Next.js 15 apporte des avantages SEO majeurs par rapport a Vite (SPA) :

### Metadata SSR

Les metadonnees sont generees cote serveur dans `app/layout.js` via l'export `metadata`. Chaque page peut surcharger les metadonnees. Le HTML arrive au crawler avec toutes les balises `<meta>`, `<title>`, et les donnees structurees.

### Donnees structurees (JSON-LD)

Le schema `Organization` + `WebSite` est injecte dans le `<head>` via `app/layout.js`. Visible par Google, Bing, et tous les moteurs de recherche.

### Images Open Graph dynamiques

Route `app/opengraph-image.js` — genere dynamiquement les images OG pour le partage sur les reseaux sociaux (WhatsApp, Facebook, Telegram).

### Sitemap et Robots

- `app/sitemap.js` — genere automatiquement `sitemap.xml` pour l'indexation
- `app/robots.js` — genere automatiquement `robots.txt` pour les crawlers

### Verification

Apres deploiement, verifier le SEO :
1. `https://wazegabon.com/sitemap.xml` — doit lister les pages
2. `https://wazegabon.com/robots.txt` — doit autoriser les crawlers
3. Tester avec https://search.google.com/test/rich-results (donnees structurees)
4. Tester avec https://developers.facebook.com/tools/debug/ (apercu OG)

---

## Procedure de deploiement standard

1. Developper sur une branche `feature/`
2. Tester localement : `npm run dev` (http://localhost:3000)
3. Build de verification : `npm run build && npm run start`
4. Push et creer une PR vers `develop`
5. Verifier la preview Vercel (URL unique dans la PR)
6. Merge dans `develop`
7. Tester la preview `develop`
8. Merge `develop` dans `main`
9. Verifier la production sur `wazegabon.com`

---

## Procedure de rollback

### Rollback d'une section (via feature flag)

1. Modifier le flag dans `lib/flags.js` → `false`
2. Commit : `fix(flags): disable [section] — [raison]`
3. Push vers `main` (exception urgence)
4. Vercel redeploie en ~60 secondes
5. Verifier que la section est masquee

### Rollback complet (vers un commit precedent)

1. Dans Vercel > Deployments
2. Trouver le dernier deploiement fonctionnel
3. Cliquer "..." > "Promote to Production"
4. Le site revient instantanement a la version precedente
5. Investiguer le probleme sur une branche `fix/`

---

## Verification post-deploiement

Apres chaque deploiement en production :

1. Verifier l'URL de production (`wazegabon.com`)
2. Ouvrir `?debug=flags` pour voir l'etat des flags
3. Tester le selecteur FR/EN
4. Tester un tutoriel (ouverture/fermeture)
5. Tester un lien externe (ouvre un nouvel onglet)
6. Tester sur mobile (Chrome Android)
7. Verifier les headers de securite (DevTools > Network > Response Headers)
8. Verifier le SEO : `view-source:` pour confirmer que le HTML contient les metadonnees
9. Verifier `/sitemap.xml` et `/robots.txt`

---

## Differences cles avec l'ancienne stack (Vite)

| Aspect | Avant (Vite SPA) | Maintenant (Next.js 15) |
|--------|-------------------|--------------------------|
| Framework | Vite 7 | Next.js 15 |
| Output | `dist/` | `.next/` |
| Dev server | `localhost:5173` | `localhost:3000` |
| Preview | `npm run preview` | `npm run start` |
| Headers | `vercel.json` | `next.config.mjs` |
| Flags | `src/flags.js` | `lib/flags.js` |
| SEO | Client-side (invisible aux crawlers) | SSR (indexable nativement) |
| Metadata | Balises statiques dans `index.html` | Export `metadata` dans `app/layout.js` |
| Sitemap | Aucun | `app/sitemap.js` (auto-genere) |
| Robots | Aucun | `app/robots.js` (auto-genere) |
| OG Images | Statiques | Dynamiques (`app/opengraph-image.js`) |

---

*SAFER METHOD(tm) — Phase 5 — Deployment Guide — Next.js 15 Edition*
