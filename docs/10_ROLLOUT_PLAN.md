# Plan de rollout — Waze Gabon Club

> SAFER METHOD™ — Phase 5 — Controlled Deployment
> Dernière mise à jour : 26 février 2026

---

## État actuel des flags (v1.0.0)

| Flag | État | Wave | Condition d'activation |
|------|------|------|----------------------|
| hero | ✅ ON | 1 | — |
| features | ✅ ON | 1 | — |
| download | ✅ ON | 1 | — |
| footer | ✅ ON | 1 | — |
| languageSwitcher | ✅ ON | 1 | — |
| privacySection | ✅ ON | 1 | — |
| tutorials | ✅ ON | 2 | — |
| faq | ✅ ON | 2 | — |
| community | ✅ ON | 3 | — |
| floatingWhatsapp | ✅ ON | 3 | — |
| livemap | ❌ OFF | 3 | Test iFrame sur réseau gabonais |
| articles | ❌ OFF | 4 | Vérification des 6 liens sources |
| registerModal | ❌ OFF | 4 | Endpoint Formspree configuré |
| debugPanel | 🔧 SYSTEM | — | Toujours true, activé par ?debug=flags |

**Résumé** : 10 flags activés, 3 désactivés, 1 système.

---

## Waves restantes

### Wave 3 (partiel) — Activer livemap

**Prérequis** :
- Tester l'iFrame Waze depuis une connexion gabonaise (4G Airtel ou Moov)
- L'iFrame doit charger en moins de 5 secondes
- Si l'iFrame ne charge pas, garder le flag à false

**Procédure** :
1. Modifier `livemap: true` dans `src/flags.js`
2. Commit : `feat(flags): enable livemap wave 3`
3. Push vers develop → vérifier preview
4. Merge dans main → vérifier production

---

### Wave 4 — Activer articles + registerModal

**Prérequis articles** :
- Vérifier que les 6 URLs d'articles sont toujours actives (pas de 404)
- Mettre à jour les articles si nécessaire dans `src/i18n/fr.json` et `en.json`

**Prérequis registerModal** :
1. Créer un compte Formspree (formspree.io)
2. Créer un formulaire
3. Copier l'endpoint (ex: `https://formspree.io/f/xyzabc`)
4. Remplacer le placeholder dans `src/config.js`
5. Tester l'envoi depuis le preview Vercel

**Procédure** :
1. Modifier `articles: true` et `registerModal: true` dans `src/flags.js`
2. Mettre à jour `config.js` avec l'endpoint Formspree réel
3. Commit : `feat(flags): enable wave 4 — articles + register`
4. Push vers develop → tester le formulaire sur preview
5. Merge dans main → vérifier production

---

## Liens à configurer

Les liens suivants doivent être remplacés dans `src/config.js` :

| Lien | Placeholder actuel | Statut | Action requise |
|------|-------------------|--------|----------------|
| WhatsApp | `VOTRE_LIEN_ICI` | ⚠️ Placeholder | Créer le groupe WhatsApp et copier le lien d'invitation |
| Telegram | `t.me/wazeGabon` | ✅ Configuré | — |
| Facebook | `facebook.com/WazeGabonClub` | ✅ Configuré | Vérifier que la page existe |
| Formspree | `VOTRE_ID_ICI` | ⚠️ Placeholder | Créer le formulaire (Wave 4 uniquement) |

**Note** : Le lien WhatsApp est utilisé par la section Community (activée) et le bouton flottant. Il doit être remplacé avant que des utilisateurs réels visitent le site. En attendant, le lien ouvrira la page WhatsApp générique.

---

## Calendrier de rollout recommandé

| Jour | Action | Flags |
|------|--------|-------|
| Jour 1 | Déploiement initial v1.0.0 | Waves 1+2+3 (partiel) |
| Jour 2-3 | Remplacer le lien WhatsApp, créer le groupe | config.js |
| Jour 4-7 | Tester l'iFrame Waze depuis le Gabon | livemap → true |
| Jour 7-14 | Configurer Formspree, vérifier articles | articles + registerModal → true |

---

*SAFER METHOD™ — Phase 5 — Rollout Plan*
