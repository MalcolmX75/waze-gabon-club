# 00 — Project Summary

> SAFER METHOD™ — Phase 0 — Discovery & Context
> Dernière mise à jour : 26 février 2026

---

## Nom du projet

**Waze Gabon Club** — La première communauté Waze du Gabon, un écosystème digital pour promouvoir la navigation collaborative à Libreville et au-delà.

---

## Problème identifié

1. **Waze est quasi inconnu au Gabon** — La majorité des conducteurs librevillois n'utilisent aucune app de navigation, ou utilisent Google Maps sans les avantages communautaires de Waze
2. **Les cartes Waze du Gabon sont incomplètes** — Routes manquantes, noms erronés, aucune mise à jour par des éditeurs locaux
3. **Aucune communauté locale** — Pas de groupe francophone pour partager les alertes trafic, les bonnes pratiques ou recruter des éditeurs bénévoles
4. **Les embouteillages de Libreville ne sont pas documentés** — Sans signalements communautaires, Waze ne peut pas proposer de détours intelligents dans la capitale
5. **Barrière d'entrée élevée** — Les tutoriels Waze existants sont en anglais et ne tiennent pas compte du contexte gabonais (opérateurs mobiles, consommation data, prix carburant fixés par l'État)

---

## Solution proposée

1. **Un site web PWA installable** — Tutoriels en français adaptés au Gabon, carte live de Libreville, deep links vers les destinations populaires
2. **Un groupe WhatsApp** — Canal d'alertes trafic en temps réel animé par la communauté elle-même
3. **Une page Facebook** — Contenu éducatif régulier (calendrier éditorial : astuces, alertes, témoignages, routes découvertes)
4. **Un programme de recrutement d'éditeurs** — Guider les contributeurs motivés vers l'éditeur de carte Waze pour améliorer la couverture gabonaise
5. **Une expérience bilingue FR/EN** — Français par défaut pour le public gabonais, anglais disponible pour les visiteurs internationaux et la future expansion

---

## Utilisateurs cibles (Personas)

### Persona 1 — Mamadou, conducteur quotidien à Libreville

| Attribut | Détail |
|----------|--------|
| **Âge** | 28-45 ans |
| **Profil** | Salarié, conduit matin et soir entre domicile et travail |
| **Appareil** | Smartphone Android (Tecno, Samsung entrée de gamme) |
| **Frustration** | Perd 1-2h/jour dans les embouteillages sans savoir s'il y a un itinéraire alternatif |
| **Besoin** | Alertes trafic en temps réel, itinéraires optimisés, communauté pour signaler les bouchons |
| **Comportement digital** | WhatsApp quotidien, Facebook régulier, peu d'apps installées |
| **Langue** | Français |

### Persona 2 — Carine, conductrice occasionnelle

| Attribut | Détail |
|----------|--------|
| **Âge** | 30-50 ans |
| **Profil** | Conduit principalement le week-end, voyages occasionnels Libreville → provinces (Franceville, Port-Gentil) |
| **Appareil** | iPhone ou Android milieu de gamme |
| **Frustration** | Ne connaît pas bien les routes hors Libreville, peur de se perdre, pas de signalisation fiable |
| **Besoin** | Navigation GPS fiable, stations-service localisées, rassurance d'une communauté |
| **Comportement digital** | WhatsApp, Facebook, Instagram |
| **Langue** | Français |

### Persona 3 — Kevin, éditeur de carte potentiel

| Attribut | Détail |
|----------|--------|
| **Âge** | 20-35 ans |
| **Profil** | Étudiant ou jeune professionnel tech-savvy, passionné de cartographie ou de contribution open-source |
| **Appareil** | Smartphone + ordinateur portable |
| **Frustration** | Voit que les cartes Waze du Gabon sont vides, veut contribuer mais ne sait pas comment |
| **Besoin** | Tutoriel éditeur en français, reconnaissance communautaire, sens de la contribution |
| **Comportement digital** | Facebook, forums tech, YouTube |
| **Langue** | Français, anglais technique |

### Persona 4 — Sarah, visiteur/touriste au Gabon

