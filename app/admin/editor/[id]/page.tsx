import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { getArticleById } from '@/lib/db';
import ArticleEditor from '@/components/ArticleEditor';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (isNaN(articleId)) {
    notFound();
  }

  const article = await getArticleById(articleId);
  if (!article) {
    notFound();
  }

  return <ArticleEditor initialArticle={article} />;
}
