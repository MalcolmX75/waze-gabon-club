# 03 — Environments

> SAFER METHOD™ — Phase 0 — Discovery & Context
> Dernière mise à jour : 26 février 2026

---

## Plan des environnements

| Environnement | URL | Usage | Branche Git |
|---------------|-----|-------|-------------|
| **Local** | `http://localhost:5173` | Développement, tests manuels | `feature/*`, `fix/*` |
| **Preview** | `https://<branch>-waze-gabon.vercel.app` | Review avant mise en production (auto-déployé par Vercel sur chaque PR) | `develop` |
| **Production** | `https://waze-gabon.vercel.app` (puis domaine custom) | Site public accessible aux utilisateurs | `main` |

---

## Stratégie de branches Git

```
main (production)
 └── develop (intégration / preview)
      ├── feature/nom-de-la-feature
      ├── fix/description-du-bug
      └── docs/nom-du-document
```

### Branches permanentes

| Branche | Rôle | Déploiement |
|---------|------|-------------|
| `main` | Code en production, stable | Auto-déploiement Vercel → production |
| `develop` | Intégration des features terminées, preview | Auto-déploiement Vercel → preview URL |

### Branches temporaires

| Préfixe | Usage | Exemple |
|---------|-------|---------|
| `feature/` | Nouvelle fonctionnalité | `feature/pwa-service-worker` |
| `fix/` | Correction de bug | `fix/whatsapp-link-mobile` |
| `docs/` | Documentation uniquement | `docs/phase0-discovery` |
| `i18n/` | Ajout/modification de traductions | `i18n/english-translation` |

---

## Règles de merge

1. **Jamais de push direct sur `main`** — Toujours passer par une PR depuis `develop`
2. **Jamais de push direct sur `develop`** — Toujours passer par une PR depuis une branche `feature/`, `fix/`, `docs/` ou `i18n/`
3. **Merge via squash** sur `develop` (historique propre, un commit par feature)
4. **Merge via merge commit** de `develop` vers `main` (traçabilité des releases)
5. **Supprimer la branche** après merge (pas de branches mortes)
6. **Pas de force push** sur `main` ou `develop`

---

## Convention de nommage des commits

Format : `type(scope): description courte`

### Types

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation uniquement |
| `style` | Changements visuels (CSS, mise en page) sans changement de logique |
| `refactor` | Restructuration de code sans changement de comportement |
| `perf` | Amélioration de performance |
| `chore` | Maintenance (dépendances, config, CI) |
| `i18n` | Ajout ou modification de traductions |

### Scopes (optionnel)

| Scope | Correspond à |
|-------|-------------|
| `hero` | Section hero |
| `nav` | Navigation / header |
| `tutorials` | Section tutoriels |
| `map` | Section carte live |
| `community` | Section communauté |
| `faq` | Section FAQ |
| `articles` | Section actualités |
| `footer` | Footer |
| `pwa` | Manifest, service worker, icônes |
| `i18n` | Système d'internationalisation |
| `a11y` | Accessibilité |

### Exemples

```
feat(pwa): add service worker with offline caching
fix(map): correct iFrame height on mobile
style(hero): adjust particle animation speed
docs: add Phase 0 discovery documents
i18n(tutorials): add English translations for all 6 tutorials
chore: update vite to 6.x
```

---

## Convention de nommage des branches

Format : `type/description-en-kebab-case`

### Exemples

```
feature/pwa-manifest-and-icons
feature/i18n-language-switcher
fix/deep-link-fallback-android
docs/phase0-discovery
i18n/english-faq-section
```

### Règles

- Tout en minuscules
- Mots séparés par des tirets (`-`)
- Description courte mais explicite (3-5 mots max)
- Pas de numéros de ticket (pas de système de ticketing pour l'instant)

---

## Workflow de déploiement

```
1. Créer branche feature/xxx depuis develop
2. Développer + commit(s)
3. Push + créer PR vers develop
4. Vercel génère une preview URL automatiquement
5. Review sur la preview URL
6. Merge squash dans develop
7. Vérifier la preview de develop
8. Créer PR develop → main
9. Merge commit dans main
10. Vercel déploie automatiquement en production
```

---

## Variables d'environnement

Aucune variable d'environnement requise pour la V1.

Le projet n'a pas de backend, pas de clé API, pas de secrets. Tout est public et côté client.

Si des variables sont ajoutées plus tard (ex: analytics), elles seront préfixées `VITE_` pour être exposées au client (convention Vite).

---

*SAFER METHOD™ — Phase 0 — Discovery & Context*
