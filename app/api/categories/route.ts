import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/db';

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (e: any) {
    return NextResponse.json(
      ['Cricket', 'Breaking News', 'Stories', 'India', 'World', 'Trending'],
      { status: 500 }
    );
  }
}
