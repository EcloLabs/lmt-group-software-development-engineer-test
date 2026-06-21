import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Get article error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { id } = await params;
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

    const existingArticle = await prisma.article.findFirst({
      where: {
        nom,
        id: { not: parseInt(id) },
      },
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Un autre article avec ce nom existe déjà' },
        { status: 409 }
      );
    }

    if (sku) {
      const existingSku = await prisma.article.findFirst({
        where: {
          sku,
          id: { not: parseInt(id) },
        },
      });

      if (existingSku) {
        return NextResponse.json(
          { error: 'Un autre article avec ce SKU existe déjà' },
          { status: 409 }
        );
      }
    }

    const updateData: any = {
      nom,
      description: description || '',
      prix,
      quantiteStock: quantite_stock,
    };

    if (sku) {
      updateData.sku = sku;
    }

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Update article error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.article.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'article' },
      { status: 500 }
    );
  }
}
