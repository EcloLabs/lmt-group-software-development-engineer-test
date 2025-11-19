import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const articles = await prisma.article.findMany({
      select: {
        prix: true,
        quantiteStock: true,
      },
    });

    const totalArticles = articles.length;

    const totalStockValue = articles.reduce(
      (sum: number, article: { prix: any; quantiteStock: number }) => sum + (Number(article.prix) * article.quantiteStock),
      0
    );

    const lowStockArticles = await prisma.article.findMany({
      select: {
        id: true,
        nom: true,
        quantiteStock: true,
        sku: true,
      },
      orderBy: { quantiteStock: 'asc' },
      take: 5,
    });

    return NextResponse.json({
      totalArticles,
      totalStockValue: parseFloat(totalStockValue.toFixed(2)),
      lowStockArticles,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
