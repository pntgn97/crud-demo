import type { CrudService, GetAllOptions } from "../../crud-component";
import { getStock, loadStockLevels, type StockLevels } from "../stock/stock";
import { articleService } from "./article.service";
import type { Article, ArticleWithStock } from "./article.types";

const withStock = (article: Article, levels: StockLevels): ArticleWithStock => ({
  ...article,
  stock: getStock(levels, article.id),
});

// `stock` is computed, so it must never be sent to the server.
const withoutStock = (data: Partial<ArticleWithStock>): Partial<Article> => {
  const { stock: _stock, ...article } = data;
  return article;
};

// Decorates the plain article service: every article it returns carries its current stock.
export const articleWithStockService: CrudService<ArticleWithStock> = {
  getAll: async (options) => {
    // `stock` exists only on the client, so it is never marked sortable or filterable.
    const [result, levels] = await Promise.all([
      articleService.getAll(options as GetAllOptions<Article>),
      loadStockLevels(),
    ]);
    return { ...result, data: result.data.map((article) => withStock(article, levels)) };
  },

  getById: async (id) => {
    const [article, levels] = await Promise.all([articleService.getById(id), loadStockLevels()]);
    return withStock(article, levels);
  },

  create: async (data) => {
    const article = await articleService.create(withoutStock(data));
    return { ...article, stock: 0 };
  },

  update: async (id, data) => {
    const [article, levels] = await Promise.all([
      articleService.update(id, withoutStock(data)),
      loadStockLevels(),
    ]);
    return withStock(article, levels);
  },

  delete: (id) => articleService.delete(id),
};
