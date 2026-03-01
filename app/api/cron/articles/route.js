import { query } from '@/lib/db';
import { publishArticle } from '@/lib/publish';

const MAX_ARTICLES_PER_DAY = 5;

const FRENCH_SOURCES = [
  "L'Automobiliste", '01net.com', 'Le Cri du Troll', 'Presse-citron',
  "L'Automobile Magazine", 'MCE TV', 'Journal du Geek', 'Android MT',
  'Capital.fr', 'Clubic', 'tomsguide.fr', "L'Indépendant",
  'Frandroid', 'Numerama', 'Les Numériques', 'Le Parisien',
  'Le Figaro', 'Le Monde', 'France Info', '20 Minutes',
  'BFM TV', 'Phonandroid', 'iPhon.fr', 'MacGeneration',
  'RTL', 'Europe 1', 'Ouest-France', 'Sud Ouest',
  'La Tribune', 'Huffington Post FR', 'Tom\'s Hardware FR',
];

const FRENCH_ACCENT_REGEX = /[àâéèêëïîôùûüçæœÀÂÉÈÊËÏÎÔÙÛÜÇÆŒ]/;

function isFrench(article) {
  // Source is a known French media
  if (FRENCH_SOURCES.some(s => article.source?.toLowerCase().includes(s.toLowerCase()))) {
    return true;
  }
  // Title contains French accented characters
  if (FRENCH_ACCENT_REGEX.test(article.title)) {
    return true;
  }
  return false;
}

const RSS_URLS = [
  'https://news.google.com/rss/search?q=waze+nouveaut%C3%A9s+OR+waze+mise+%C3%A0+jour+OR+waze+update&hl=fr&gl=FR&ceid=FR:fr',
];

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let allArticles = [];

    for (const url of RSS_URLS) {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'WazeGabonClub/1.0' },
        });
        if (res.ok) {
          const xml = await res.text();
          const articles = parseRSS(xml);
          allArticles.push(...articles);
        }
      } catch {
        // Skip failed feeds
      }
    }

    // Deduplicate by title similarity (Google News wraps URLs)
    const seen = new Set();
    const unique = allArticles.filter((a) => {
      const key = a.title.toLowerCase().slice(0, 60);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Filter: keep only French articles
    const french = unique.filter(isFrench);

    // Keep only 20 most recent
    const recent = french
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
      .slice(0, 20);

    let inserted = 0;
    let skippedNonFr = unique.length - french.length;
    let published = { telegram: 0, facebook: 0 };

    for (const article of recent) {
      if (inserted >= MAX_ARTICLES_PER_DAY) break;

      try {
        const result = await query(
          `INSERT INTO articles (title, description, url, source, tag, published_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (url) DO NOTHING`,
          [article.title, article.description, article.url, article.source, article.tag, article.published_at]
        );
        if (result.rowCount > 0) {
          inserted++;
          // Publish new articles to social channels
          try {
            const pub = await publishArticle(article);
            if (pub.telegram) published.telegram++;
            if (pub.facebook) published.facebook++;
          } catch {
            // Publishing failure should not block cron
          }
        }
      } catch {
        // Skip invalid entries
      }
    }

    const countResult = await query('SELECT COUNT(*) FROM articles');
    const total = parseInt(countResult.rows[0].count, 10);

    return Response.json({
      inserted,
      total,
      fetched: recent.length,
      skippedNonFr,
      maxPerDay: MAX_ARTICLES_PER_DAY,
      published,
    });
  } catch (err) {
    return Response.json({ error: 'Internal error', message: err.message }, { status: 500 });
  }
}

function parseRSS(xml) {
  const articles = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  const blocks = [...xml.matchAll(itemRegex)];

  for (const match of blocks) {
    const block = match[1];

    const title = extractTag(block, 'title');
    const description = extractTag(block, 'description') || '';
    const link = extractTag(block, 'link');
    const pubDate = extractTag(block, 'pubDate');
    const source = extractSource(block);

    if (!title || !link) continue;

    // Extract real URL from Google News redirect link or description
    const realUrl = extractRealUrl(description) || link;

    articles.push({
      title: stripHTML(title).slice(0, 500),
      description: stripHTML(description).slice(0, 1000),
      url: realUrl,
      source: source || 'Google News',
      tag: 'Waze',
      published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    });
  }

  return articles;
}

function extractTag(xml, tag) {
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function extractSource(block) {
  const sourceTag = extractTag(block, 'source');
  if (sourceTag) return stripHTML(sourceTag);

  // Extract from title: "Title - Source"
  const title = extractTag(block, 'title');
  if (title) {
    const parts = title.split(' - ');
    if (parts.length > 1) return parts[parts.length - 1].trim();
  }
  return null;
}

function extractRealUrl(description) {
  if (!description) return null;
  const match = description.match(/href="(https?:\/\/[^"]+)"/);
  return match ? match[1] : null;
}

function stripHTML(str) {
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
