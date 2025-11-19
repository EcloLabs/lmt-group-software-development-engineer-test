'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Navigation } from '@/components/navigation';
import { ArticleForm } from '@/components/article-form';
import { DeleteDialog } from '@/components/delete-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Loader2, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Article } from '@/lib/types';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteArticle, setDeleteArticle] = useState<{
    id: number;
    nom: string;
  } | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [page, search, sortBy, sortOrder]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/articles?${params}`);
      if (!response.ok) throw new Error('Erreur de chargement');

      const data = await response.json();
      setArticles(data.articles);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleDelete = (article: Article) => {
    setDeleteArticle({ id: article.id, nom: article.nom });
  };

  const handleSuccess = () => {
    fetchArticles();
    setEditingArticle(null);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Gestion des Articles</h2>
          <p className="text-slate-600 mt-2">Gérez votre inventaire d'articles</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-slate-900">Liste des Articles</CardTitle>
                <CardDescription>
                  {articles.length} article{articles.length !== 1 ? 's' : ''} affiché{articles.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setEditingArticle(null);
                  setShowForm(true);
                }}
                className="bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvel Article
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher par nom ou SKU..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Date de création</SelectItem>
                      <SelectItem value="nom">Nom</SelectItem>
                      <SelectItem value="prix">Prix</SelectItem>
                      <SelectItem value="quantite_stock">Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Ordre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Croissant</SelectItem>
                      <SelectItem value="desc">Décroissant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600">Aucun article trouvé</p>
                  {search && (
                    <Button
                      variant="link"
                      onClick={() => handleSearch('')}
                      className="mt-2"
                    >
                      Réinitialiser la recherche
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="font-semibold">Nom</TableHead>
                          <TableHead className="font-semibold">SKU</TableHead>
                          <TableHead className="font-semibold">Prix</TableHead>
                          <TableHead className="font-semibold">Stock</TableHead>
                          <TableHead className="font-semibold">Description</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {articles.map((article) => (
                          <TableRow
                            key={article.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <TableCell className="font-medium">{article.nom}</TableCell>
                            <TableCell>
                              <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                                {article.sku}
                              </code>
                            </TableCell>
                            <TableCell>{Number(article.prix).toFixed(2)} €</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  article.quantiteStock === 0
                                    ? 'bg-red-100 text-red-700'
                                    : article.quantiteStock < 10
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-green-100 text-green-700'
                                }`}
                              >
                                {article.quantiteStock}
                              </span>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {article.description || '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(article)}
                                  className="hover:bg-slate-100"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(article)}
                                  className="hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-slate-600">
                        Page {page} sur {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <ArticleForm
        open={showForm}
        onOpenChange={setShowForm}
        article={editingArticle}
        onSuccess={handleSuccess}
      />

      {deleteArticle && (
        <DeleteDialog
          open={!!deleteArticle}
          onOpenChange={(open) => !open && setDeleteArticle(null)}
          articleId={deleteArticle.id}
          articleName={deleteArticle.nom}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
