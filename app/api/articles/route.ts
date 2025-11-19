import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

function generateSKU(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `ART-${timestamp}-${random}`.toUpperCase();
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const offset = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { nom: { contains: search, mode: 'insensitive' as const } },
            { sku: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get articles error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nom, description, prix, quantite_stock, sku } = body;

    if (!nom || prix === undefined || quantite_stock === undefined) {
      return NextResponse.json(
        { error: 'Nom, prix et quantité en stock sont requis' },
        { status: 400 }
      );
    }

    if (prix < 0) {
      return NextResponse.json(
        { error: 'Le prix doit être positif ou nul' },
        { status: 400 }
      );
    }

    if (quantite_stock < 0) {
      return NextResponse.json(
        { error: 'La quantité en stock doit être positive ou nulle' },
        { status: 400 }
      );
    }

    const existingArticle = await prisma.article.findUnique({
      where: { nom },
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Un article avec ce nom existe déjà' },
        { status: 409 }
      );
    }

    const finalSku = sku || generateSKU();

    const existingSku = await prisma.article.findUnique({
      where: { sku: finalSku },
    });

    if (existingSku) {
      return NextResponse.json(
        { error: 'Un article avec ce SKU existe déjà' },
        { status: 409 }
      );
    }

    const article = await prisma.article.create({
      data: {
        nom,
        description: description || '',
        prix,
        quantiteStock: quantite_stock,
        sku: finalSku,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'article' },
      { status: 500 }
    );
  }
}