| Attribut | Détail |
|----------|--------|
| **Âge** | 25-55 ans |
| **Profil** | Expatriée, touriste ou voyageur d'affaires séjournant temporairement au Gabon |
| **Appareil** | iPhone ou Android récent |
| **Frustration** | Google Maps imprécis à Libreville, ne connaît pas les routes, barrière de la langue pour demander son chemin |
| **Besoin** | Navigation fiable à Libreville, deep links vers destinations clés (aéroport, hôpital, centre-ville) |
| **Comportement digital** | Utilise déjà Waze ou Google Maps dans son pays, cherche une solution locale |
| **Langue** | Anglais ou français |

---

## Périmètre fonctionnel V1 (IN scope)

- Site web React SPA hébergé sur Vercel
- PWA installable (manifest.json, service worker, icônes)
- Interface bilingue français/anglais avec sélecteur de langue
- 11 sections : navigation, hero, avantages, téléchargement, tutoriels, carte live, communauté, actualités, FAQ, footer, éléments flottants
- 6 tutoriels interactifs en accordéon (4 étapes chacun)
- Carte live Libreville via iFrame Waze
- 6 deep links vers destinations populaires de Libreville
- 7 questions FAQ en accordéon
- 6 articles blog sourcés depuis les publications officielles Waze
- Liens vers groupe WhatsApp et page Facebook
- Bouton WhatsApp flottant
- Modal d'inscription communautaire (formulaire côté client uniquement)
- Design responsive mobile-first
- Offline partiel (tutoriels et FAQ accessibles hors connexion via service worker)

## Hors périmètre V1 (OUT scope)

- Backend / base de données / API custom
- Comptes utilisateurs persistants (authentification, profils sauvegardés)
- Chatbot IA (coût API trop élevé pour une communauté naissante)
- Comparaison des prix de carburant (prix fixés par l'État au Gabon)
- Application mobile native (iOS/Android)
- Monétisation (publicité, abonnements, partenariats)
- Modération automatisée du groupe WhatsApp
- Analytics avancés (pas de backend pour stocker les données)
- Notifications push (nécessiterait un backend)
- Carte Waze interactive custom (on utilise l'iFrame officiel)
- Support de langues autres que FR/EN

---

## KPI de succès

### À 3 mois (90 jours post-lancement)

| KPI | Objectif | Méthode de mesure |
|-----|----------|-------------------|
| Membres WhatsApp | 100+ | Compteur du groupe |
| Followers Facebook | 200+ | Insights Facebook |
| Installations PWA | 50+ | Compteur `memberCount` dans le hero (approximatif) |
| Nouveaux éditeurs Waze Gabon | 10+ | Suivi via la communauté et l'éditeur Waze |
| Articles Facebook publiés | 48+ | Calendrier éditorial (4/semaine × 12 semaines) |

### Indicateurs qualitatifs

- Des signalements trafic réguliers dans le groupe WhatsApp
- Au moins 1 témoignage utilisateur par mois sur Facebook
- Des routes ou lieux corrigés/ajoutés sur la carte Waze de Libreville
- Le site apparaît dans les résultats Google pour "Waze Gabon"

---

## Calendrier macro

### J0 → J30 — Fondation

- Valider l'architecture (Phase 0-1 SAFER METHOD™)
- Scaffolding du projet Vite + React
- Implémenter le composant principal avec les 11 sections
- Implémenter le système i18n (FR/EN)
- Configurer la PWA (manifest, service worker, icônes)
- Créer la page Facebook "Waze Gabon Club"
- Créer le groupe WhatsApp communautaire
- Déployer la V1 sur Vercel

### J30 → J60 — Lancement & Croissance initiale

- Remplacer les liens placeholder (WhatsApp, Facebook)
- Publier les premiers contenus Facebook (calendrier éditorial)
- Inviter les premiers membres (cercle proche du fondateur)
- Recruter 3-5 premiers éditeurs de carte
- Recueillir les premiers retours utilisateurs
- Itérer sur le contenu (FAQ, tutoriels) selon les questions récurrentes

### J60 → J90 — Consolidation

- Ajouter de nouveaux articles au blog (actualités Waze)
- Optimiser le SEO (balises meta, Open Graph pour le partage Facebook)
- Évaluer les KPI et ajuster la stratégie
- Documenter les routes corrigées/ajoutées par les éditeurs
- Préparer la roadmap V2 si la communauté grandit

---

*SAFER METHOD™ — Phase 0 — Discovery & Context*
