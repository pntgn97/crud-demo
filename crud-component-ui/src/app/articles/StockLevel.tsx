import type { FieldRenderMode } from "../../crud-component";
import type { ArticleWithStock } from "./article.types";
import { formatQuantity, isBelowMinimum } from "./article.utils";

interface StockLevelProps {
  article: ArticleWithStock;
  mode: FieldRenderMode;
}

// Current stock of an article, highlighted when it is below the minimum stock.
export const StockLevel = ({ article, mode }: StockLevelProps) => {
  const quantity = `${formatQuantity(article.stock)} ${article.unit}`;

  if (!isBelowMinimum(article)) {
    return <>{quantity}</>;
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span
        title="Ispod minimalne zalihe"
        className="rounded-full bg-red-50 px-2 py-0.5 font-medium whitespace-nowrap text-red-700"
      >
        {quantity}
      </span>
      {mode === "full" && (
        <span className="text-xs text-red-700">
          Ispod minimalne zalihe ({formatQuantity(article.minStock)} {article.unit})
        </span>
      )}
    </span>
  );
};
