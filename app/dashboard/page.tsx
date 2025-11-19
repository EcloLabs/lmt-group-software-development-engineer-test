'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Navigation } from '@/components/navigation';
import { Package, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type DashboardStats = {
  totalArticles: number;
  totalStockValue: number;
  lowStockArticles: Array<{
    id: number;
    nom: string;
    quantite_stock: number;
    sku: string;
  }>;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Erreur de chargement');

      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Tableau de bord</h2>
          <p className="text-slate-600 mt-2">Vue d'ensemble de votre inventaire</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Articles
              </CardTitle>
              <Package className="h-5 w-5 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats?.totalArticles || 0}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Articles en stock
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Valeur Totale du Stock
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats?.totalStockValue.toFixed(2)} €
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Valeur de l'inventaire
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-slate-900">Alertes de Stock Faible</CardTitle>
            </div>
            <CardDescription>
              Les 5 articles avec le stock le plus bas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.lowStockArticles.length === 0 ? (
              <p className="text-slate-600 text-center py-8">
                Aucun article en stock faible
              </p>
            ) : (
              <div className="space-y-4">
                {stats?.lowStockArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{article.nom}</h4>
                      <p className="text-sm text-slate-600">SKU: {article.sku}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          article.quantite_stock === 0
                            ? 'bg-red-100 text-red-700'
                            : article.quantite_stock < 10
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {article.quantite_stock} unités
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
