'use server';

import { query } from '@/lib/db';

export async function getArticles() {
  try {
    const result = await query(
      'SELECT title, description, url, source, tag, published_at FROM articles ORDER BY published_at DESC LIMIT 6'
    );
    if (result.rows.length === 0) return null;
    return result.rows;
  } catch {
    return null;
  }
}
