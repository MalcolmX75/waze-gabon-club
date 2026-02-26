# 01 — Risk Matrix

> SAFER METHOD™ — Phase 0 — Discovery & Context
> Dernière mise à jour : 26 février 2026

---

## Échelle

- **Probabilité** : Faible / Moyenne / Élevée
- **Impact** : Faible / Moyen / Critique

---

## Matrice des risques

| ID | Risque | Probabilité | Impact | Mitigation |
|----|--------|-------------|--------|------------|
| R01 | **Adoption faible** — Pas assez d'utilisateurs pour créer une dynamique communautaire | Élevée | Critique | Commencer par le cercle proche du fondateur (famille, amis, collègues). Viser 20 membres WhatsApp avant le lancement public. Publier du contenu Facebook régulier pour créer de la visibilité organique. Ne pas dépendre d'un volume — même 30 Wazers actifs qui signalent le trafic améliorent Libreville. |
| R02 | **Qualité réseau mobile au Gabon** — Connexion 3G/4G instable, surtout hors Libreville | Élevée | Moyen | Le service worker cache les tutoriels et la FAQ pour consultation offline. L'iFrame Waze nécessite internet mais c'est un "nice-to-have" — le vrai usage est dans l'app Waze elle-même qui gère le mode dégradé. Documenter la consommation data (10-30 Mo/h) dans les tutoriels. |
| R03 | **iFrame Waze modifié ou retiré par Google** — Google pourrait changer les conditions d'utilisation de l'embed | Faible | Critique | L'iFrame est un complément visuel, pas une fonctionnalité critique. Si retiré : remplacer par une image statique de la carte avec un lien "Ouvrir dans Waze". Les deep links (fonctionnalité principale) sont stables et documentés officiellement. Surveiller la page développeurs Waze. |
| R04 | **Deep Links incompatibles avec certains téléphones** — Certains navigateurs ou ROM Android customisés ne gèrent pas les liens `waze.com/ul` | Moyenne | Moyen | Les deep links Waze ont un fallback intégré : si l'app n'est pas installée, le lien redirige vers le store. Tester sur les appareils courants au Gabon (Tecno, Samsung entrée de gamme, iPhone). Ajouter un message "Installez d'abord Waze" à côté des deep links. |
| R05 | **Groupe WhatsApp ingérable** — Spam, hors-sujet, conflits entre membres | Moyenne | Moyen | Définir 3-4 règles claires dès la création du groupe (épinglées) : trafic uniquement, pas de politique, pas de pub. Le fondateur est admin avec pouvoir de modération. Limiter à 256 membres (limite WhatsApp standard) puis créer un second groupe si nécessaire. |
| R06 | **Page Facebook sans engagement** — Publications ignorées, 0 likes/commentaires | Élevée | Moyen | Suivre le calendrier éditorial strictement (4 publications/semaine). Privilégier les contenus visuels (photos de routes gabonaises, captures Waze). Poser des questions pour générer des commentaires ("Quel est votre trajet le plus embouteillé ?"). Ne pas acheter de faux followers. Accepter une croissance lente mais organique. |
| R07 | **Pas de domaine personnalisé** — Le site est sur un sous-domaine `*.vercel.app` | Élevée | Faible | Un domaine `.ga` (gratuit pour le Gabon) ou `.com` (~12$/an) peut être ajouté plus tard sans migration technique (simple configuration DNS dans Vercel). Le sous-domaine Vercel est fonctionnel pour la phase de lancement. Réserver un domaine dès que le budget le permet. |
| R08 | **Dépendance à Vercel (plan gratuit)** — Limites de bande passante, Vercel pourrait changer ses conditions | Faible | Moyen | Le plan gratuit Vercel offre 100 Go/mois de bande passante — largement suffisant pour un site communautaire. Le site est un SPA statique, facilement portable vers Netlify, GitHub Pages ou Cloudflare Pages si nécessaire. Aucun vendor lock-in. |
| R09 | **Contenu blog non mis à jour** — Les 6 articles initiaux deviennent obsolètes, pas de nouveaux articles | Élevée | Faible | Les articles initiaux sont intemporels (fonctionnalités Waze, pas des actualités périssables). Prévoir une revue trimestrielle pour ajouter 2-3 articles. Le blog n'est pas la fonctionnalité principale — les tutoriels et la communauté le sont. |
| R10 | **PWA qui ne s'installe pas correctement** — Problèmes de service worker, manifest invalide, HTTPS manquant | Moyenne | Moyen | Vercel fournit HTTPS par défaut. Tester l'installation PWA sur Chrome Android (majoritaire au Gabon) et Safari iOS. Utiliser Lighthouse pour valider le score PWA avant le lancement. Le site reste fonctionnel comme site web classique même sans installation PWA. |
| R11 | **Absence de backend = pas de données utilisateurs** — Impossible de mesurer précisément l'engagement ou de contacter les membres | Moyenne | Faible | Accepté comme contrainte V1. Les données WhatsApp (nombre de membres) et Facebook (Insights) servent de proxy. Le formulaire d'inscription côté client est symbolique. Si la communauté grandit (>500 membres), reconsidérer un backend léger (Supabase, Firebase). |
| R12 | **Propriété intellectuelle — marque Waze** — Google pourrait contester l'utilisation du nom "Waze" dans "Waze Gabon Club" | Faible | Critique | Le projet est un fan club communautaire non commercial qui promeut l'adoption de Waze — aligné avec les intérêts de Google. Inclure la mention obligatoire "Waze est une marque de Google LLC" dans le footer. Ne pas utiliser le logo officiel Waze — utiliser un "W" stylisé propre au club. Ne pas prétendre être affilié à Google/Waze. Si Google demande un changement de nom, obtempérer immédiatement. |
| R13 | **Qualité des traductions anglaises** — Le contenu gabonais traduit en anglais peut perdre son authenticité et son ton local | Moyenne | Faible | Le français reste la langue principale et la référence. Les traductions anglaises doivent être fonctionnelles, pas littéraires. Prioriser la clarté sur le style. Pour les termes locaux sans équivalent (noms de quartiers, expressions), garder le terme français avec une explication. Faire relire par un anglophone si possible. |
| R14 | **Maintenance de deux langues avec une équipe d'une personne** — Tout nouveau contenu doit être dupliqué en FR et EN, risque de désynchronisation | Élevée | Moyen | Concevoir l'architecture i18n pour que les traductions soient dans des fichiers séparés faciles à comparer. Toujours rédiger en français d'abord, puis traduire. Claude Code peut assister la traduction. L'anglais peut être en retard d'une version sans impact majeur (le public gabonais utilise le français). Limiter le contenu dynamique (articles blog) au français uniquement en V1 si nécessaire. |

---

## Résumé par niveau de criticité

### Risques critiques (à surveiller en priorité)

- **R01** — Adoption faible (probabilité élevée)
- **R03** — iFrame Waze retiré (probabilité faible mais impact critique)
- **R12** — Propriété intellectuelle Waze (probabilité faible mais impact critique)

### Risques moyens (à gérer activement)

- **R02** — Réseau mobile instable
- **R04** — Deep Links incompatibles
- **R05** — Groupe WhatsApp ingérable
- **R06** — Facebook sans engagement
- **R10** — Installation PWA défaillante
- **R14** — Maintenance bilingue difficile

### Risques faibles (acceptés)

- **R07** — Pas de domaine personnalisé
- **R08** — Dépendance Vercel
- **R09** — Blog non mis à jour
- **R11** — Pas de données utilisateurs
- **R13** — Qualité traduction anglaise

---

*SAFER METHOD™ — Phase 0 — Discovery & Context*
