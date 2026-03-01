// Waze Gabon Club — Social Publishing
// Publie les nouveaux articles sur Telegram et Facebook.
// Si un token est absent, le canal est silencieusement ignoré.

/**
 * Publie un article sur tous les canaux configurés.
 * @param {{ title: string, description: string, url: string, source: string }} article
 * @returns {Promise<{ telegram: boolean, facebook: boolean }>}
 */
export async function publishArticle(article) {
  const results = { telegram: false, facebook: false };

  const [tg, fb] = await Promise.allSettled([
    publishToTelegram(article),
    publishToFacebook(article),
  ]);

  results.telegram = tg.status === 'fulfilled' && tg.value;
  results.facebook = fb.status === 'fulfilled' && fb.value;

  return results;
}

// === TELEGRAM ===

async function publishToTelegram(article) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  if (!token || !chatId) return false;

  // Format message with Waze Gabon branding
  const text = [
    `\u{1F697} *${escapeMarkdown(article.title)}*`,
    '',
    escapeMarkdown(article.description || ''),
    '',
    `\u{1F4F0} _${escapeMarkdown(article.source)}_`,
    `\u{1F517} [Lire l'article](${article.url})`,
    '',
    `\u{1F1EC}\u{1F1E6} #WazeGabon #Waze`,
  ].join('\n');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: false,
    }),
  });

  return res.ok;
}

function escapeMarkdown(str) {
  if (!str) return '';
  return str.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

// === FACEBOOK ===

async function publishToFacebook(article) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_TOKEN;
  if (!pageId || !token) return false;

  const message = [
    `\u{1F697} ${article.title}`,
    '',
    article.description || '',
    '',
    `\u{1F4F0} Source : ${article.source}`,
    '',
    `\u{1F1EC}\u{1F1E6} #WazeGabon #Waze #Gabon #Libreville`,
  ].join('\n');

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${pageId}/feed`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        link: article.url,
        access_token: token,
      }),
    }
  );

  return res.ok;
}
