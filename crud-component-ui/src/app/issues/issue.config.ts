import type { EntityConfig } from "../../crud-component";
import type { Article } from "../articles/article.types";
import { createDocumentFields } from "../documents/document.fields";
import { createIssueStockValidator } from "./issueStock.validation";
import type { Issue } from "./issue.types";

export const createIssueConfig = (articles: Article[]): EntityConfig<Issue> => {
  const { date, invoiceNumber, items } = createDocumentFields<Issue>(articles);
  const validateStock = createIssueStockValidator(articles);

  return {
    label: "Izlazi",
    idField: "id",
    listTitle: "invoiceNumber",
    listSubtitle: ["date", "items"],
    fields: [
      date,
      invoiceNumber,
      {
        ...items,
        // The shared item rules run first; stock is checked only for otherwise valid items.
        validate: async (value, issue) => (await items.validate?.(value, issue)) ?? validateStock(value, issue),
      },
    ],
  };
};
