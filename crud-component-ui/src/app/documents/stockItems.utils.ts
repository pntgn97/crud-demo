import { allowsFractionalQuantity, findArticle } from "../articles/article.utils";
import type { Article } from "../articles/article.types";
import type { StockItem } from "./document.types";

export const formatItemCount = (count: number) => {
  const lastTwo = count % 100;
  const last = count % 10;
  if (last === 1 && lastTwo !== 11) return `${count} stavka`;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${count} stavke`;
  return `${count} stavki`;
};

export const createStockItemsValidator =
  (articles: Article[]) =>
  (value: unknown): string | undefined => {
    const items = (value as StockItem[] | undefined) ?? [];
    if (items.length === 0) {
      return "Dokument mora imati bar jednu stavku.";
    }
    if (items.some((item) => !item.articleId)) {
      return "Izaberite artikl za svaku stavku.";
    }
    if (new Set(items.map((item) => item.articleId)).size !== items.length) {
      return "Isti artikl se ne može pojaviti u više stavki.";
    }
    if (items.some((item) => !(item.quantity > 0))) {
      return "Količina mora biti veća od 0.";
    }
    const wholeUnitItem = items.find(
      (item) =>
        !Number.isInteger(item.quantity) &&
        !allowsFractionalQuantity(findArticle(articles, item.articleId)?.unit),
    );
    if (wholeUnitItem) {
      return "Količina mora biti cijeli broj (osim za artikle koji se mjere u litrima).";
    }
    return undefined;
  };
