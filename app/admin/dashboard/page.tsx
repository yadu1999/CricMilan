import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { getAllArticlesAdmin, getSystemStats } from '@/lib/db';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const [articles, stats] = await Promise.all([
    getAllArticlesAdmin(),
    getSystemStats()
  ]);

  return (
    <AdminDashboardClient
      initialArticles={articles}
      stats={stats}
      adminUsername={admin.username}
    />
  );
}
