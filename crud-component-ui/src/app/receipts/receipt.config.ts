import type { EntityConfig } from "../../crud-component";
import type { Article } from "../articles/article.types";
import { createDocumentFields } from "../documents/document.fields";
import type { Supplier } from "../suppliers/supplier.types";
import type { Receipt } from "./receipt.types";

export const createReceiptConfig = (articles: Article[], suppliers: Supplier[]): EntityConfig<Receipt> => {
  const { date, invoiceNumber, items } = createDocumentFields<Receipt>(articles);

  return {
    label: "Ulazi",
    idField: "id",
    listTitle: "invoiceNumber",
    listSubtitle: ["date", "supplierId", "items"],
    fields: [
      date,
      {
        key: "supplierId",
        label: "Dobavljač",
        type: "select",
        showInTable: true,
        editable: true,
        required: true,
        filterable: true,
        options: suppliers.map((supplier) => ({ value: supplier.id, label: supplier.name })),
      },
      invoiceNumber,
      items,
    ],
  };
};
