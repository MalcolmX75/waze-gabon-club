// Waze Gabon Club — Utilitaires de sécurité pour le formulaire d'inscription
// Protections : validation des champs, honeypot anti-spam, rate limiting côté client.

const RATE_LIMIT_KEY = "formSubmittedAt";
const RATE_LIMIT_MS = 60_000; // 60 secondes entre deux soumissions

/**
 * Supprime les balises HTML d'une chaîne.
 */
function stripHtml(str) {
  return str.replace(/<[^>]*>/g, "");
}

/**
 * Valide les champs du formulaire d'inscription.
 * Retourne un objet { valid, errors } où errors est un objet clé → message d'erreur.
 */
export function validateForm({ name, email, wazeUser }) {
  const errors = {};

  // Nom : 2-100 caractères, pas de HTML
  const cleanName = stripHtml(name?.trim() || "");
  if (cleanName.length < 2 || cleanName.length > 100) {
    errors.name = "2-100 caractères requis";
  }

  // Email : format basique
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email?.trim() || "")) {
    errors.email = "Email invalide";
  }

  // Pseudo Waze : optionnel, 0-50 caractères, alphanumérique + tirets/underscores
  const cleanWaze = wazeUser?.trim() || "";
  if (cleanWaze.length > 0) {
    if (cleanWaze.length > 50) {
      errors.wazeUser = "50 caractères maximum";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(cleanWaze)) {
      errors.wazeUser = "Lettres, chiffres, tirets et underscores uniquement";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name: cleanName,
      email: (email?.trim() || ""),
      wazeUser: cleanWaze,
    },
  };
}

/**
 * Vérifie le honeypot anti-spam.
 * Retourne true si le formulaire est légitime (champ honeypot vide).
 */
export function checkHoneypot(gotchaValue) {
  return !gotchaValue;
}

/**
 * Vérifie si l'utilisateur peut soumettre le formulaire (rate limiting).
 * Retourne true si le cooldown est écoulé.
 */
export function canSubmit() {
  const lastSubmit = sessionStorage.getItem(RATE_LIMIT_KEY);
  if (!lastSubmit) return true;
  return Date.now() - Number(lastSubmit) > RATE_LIMIT_MS;
}

/**
 * Enregistre le timestamp de la dernière soumission.
 */
export function markSubmitted() {
  sessionStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
}

/**
 * Retourne le nombre de secondes restantes avant la prochaine soumission possible.
 */
export function cooldownRemaining() {
  const lastSubmit = sessionStorage.getItem(RATE_LIMIT_KEY);
  if (!lastSubmit) return 0;
  const elapsed = Date.now() - Number(lastSubmit);
  return Math.max(0, Math.ceil((RATE_LIMIT_MS - elapsed) / 1000));
}
