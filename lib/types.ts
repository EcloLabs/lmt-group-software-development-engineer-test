export interface Article {
  id: number;
  nom: string;
  description: string;
  prix: string;
  quantiteStock: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface DashboardStats {
  totalArticles: number;
  totalStockValue: number;
  lowStockArticles: {
    id: number;
    nom: string;
    quantiteStock: number;
    sku: string;
  }[];
}
