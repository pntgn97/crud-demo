export type Unit = "kom" | "set" | "l";

export interface Article {
  id: string;
  catalogNumber: string;
  name: string;
  manufacturer: string;
  unit: Unit;
  groupId: string;
  shelfLocation?: string;
  minStock: number;
}

// Article as shown on the articles page: `stock` is computed from receipts and issues, never stored.
export interface ArticleWithStock extends Article {
  stock: number;
}
