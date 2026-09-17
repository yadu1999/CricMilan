import { NextResponse } from 'next/server';
import { getSystemStats } from '@/lib/db';

export async function GET() {
  try {
    const stats = await getSystemStats();
    return NextResponse.json({
      status: 'ok',
      appName: 'CricMilan',
      tagline: 'CRICKET & NEWS ALWAYS ON.',
      framework: 'Next.js App Router (Vercel Native)',
      version: '3.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: 'connected',
        totalArticles: stats.total,
        publishedArticles: stats.published,
        draftArticles: stats.draft,
        breakingArticles: stats.breaking
      },
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
