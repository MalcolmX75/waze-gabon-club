// Waze Gabon Club — Feature Flags
//
// Chaque flag controle la visibilite d'une section ou fonctionnalite.
// true = active (visible), false = desactive (masque).
//
// ROLLOUT : Modifier les flags ici, commit + push → Vercel redeploie.
// ROLLBACK : Remettre un flag a false, commit + push → section desactivee.
//
// Ordre de rollout (voir docs/08_FEATURE_FLAGS.md) :
//   Wave 1 : hero, features, download, footer, languageSwitcher, privacySection
//   Wave 2 : tutorials, faq
//   Wave 3 : community, floatingWhatsapp, livemap
//   Wave 4 : articles, registerModal

const FLAGS = {
  // === WAVE 1 — Fondation (active au lancement) ===
  hero: true,
  features: true,
  download: true,
  footer: true,
  languageSwitcher: true,
  privacySection: true,

  // === WAVE 2 — Education (active au lancement) ===
  tutorials: true,
  faq: true,

  // === WAVE 3 — Communaute (partiellement active au lancement) ===
  community: true,
  floatingWhatsapp: true,
  livemap: false,          // Activer apres test iFrame Waze sur reseau gabonais

  // === WAVE 4 — Complet (desactive au lancement) ===
  articles: false,         // Activer apres verification que les 6 liens sources sont actifs
  registerModal: false,    // Activer quand l'endpoint Formspree est cree et teste

  // === Systeme ===
  debugPanel: true,        // Toujours true — active uniquement par ?debug=flags
};

export default FLAGS;

export function useFlags() {
  return FLAGS;
}
