import { allowsFractionalQuantity, findArticle, formatArticle, formatQuantity } from "../articles/article.utils";
import type { Article } from "../articles/article.types";
import type { StockItem } from "./document.types";
import { formatItemCount } from "./stockItems.utils";

export const StockItemsSummary = ({ items = [] }: { items?: StockItem[] }) => <>{formatItemCount(items.length)}</>;

interface StockItemsViewProps {
  items?: StockItem[];
  articles: Article[];
}

export const StockItemsView = ({ items = [], articles }: StockItemsViewProps) => {
  if (items.length === 0) {
    return <span>-</span>;
  }

  return (
    <div className="mt-1 overflow-x-auto rounded-md border border-gray-200">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500">
            <th className="px-3 py-2 font-medium">Kataloški broj</th>
            <th className="px-3 py-2 font-medium">Artikl</th>
            <th className="px-3 py-2 text-right font-medium">Količina</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const article = findArticle(articles, item.articleId);

            return (
              <tr key={index} className="border-b border-gray-100 last:border-0">
                <td className="px-3 py-2 whitespace-nowrap">{article?.catalogNumber ?? "-"}</td>
                <td className="px-3 py-2">{article?.name ?? "Nepoznat artikl"}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatQuantity(item.quantity)} {article?.unit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

interface StockItemsEditorProps {
  value?: StockItem[];
  onChange: (items: StockItem[]) => void;
  articles: Article[];
}

export const StockItemsEditor = ({ value = [], onChange, articles }: StockItemsEditorProps) => {
  const updateItem = (index: number, changes: Partial<StockItem>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...changes } : item)));
  };

  const addItem = () => {
    onChange([...value, { articleId: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="grid grid-cols-[1fr_5rem_2rem_2rem] gap-2 text-xs font-medium text-gray-500">
          <span>Artikl</span>
          <span>Kol.</span>
          <span />
          <span />
        </div>
      )}

      {value.map((item, index) => {
        const article = findArticle(articles, item.articleId);

        return (
          <div key={index} className="grid grid-cols-[1fr_5rem_2rem_2rem] items-center gap-2">
            <select
              value={item.articleId}
              onChange={(e) => updateItem(index, { articleId: e.target.value })}
              aria-label={`Artikl, stavka ${index + 1}`}
              className="min-w-0 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="" disabled>
                Izaberite...
              </option>
              {articles.map((a) => (
                <option key={a.id} value={a.id}>
                  {formatArticle(a)}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              step={allowsFractionalQuantity(article?.unit) ? 0.1 : 1}
              value={item.quantity}
              onChange={(e) => updateItem(index, { quantity: e.target.value === "" ? 0 : Number(e.target.value) })}
              aria-label={`Količina, stavka ${index + 1}`}
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-gray-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <span className="text-sm text-gray-500">{article?.unit}</span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              aria-label={`Ukloni stavku ${index + 1}`}
              className="flex size-8 items-center justify-center rounded-full text-lg leading-none text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
              ×
            </button>
          </div>
        );
      })}

      <div className="pt-1">
        <button
          type="button"
          onClick={addItem}
          className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
        >
          + Dodaj stavku
        </button>
      </div>
    </div>
  );
};
