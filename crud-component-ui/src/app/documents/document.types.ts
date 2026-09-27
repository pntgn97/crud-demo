export interface StockItem {
  articleId: string;
  quantity: number;
}

// Fields shared by goods receipts and goods issues.
export interface StockDocument {
  id: string;
  date: string;
  invoiceNumber: string;
  items: StockItem[];
}
