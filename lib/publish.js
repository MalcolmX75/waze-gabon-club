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

/**
 * Publie un message communautaire "Waze Man" sur tous les canaux configurés.
 * @param {{ id: string, category: string, text: string, hashtags: string }} post
 * @returns {Promise<{ telegram: boolean, facebook: boolean }>}
 */
export async function publishCommunityPost(post) {
  const results = { telegram: false, facebook: false };

  const [tg, fb] = await Promise.allSettled([
    publishCommunityToTelegram(post),
    publishCommunityToFacebook(post),
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

  const cleanTitle = stripHTML(article.title);
  const cleanDesc = stripHTML(article.description || '');
  const cleanSource = stripHTML(article.source || '');

  const text = [
    `\u{1F697} *${escapeMarkdown(cleanTitle)}*`,
    '',
    cleanDesc ? escapeMarkdown(cleanDesc) : '',
    '',
    `\u{1F4F0} _${escapeMarkdown(cleanSource)}_`,
    `\u{1F517} [Lire l'article](${article.url})`,
    '',
    `\u{1F1EC}\u{1F1E6} #WazeGabon #Waze`,
  ].filter(Boolean).join('\n');

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

function stripHTML(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
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

  const cleanTitle = stripHTML(article.title);
  const cleanDesc = stripHTML(article.description || '');
  const cleanSource = stripHTML(article.source || '');

  const message = [
    `\u{1F697} ${cleanTitle}`,
    '',
    cleanDesc || '',
    '',
    `\u{1F4F0} Source : ${cleanSource}`,
    '',
    `\u{1F1EC}\u{1F1E6} #WazeGabon #Waze #Gabon #Libreville`,
  ].filter(Boolean).join('\n');

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

// === COMMUNITY (Waze Man) ===

async function publishCommunityToTelegram(post) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  if (!token || !chatId) return false;

  // Texte brut, pas de Markdown complexe — emojis natifs
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: post.text,
      disable_web_page_preview: true,
    }),
  });

  return res.ok;
}

async function publishCommunityToFacebook(post) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_TOKEN;
  if (!pageId || !token) return false;

  // Texte + hashtags en fin de message
  const message = `${post.text}\n\n${post.hashtags}`;

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${pageId}/feed`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        access_token: token,
      }),
    }
  );

  return res.ok;
}
