import { createClient, Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import { Article, INITIAL_ARTICLES, INITIAL_ADMINS } from './seedData';

let clientInstance: Client | null = null;
let initialized = false;

function getDbClient(): Client {
  if (clientInstance) return clientInstance;

  const isVercel = !!process.env.VERCEL;
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    clientInstance = createClient({
      url: tursoUrl,
      authToken: tursoToken
    });
    return clientInstance;
  }

  let dbPath = path.join(process.cwd(), 'database.db');

  if (isVercel) {
    const tmpPath = path.join('/tmp', 'database.db');
    if (!fs.existsSync(tmpPath)) {
      try {
        fs.copyFileSync(dbPath, tmpPath);
      } catch (e) {
        console.warn('Could not copy database to /tmp:', e);
      }
    }
    dbPath = fs.existsSync(tmpPath) ? tmpPath : dbPath;
  }

  // Windows file path formatting for libSQL (file:C:/path or file:database.db)
  const normalizedPath = dbPath.replace(/\\/g, '/');
  const fileUrl = normalizedPath.startsWith('/') ? `file:${normalizedPath}` : `file:/${normalizedPath}`;

  clientInstance = createClient({
    url: fileUrl
  });

  return clientInstance;
}

export async function initDatabase() {
  if (initialized) return;
  const db = getDbClient();

  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        author TEXT NOT NULL,
        published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'draft',
        is_breaking INTEGER DEFAULT 0,
        featured_image TEXT,
        additional_images TEXT DEFAULT '[]',
        seo_title TEXT,
        meta_description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure additional_images column exists if table was already created
    try {
      await db.execute("ALTER TABLE articles ADD COLUMN additional_images TEXT DEFAULT '[]'");
    } catch (e) {
      // Column already exists or table freshly created
    }

    await db.execute(`
      CREATE TABLE IF NOT EXISTS article_reactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id INTEGER NOT NULL,
        reaction_type TEXT NOT NULL,
        count INTEGER DEFAULT 1,
        UNIQUE(article_id, reaction_type)
      );
    `);

    // Verify admin exists
    const adminCheck = await db.execute("SELECT COUNT(*) as count FROM admins");
    if (Number(adminCheck.rows[0]?.count || 0) === 0) {
      for (const admin of INITIAL_ADMINS) {
        await db.execute({
          sql: "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
          args: [admin.username, admin.password_hash]
        });
      }
    }

    // Verify articles exist
    const articleCheck = await db.execute("SELECT COUNT(*) as count FROM articles");
    if (Number(articleCheck.rows[0]?.count || 0) === 0) {
      for (const art of INITIAL_ARTICLES) {
        await db.execute({
          sql: `INSERT INTO articles (
            title, slug, content, category, author, published_at, status, is_breaking, featured_image, seo_title, meta_description
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            art.title,
            art.slug,
            art.content,
            art.category,
            art.author,
            art.published_at,
            art.status,
            art.is_breaking,
            art.featured_image,
            art.seo_title,
            art.meta_description
          ]
        });
      }
    }

    initialized = true;
  } catch (err) {
    console.error("Database initialization error:", err);
  }
}

// Data Access Helpers
export async function getPublishedArticles(limit = 50): Promise<Article[]> {
  try {
    await initDatabase();
    const db = getDbClient();
    const res = await db.execute({
      sql: `SELECT * FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT ?`,
      args: [limit]
    });
    return (res.rows as unknown) as Article[];
  } catch (e) {
    console.error("getPublishedArticles error, fallback to initial data:", e);
    return INITIAL_ARTICLES.filter(a => a.status === 'published').slice(0, limit);
  }
}

export async function getBreakingArticles(limit = 5): Promise<Article[]> {
  try {
    await initDatabase();
    const db = getDbClient();
    const res = await db.execute({
      sql: `SELECT title, slug FROM articles WHERE is_breaking = 1 AND status = 'published' ORDER BY published_at DESC LIMIT ?`,
      args: [limit]
    });
    return (res.rows as unknown) as Article[];
  } catch (e) {
    return INITIAL_ARTICLES.filter(a => a.is_breaking === 1 && a.status === 'published').slice(0, limit);
  }
}

export async function getArticlesByCategory(category: string, limit = 30): Promise<Article[]> {
  try {
    await initDatabase();
    const db = getDbClient();
    const catLower = category.toLowerCase().trim();
    const isBreaking = catLower === 'breaking news' || catLower === 'breaking-news';
    const res = isBreaking
      ? await db.execute({
          sql: `SELECT * FROM articles WHERE (is_breaking = 1 OR LOWER(category) = 'breaking news') AND status = 'published' ORDER BY published_at DESC LIMIT ?`,
          args: [limit]
        })
      : await db.execute({
          sql: `SELECT * FROM articles WHERE LOWER(category) = LOWER(?) AND status = 'published' ORDER BY published_at DESC LIMIT ?`,
          args: [category, limit]
        });
    return (res.rows as unknown) as Article[];
  } catch (e) {
    const catLower = category.toLowerCase().trim();
    const isBreaking = catLower === 'breaking news' || catLower === 'breaking-news';
    return INITIAL_ARTICLES.filter(a =>
      (isBreaking ? (a.is_breaking === 1 || a.category.toLowerCase() === 'breaking news') : a.category.toLowerCase() === catLower) &&
      a.status === 'published'
    ).slice(0, limit);
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    await initDatabase();
    const db = getDbClient();
    const res = await db.execute({
      sql: `SELECT * FROM articles WHERE slug = ? LIMIT 1`,
      args: [slug]
    });
    if (res.rows.length === 0) return null;
    return (res.rows[0] as unknown) as Article;
  } catch (e) {
    return INITIAL_ARTICLES.find(a => a.slug === slug) || null;
  }
}

export async function getArticleById(id: number): Promise<Article | null> {
  try {
    await initDatabase();
    const db = getDbClient();
    const res = await db.execute({
      sql: `SELECT * FROM articles WHERE id = ? LIMIT 1`,
      args: [id]
    });
    if (res.rows.length === 0) return null;
    return (res.rows[0] as unknown) as Article;
  } catch (e) {
    return INITIAL_ARTICLES.find(a => a.id === id) || null;
  }
}

export async function searchArticles(query: string, limit = 30): Promise<Article[]> {
  if (!query) return [];
  try {
    await initDatabase();
    const db = getDbClient();
    const pattern = `%${query}%`;
    const res = await db.execute({
      sql: `SELECT * FROM articles WHERE status = 'published' AND (title LIKE ? OR content LIKE ? OR category LIKE ? OR author LIKE ?) ORDER BY published_at DESC LIMIT ?`,
      args: [pattern, pattern, pattern, pattern, limit]
    });
    return (res.rows as unknown) as Article[];
  } catch (e) {
    const q = query.toLowerCase();
    return INITIAL_ARTICLES.filter(a =>
      a.status === 'published' &&
      (a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.category.toLowerCase().includes(q))
    ).slice(0, limit);
  }
}

export async function getAllArticlesAdmin(): Promise<Article[]> {
  try {
    await initDatabase();
    const db = getDbClient();
    const res = await db.execute("SELECT * FROM articles ORDER BY published_at DESC");
    return (res.rows as unknown) as Article[];
  } catch (e) {
    return INITIAL_ARTICLES;
  }
}

export async function createArticle(data: {
  title: string;
  slug: string;
  content: string;
  category: string;
  author: string;
  status: string;
  is_breaking: number;
  featured_image?: string;
  additional_images?: string;
  seo_title?: string;
  meta_description?: string;
  published_at?: string;
}) {
  await initDatabase();
  const db = getDbClient();
  const pubDate = data.published_at || new Date().toISOString();
  const res = await db.execute({
    sql: `INSERT INTO articles (
      title, slug, content, category, author, status, is_breaking, featured_image, additional_images, seo_title, meta_description, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.title,
      data.slug,
      data.content,
      data.category,
      data.author,
      data.status || 'draft',
      data.is_breaking || 0,
      data.featured_image || '',
      data.additional_images || '[]',
      data.seo_title || data.title,
      data.meta_description || '',
      pubDate
    ]
  });
  return Number(res.lastInsertRowid);
}

export async function updateArticle(id: number, data: {
  title: string;
  slug: string;
  content: string;
  category: string;
  author: string;
  status: string;
  is_breaking: number;
  featured_image?: string;
  additional_images?: string;
  seo_title?: string;
  meta_description?: string;
  published_at?: string;
}) {
  await initDatabase();
  const db = getDbClient();
  const pubDate = data.published_at || new Date().toISOString();
  await db.execute({
    sql: `UPDATE articles SET
      title = ?, slug = ?, content = ?, category = ?, author = ?, status = ?, is_breaking = ?, featured_image = ?, additional_images = ?, seo_title = ?, meta_description = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    args: [
      data.title,
      data.slug,
      data.content,
      data.category,
      data.author,
      data.status,
      data.is_breaking,
      data.featured_image || '',
      data.additional_images || '[]',
      data.seo_title || data.title,
      data.meta_description || '',
      pubDate,
      id
    ]
  });
}

export async function deleteArticle(id: number) {
  await initDatabase();
  const db = getDbClient();
  await db.execute({
    sql: "DELETE FROM articles WHERE id = ?",
    args: [id]
  });
}

export async function getArticleReactions(articleId: number): Promise<Record<string, number>> {
  try {
    await initDatabase();
    const db = getDbClient();
    const res = await db.execute({
      sql: "SELECT reaction_type, count FROM article_reactions WHERE article_id = ?",
      args: [articleId]
    });
    const map: Record<string, number> = { fire: 0, cricket: 0, clap: 0, heart: 0 };
    res.rows.forEach(r => {
      map[String(r.reaction_type)] = Number(r.count);
    });
    return map;
  } catch (e) {
    return { fire: 1, cricket: 0, clap: 0, heart: 0 };
  }
}

export async function incrementArticleReaction(articleId: number, reactionType: string) {
  await initDatabase();
  const db = getDbClient();
  await db.execute({
    sql: `
      INSERT INTO article_reactions (article_id, reaction_type, count)
      VALUES (?, ?, 1)
      ON CONFLICT(article_id, reaction_type) DO UPDATE SET count = count + 1
    `,
    args: [articleId, reactionType]
  });
  return getArticleReactions(articleId);
}

export async function getAdminByUsername(username: string) {
  await initDatabase();
  const db = getDbClient();
  const res = await db.execute({
    sql: "SELECT * FROM admins WHERE username = ? LIMIT 1",
    args: [username]
  });
  if (res.rows.length === 0) return null;
  return res.rows[0];
}

export async function updateAdminPassword(username: string, newHash: string) {
  await initDatabase();
  const db = getDbClient();
  await db.execute({
    sql: "UPDATE admins SET password_hash = ? WHERE username = ?",
    args: [newHash, username]
  });
}

export async function getSystemStats() {
  await initDatabase();
  const db = getDbClient();
  const res = await db.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
      SUM(CASE WHEN is_breaking = 1 THEN 1 ELSE 0 END) as breaking
    FROM articles
  `);
  const row = (res.rows[0] || {}) as Record<string, any>;
  return {
    total: Number(row.total || 0),
    published: Number(row.published || 0),
    draft: Number(row.draft || 0),
    breaking: Number(row.breaking || 0)
  };
}

export async function getAllCategories(): Promise<string[]> {
  try {
    await initDatabase();
    const db = getDbClient();
    const res = await db.execute("SELECT DISTINCT category FROM articles WHERE category IS NOT NULL AND TRIM(category) != '' ORDER BY category ASC");
    const cats = res.rows.map(r => String(r.category).trim()).filter(Boolean);
    const defaultCats = ['Cricket', 'Breaking News', 'Stories', 'India', 'World', 'Trending'];
    const set = new Set([...defaultCats, ...cats]);
    return Array.from(set);
  } catch (e) {
    return ['Cricket', 'Breaking News', 'Stories', 'India', 'World', 'Trending'];
  }
}
