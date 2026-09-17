import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import ArticleEditor from '@/components/ArticleEditor';

export default async function NewArticlePage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  return <ArticleEditor />;
}
