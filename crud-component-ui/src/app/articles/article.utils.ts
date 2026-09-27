import type { SelectOption } from "../../crud-component";
import type { Article, ArticleWithStock, Unit } from "./article.types";

export const UNIT_OPTIONS: SelectOption[] = [
  { value: "kom", label: "kom" },
  { value: "set", label: "set" },
  { value: "l", label: "litar" },
];

// Only liquids can be stocked in fractional quantities.
export const allowsFractionalQuantity = (unit: Unit | undefined) => unit === "l";

export const formatArticle = (article: Article) => `${article.catalogNumber} · ${article.name}`;

export const findArticle = (articles: Article[], articleId: string) =>
  articles.find((article) => article.id === articleId);

export const formatQuantity = (quantity: number) => quantity.toLocaleString("sr-Latn-BA");

export const isBelowMinimum = (article: ArticleWithStock) => article.stock < article.minStock;
