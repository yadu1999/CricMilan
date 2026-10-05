import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { getArticleById, updateArticle, deleteArticle } from '@/lib/db';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  const articleId = parseInt(id, 10);
  const article = await getArticleById(articleId);

  if (!article) {
    return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PUT(req: NextRequest, { params }: RouteProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  const articleId = parseInt(id, 10);
  const article = await getArticleById(articleId);

  if (!article) {
    return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
  }

  try {
    const data = await req.json();

    const slug = (data.slug || article.slug || data.title)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    await updateArticle(articleId, {
      title: data.title || article.title,
      slug,
      content: data.content !== undefined ? data.content : article.content,
      category: data.category || article.category,
      author: data.author || article.author,
      status: data.status || article.status,
      is_breaking: data.is_breaking !== undefined ? (data.is_breaking ? 1 : 0) : article.is_breaking,
      featured_image: data.featured_image !== undefined ? data.featured_image : article.featured_image,
      additional_images: data.additional_images !== undefined ? (typeof data.additional_images === 'string' ? data.additional_images : JSON.stringify(data.additional_images)) : (article.additional_images || '[]'),
      seo_title: data.seo_title || data.title || article.seo_title,
      meta_description: data.meta_description !== undefined ? data.meta_description : article.meta_description,
      published_at: data.published_at || article.published_at
    });

    return NextResponse.json({ success: true, id: articleId, slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  const articleId = parseInt(id, 10);

  try {
    await deleteArticle(articleId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
