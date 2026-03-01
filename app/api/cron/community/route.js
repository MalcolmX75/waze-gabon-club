import { query } from '@/lib/db';
import { publishCommunityPost } from '@/lib/publish';
import { COMMUNITY_POSTS } from '@/lib/community-posts';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ensure community_log table exists
    await query(`
      CREATE TABLE IF NOT EXISTS community_log (
        id serial PRIMARY KEY,
        post_id text UNIQUE NOT NULL,
        posted_at timestamptz DEFAULT now()
      )
    `);

    // Get already posted message IDs
    const postedResult = await query('SELECT post_id FROM community_log');
    const postedIds = new Set(postedResult.rows.map(r => r.post_id));

    // Find messages not yet posted
    let available = COMMUNITY_POSTS.filter(p => !postedIds.has(p.id));

    // If all messages have been posted, reset the cycle
    let cycleReset = false;
    if (available.length === 0) {
      await query('DELETE FROM community_log');
      available = COMMUNITY_POSTS;
      cycleReset = true;
    }

    // Pick a random message
    const post = available[Math.floor(Math.random() * available.length)];

    // Publish to Telegram + Facebook
    const published = await publishCommunityPost(post);

    // Log to DB
    await query(
      'INSERT INTO community_log (post_id) VALUES ($1) ON CONFLICT (post_id) DO NOTHING',
      [post.id]
    );

    return Response.json({
      posted: post.id,
      category: post.category,
      published,
      cycleReset,
      remaining: available.length - 1,
      total: COMMUNITY_POSTS.length,
    });
  } catch (err) {
    return Response.json({ error: 'Internal error', message: err.message }, { status: 500 });
  }
}
