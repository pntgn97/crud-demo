import type { FieldConfig } from "../../crud-component";
import type { Article } from "../articles/article.types";
import type { StockDocument, StockItem } from "./document.types";
import { StockItemsEditor, StockItemsSummary, StockItemsView } from "./StockItems";
import { createStockItemsValidator } from "./stockItems.utils";

// Field definitions shared by receipts and issues; each config combines them with its own fields.
export const createDocumentFields = <T extends StockDocument>(articles: Article[]) => {
  const date: FieldConfig<T> = {
    key: "date",
    label: "Datum",
    type: "date",
    showInTable: true,
    editable: true,
    required: true,
    sortable: true,
  };

  const invoiceNumber: FieldConfig<T> = {
    key: "invoiceNumber",
    label: "Broj fakture",
    type: "text",
    showInTable: true,
    editable: true,
    required: true,
    sortable: true,
    searchable: true,
  };

  const items: FieldConfig<T> = {
    key: "items",
    label: "Stavke",
    type: "custom",
    showInTable: true,
    editable: true,
    required: true,
    validate: createStockItemsValidator(articles),
    render: (value, _document, mode) =>
      mode === "full" ? (
        <StockItemsView items={value as StockItem[]} articles={articles} />
      ) : (
        <StockItemsSummary items={value as StockItem[]} />
      ),
    renderInput: ({ value, onChange }) => (
      <StockItemsEditor value={value as StockItem[] | undefined} onChange={onChange} articles={articles} />
    ),
  };

  return { date, invoiceNumber, items };
};
