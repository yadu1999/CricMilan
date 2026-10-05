import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { getAllArticlesAdmin, createArticle } from '@/lib/db';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const articles = await getAllArticlesAdmin();
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!data.title || !data.content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    // Auto slug if not provided
    const slug = (data.slug || data.title)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const id = await createArticle({
      title: data.title,
      slug,
      content: data.content,
      category: data.category || 'Cricket',
      author: data.author || admin.username,
      status: data.status || 'draft',
      is_breaking: data.is_breaking ? 1 : 0,
      featured_image: data.featured_image || '',
      additional_images: typeof data.additional_images === 'string' ? data.additional_images : JSON.stringify(data.additional_images || []),
      seo_title: data.seo_title || data.title,
      meta_description: data.meta_description || '',
      published_at: data.published_at || new Date().toISOString()
    });

    return NextResponse.json({ success: true, id, slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
