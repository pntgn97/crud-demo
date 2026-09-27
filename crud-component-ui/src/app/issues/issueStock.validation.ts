import { findArticle, formatQuantity } from "../articles/article.utils";
import type { Article } from "../articles/article.types";
import type { StockItem } from "../documents/document.types";
import { getStock, loadStockLevels } from "../stock/stock";
import type { Issue } from "./issue.types";

// Checks that no issue item takes more than the article's current stock. Stock is loaded fresh on
// every submit, but this is still only a client-side check: two users saving at the same time could
// both pass it, so a reliable rule would have to be enforced by the server.
export const createIssueStockValidator =
  (articles: Article[]) =>
  async (value: unknown, issue: Partial<Issue>): Promise<string | undefined> => {
    const items = (value as StockItem[] | undefined) ?? [];
    const levels = await loadStockLevels({ excludeIssueId: issue.id });

    const problems = items
      .filter((item) => item.quantity > getStock(levels, item.articleId))
      .map((item) => {
        const article = findArticle(articles, item.articleId);
        const unit = article?.unit ?? "";
        return `${article?.catalogNumber ?? "Nepoznat artikl"}: traženo ${formatQuantity(item.quantity)} ${unit}, na stanju ${formatQuantity(getStock(levels, item.articleId))} ${unit}`;
      });

    return problems.length > 0 ? `Količina prelazi trenutno stanje (${problems.join("; ")}).` : undefined;
  };
