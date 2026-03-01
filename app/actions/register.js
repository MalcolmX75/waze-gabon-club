'use server';

import { Resend } from 'resend';
import { validateForm, checkHoneypot } from '@/utils/form';
import { query } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerAction({ name, email, wazeUser, _gotcha }) {
  // Honeypot check
  if (!checkHoneypot(_gotcha)) {
    return { ok: false, error: 'spam' };
  }

  // Server-side validation
  const { valid, errors, sanitized } = validateForm({ name, email, wazeUser });
  if (!valid) {
    return { ok: false, error: 'validation', errors };
  }

  const firstName = sanitized.name.split(' ')[0];
  const fromAddress = 'Waze Gabon Club <club@wazegabon.com>';

  try {
    // Email admin — notification nouvelle inscription
    await resend.emails.send({
      from: fromAddress,
      to: process.env.REGISTRATION_EMAIL,
      subject: `Nouvelle inscription — ${sanitized.name}`,
      html: adminEmail(sanitized),
    });

    // Email membre — bienvenue
    await resend.emails.send({
      from: fromAddress,
      to: sanitized.email,
      subject: `Bienvenue ${firstName} — Waze Gabon Club`,
      html: welcomeEmail(sanitized),
    });

    // Store registration in database (non-blocking)
    try {
      await query(
        'INSERT INTO registrations (name, email, waze_user) VALUES ($1, $2, $3)',
        [sanitized.name, sanitized.email, sanitized.wazeUser || null]
      );
    } catch {
      // DB insert failure should not block success
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'send' };
  }
}

// --- Templates email ---

const HEADER = `<tr><td style="height:6px;background:linear-gradient(90deg,#009E49 33%,#FCD116 33%,#FCD116 66%,#3A75C4 66%);border-radius:12px 12px 0 0;font-size:0;">&nbsp;</td></tr>`;

const FOOTER = `<tr><td style="padding:20px 0;text-align:center;">
  <span style="font-size:12px;color:#94a3b8;">Waze Gabon Club &mdash; </span>
  <a href="https://wazegabon.com" style="font-size:12px;color:#33CCFF;text-decoration:none;">wazegabon.com</a>
</td></tr>`;

function shell(content) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:32px 16px;">
<tr><td align="center">
  <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
    ${HEADER}
    <tr><td style="background:#ffffff;padding:36px 32px 28px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      ${content}
    </td></tr>
    ${FOOTER}
  </table>
</td></tr>
</table>
</body></html>`;
}

function adminEmail({ name, email, wazeUser }) {
  const firstName = name.split(' ')[0];
  return shell(`
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="font-size:28px;padding-bottom:4px;">&#127468;&#127462;</td></tr>
      <tr><td style="font-size:22px;font-weight:800;color:#1a1a2e;padding-bottom:4px;">Nouvelle inscription</td></tr>
      <tr><td style="font-size:14px;color:#64748b;padding-bottom:28px;">Un nouveau membre a rejoint le Waze Gabon Club</td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
      <tr><td style="padding:20px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:6px 0;">
            <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600;">Nom</span><br />
            <span style="font-size:16px;font-weight:700;color:#1a1a2e;">${name}</span>
          </td></tr>
          <tr><td style="padding:8px 0;"><div style="height:1px;background:#e2e8f0;"></div></td></tr>
          <tr><td style="padding:6px 0;">
            <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600;">Email</span><br />
            <a href="mailto:${email}" style="font-size:16px;color:#33CCFF;text-decoration:none;font-weight:600;">${email}</a>
          </td></tr>
          <tr><td style="padding:8px 0;"><div style="height:1px;background:#e2e8f0;"></div></td></tr>
          <tr><td style="padding:6px 0;">
            <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600;">Pseudo Waze</span><br />
            <span style="font-size:16px;color:#1a1a2e;font-weight:${wazeUser ? '700' : '400'};">${wazeUser || '<span style="color:#94a3b8;font-style:italic;">Non renseign\u00e9</span>'}</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding-top:24px;">
      <tr><td align="center">
        <a href="mailto:${email}" style="display:inline-block;background:#009E49;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 32px;border-radius:8px;">
          Contacter ${firstName}
        </a>
      </td></tr>
    </table>
  `);
}

function welcomeEmail({ name, wazeUser }) {
  const firstName = name.split(' ')[0];
  return shell(`
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="font-size:28px;padding-bottom:4px;">&#127468;&#127462;</td></tr>
      <tr><td style="font-size:22px;font-weight:800;color:#1a1a2e;padding-bottom:4px;">Bienvenue ${firstName} !</td></tr>
      <tr><td style="font-size:14px;color:#64748b;padding-bottom:24px;">Vous faites maintenant partie du Waze Gabon Club${wazeUser ? ` en tant que <strong>${wazeUser}</strong>` : ''}.</td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="padding-bottom:8px;">
      <tr><td style="font-size:15px;color:#1a1a2e;padding-bottom:16px;line-height:1.6;">
        Rejoignez nos canaux pour recevoir les alertes trafic, les astuces Waze et echanger avec la communaute :
      </td></tr>
    </table>

    <!-- Boutons communaute -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding-bottom:8px;">
      <tr><td align="center" style="padding:6px 0;">
        <a href="https://chat.whatsapp.com/CxqQfJ2DI8rJFGRx583YS5" style="display:inline-block;width:260px;background:#25D366;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 24px;border-radius:8px;text-align:center;">
          &#128172; Rejoindre WhatsApp
        </a>
      </td></tr>
      <tr><td align="center" style="padding:6px 0;">
        <a href="https://t.me/+terR7LTLdk9jMDk0" style="display:inline-block;width:260px;background:#0088cc;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 24px;border-radius:8px;text-align:center;">
          &#9992;&#65039; Suivre Telegram
        </a>
      </td></tr>
      <tr><td align="center" style="padding:6px 0;">
        <a href="https://facebook.com/WazeGabonClub" style="display:inline-block;width:260px;background:#1877F2;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 24px;border-radius:8px;text-align:center;">
          &#128216; Suivre Facebook
        </a>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="padding-top:20px;">
      <tr><td style="padding:16px 20px;background:#f0fdf4;border-radius:10px;border-left:4px solid #009E49;">
        <span style="font-size:14px;color:#1a1a2e;line-height:1.5;">
          <strong>Astuce :</strong> Installez Waze et conduisez avec l'app active. Plus on est nombreux, plus le trafic a Libreville est precis !
        </span>
      </td></tr>
    </table>
  `);
}
