# 02 — Constraints

> SAFER METHOD™ — Phase 0 — Discovery & Context
> Dernière mise à jour : 26 février 2026

---

## Contraintes techniques

| Contrainte | Détail | Justification |
|------------|--------|---------------|
| **Pas de backend** | Aucun serveur, aucune base de données, aucune API custom | Budget zéro, complexité inutile pour une V1 communautaire. Le formulaire d'inscription est côté client uniquement. |
| **Pas de clé API** | Seules les intégrations Waze gratuites sont utilisées (Deep Links + iFrame) | Les API Waze avancées (Transport SDK, Audio Kit, Partner Feeds) sont réservées aux partenaires commerciaux. |
| **Hébergement Vercel gratuit** | Plan Hobby : 100 Go bande passante/mois, builds illimités, HTTPS automatique | Suffisant pour un site communautaire. Portabilité vers Netlify/Cloudflare Pages si besoin. |
| **React SPA (Vite)** | Application single-page, pas de SSR, pas de routing multi-pages | Simplicité de déploiement et de maintenance. Un seul point d'entrée. |
| **PWA obligatoire** | manifest.json + service worker + icônes 192px/512px | Les utilisateurs gabonais installent peu d'apps — une PWA installable depuis le navigateur réduit la friction. |
| **Pas de dépendances lourdes** | Minimum de packages npm. React + Vite uniquement comme base. | Performance sur réseaux 3G, taille de bundle minimale, moins de surface de maintenance. |
| **Mobile-first** | 90%+ du trafic attendu est mobile | Réalité du marché gabonais : smartphones Android entrée/milieu de gamme. |
| **Bilingue FR/EN** | Interface et contenu disponibles en français et anglais | Français pour le public gabonais (langue officielle), anglais pour l'audience internationale et les futurs pays. Solution i18n légère, pas de librairie lourde. |
| **Offline partiel** | Tutoriels et FAQ accessibles sans connexion via service worker | Réseau mobile instable au Gabon — les contenus éducatifs doivent rester consultables. L'iFrame Waze nécessite internet. |

---

## Contraintes budget

| Contrainte | Détail |
|------------|--------|
| **Budget total : 0 FCFA** | Aucun budget d'investissement initial. Le projet démarre à coût zéro. |
| **Pas d'API payantes** | Aucune intégration nécessitant un abonnement ou des crédits. |
| **Pas de publicité** | Pas de budget marketing. Croissance organique uniquement (WhatsApp, Facebook, bouche-à-oreille). |
| **Domaine : optionnel** | Seul coût potentiel : un domaine custom (~12$/an pour un .com). Le sous-domaine Vercel suffit au lancement. Un domaine .ga est gratuit mais souvent instable. |
| **Pas de designer** | Les visuels sont générés par Claude ou créés avec des outils gratuits (Canva free). Le prototype JSX sert de référence visuelle. |

---

## Contraintes humaines

| Contrainte | Détail |
|------------|--------|
| **Un seul fondateur** | Michael porte le projet seul : vision, contenu, modération communautaire, promotion. |
| **Claude Code pour l'implémentation** | Le développement technique est réalisé via Claude Code. Pas de développeur humain dédié. |
| **Claude (Opus) comme consultant** | Stratégie, contenu, design, architecture — le rôle de Claude consultant est séparé de Claude Code. |
| **Pas d'équipe de modération** | Le groupe WhatsApp et la page Facebook sont modérés par Michael seul. Pas de modérateurs bénévoles au lancement. |
| **Temps partiel** | Michael a d'autres projets (Bwatoo). Le temps consacré à Waze Gabon Club est limité — d'où l'importance de l'automatisation du déploiement et de la simplicité du contenu. |
| **Maintenance bilingue** | Chaque mise à jour de contenu doit être faite en deux langues. Claude Code peut assister la traduction mais la validation reste humaine. |

---

## Contraintes légales

| Contrainte | Détail | Action requise |
|------------|--------|----------------|
| **Marque Waze** | "Waze" est une marque déposée de Google LLC | Mention obligatoire dans le footer : "Waze est une marque de Google LLC". Ne pas utiliser le logo officiel Waze. Utiliser un "W" stylisé propre au club. Ne pas prétendre être affilié à Google. |
| **iFrame Waze** | Conditions d'utilisation de l'embed Waze | Ne pas superposer l'iFrame avec des cartes non-Waze. Ne pas modifier l'apparence de l'embed. Respecter les guidelines développeurs Google/Waze. |
| **Pas de collecte de données** | Pas de backend = pas de stockage de données personnelles | Le formulaire d'inscription côté client ne persiste rien. Pas de cookies de tracking. Pas de RGPD complexe à gérer, mais mentionner l'utilisation de Google Fonts (requête externe). |
| **Contenus tiers** | Les articles blog citent des sources officielles Waze/Google | Toujours créditer la source. Ne pas copier le texte intégralement — résumer et adapter avec un angle gabonais. Inclure le lien vers l'article original. |
| **Google Fonts** | Chargement de polices depuis les serveurs Google | Mention dans une éventuelle politique de confidentialité. Alternative future : self-hosting des polices pour éviter les requêtes tierces. |

---

## Résumé des contraintes structurantes

Les 5 contraintes qui façonnent le plus l'architecture :

1. **Zéro backend** — Tout est côté client, statique, déployé sur CDN
2. **Zéro budget** — Uniquement des services gratuits (Vercel, Waze APIs, Google Fonts)
3. **Un seul mainteneur** — L'architecture doit être simple à maintenir sans équipe
4. **Mobile-first sur réseau lent** — Performance et offline sont prioritaires
5. **Bilingue FR/EN** — L'architecture i18n doit être intégrée dès le départ sans complexité excessive

---

*SAFER METHOD™ — Phase 0 — Discovery & Context*
