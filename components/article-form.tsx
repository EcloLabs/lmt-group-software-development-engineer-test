'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Article } from '@/lib/types';

type ArticleFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: Article | null;
  onSuccess: () => void;
};

export function ArticleForm({ open, onOpenChange, article, onSuccess }: ArticleFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    quantite_stock: '',
    sku: '',
  });

  useEffect(() => {
    if (article) {
      setFormData({
        nom: article.nom,
        description: article.description,
        prix: article.prix.toString(),
        quantite_stock: article.quantiteStock.toString(),
        sku: article.sku,
      });
    } else {
      setFormData({
        nom: '',
        description: '',
        prix: '',
        quantite_stock: '',
        sku: '',
      });
    }
  }, [article, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nom: formData.nom.trim(),
        description: formData.description.trim(),
        prix: parseFloat(formData.prix),
        quantite_stock: parseInt(formData.quantite_stock),
        sku: formData.sku.trim() || undefined,
      };

      if (isNaN(payload.prix) || payload.prix < 0) {
        toast.error('Le prix doit être un nombre positif');
        return;
      }

      if (isNaN(payload.quantite_stock) || payload.quantite_stock < 0) {
        toast.error('La quantité doit être un nombre positif');
        return;
      }

      const url = article ? `/api/articles/${article.id}` : '/api/articles';
      const method = article ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Erreur lors de la sauvegarde');
        return;
      }

      toast.success(
        article ? 'Article modifié avec succès' : 'Article créé avec succès'
      );
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {article ? 'Modifier l\'article' : 'Nouvel article'}
          </DialogTitle>
          <DialogDescription>
            {article
              ? 'Modifiez les informations de l\'article'
              : 'Créez un nouvel article dans votre inventaire'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom">
                Nom <span className="text-red-600">*</span>
              </Label>
              <Input
                id="nom"
                placeholder="Nom de l'article"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description de l'article"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={loading}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prix">
                  Prix (€) <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="prix"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.prix}
                  onChange={(e) =>
                    setFormData({ ...formData, prix: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantite_stock">
                  Quantité <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="quantite_stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantite_stock}
                  onChange={(e) =>
                    setFormData({ ...formData, quantite_stock: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="Généré automatiquement si vide"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                disabled={loading}
              />
              <p className="text-xs text-slate-600">
                Laissez vide pour générer automatiquement
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : article ? (
                'Modifier'
              ) : (
                'Créer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
