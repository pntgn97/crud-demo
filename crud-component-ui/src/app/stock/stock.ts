import type { StockDocument } from "../documents/document.types";
import { issueService } from "../issues/issue.service";
import { receiptService } from "../receipts/receipt.service";

export type StockLevels = Map<string, number>;

// Rounds away floating-point noise from summing fractional quantities (e.g. 0.1 + 0.2 litres).
const roundQuantity = (quantity: number) => Math.round(quantity * 1000) / 1000;

// Stock of each article = total received quantity − total issued quantity.
export const computeStockLevels = (receipts: StockDocument[], issues: StockDocument[]): StockLevels => {
  const levels: StockLevels = new Map();
  const add = (documents: StockDocument[], sign: 1 | -1) => {
    for (const document of documents) {
      for (const item of document.items) {
        levels.set(item.articleId, (levels.get(item.articleId) ?? 0) + sign * item.quantity);
      }
    }
  };
  add(receipts, 1);
  add(issues, -1);

  for (const [articleId, quantity] of levels) {
    levels.set(articleId, roundQuantity(quantity));
  }
  return levels;
};

interface LoadStockOptions {
  // Leaves out one issue, e.g. the one being edited, whose old quantities must not count against the stock.
  excludeIssueId?: string;
}

// Loads all receipts and issues and computes the current stock. In a real system the server would
// maintain or aggregate this; the mock API has no such endpoint, so it is computed on the client.
export const loadStockLevels = async ({ excludeIssueId }: LoadStockOptions = {}): Promise<StockLevels> => {
  const [receipts, issues] = await Promise.all([receiptService.getAll(), issueService.getAll()]);
  return computeStockLevels(
    receipts.data,
    issues.data.filter((issue) => issue.id !== excludeIssueId),
  );
};

export const getStock = (levels: StockLevels, articleId: string) => levels.get(articleId) ?? 0;
