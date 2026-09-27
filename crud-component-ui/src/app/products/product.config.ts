import type { EntityConfig } from "../../crud-component";
import type { Category } from "../categories/category.types";
import type { Product } from "./product.types";

export const createProductConfig = (categories: Category[]): EntityConfig<Product> => ({
  label: "Proizvod",
  idField: "id",
  listTitle: "name",
  listSubtitle: ["price", "categoryId"],
  fields: [
    {
      key: "name",
      label: "Naziv",
      type: "text",
      showInTable: true,
      editable: true,
      required: true,
      sortable: true,
    },
    {
      key: "price",
      label: "Cijena",
      type: "number",
      showInTable: true,
      editable: true,
      required: true,
      sortable: true,
      validate: (value) =>
        typeof value === "number" && value <= 0 ? "Cijena mora biti veća od 0." : undefined,
    },
    {
      key: "quantity",
      label: "Količina",
      type: "number",
      showInTable: true,
      editable: true,
      required: true,
      sortable: true,
      validate: (value) =>
        typeof value === "number" && value < 0 ? "Količina ne može biti negativna." : undefined,
    },
    {
      key: "categoryId",
      label: "Kategorija",
      type: "select",
      showInTable: true,
      editable: true,
      required: true,
      options: categories.map((category) => ({ value: category.id, label: category.name })),
    },
  ],
});
