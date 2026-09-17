import { NextRequest, NextResponse } from 'next/server';
import { getArticleReactions, incrementArticleReaction } from '@/lib/db';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (isNaN(articleId)) {
    return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
  }

  const reactions = await getArticleReactions(articleId);
  return NextResponse.json(reactions);
}

export async function POST(req: NextRequest, { params }: RouteProps) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (isNaN(articleId)) {
    return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { reaction } = body;
    const valid = ['fire', 'cricket', 'clap', 'heart'];

    if (!valid.includes(reaction)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    const updated = await incrementArticleReaction(articleId, reaction);
    return NextResponse.json({ success: true, reactions: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
