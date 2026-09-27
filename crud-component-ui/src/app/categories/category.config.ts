import type { EntityConfig } from "../../crud-component";
import type { Category } from "./category.types";

export const categoryConfig: EntityConfig<Category> = {
  label: "Kategorija",
  idField: "id",
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
      key: "description",
      label: "Opis",
      type: "text",
      showInTable: true,
      editable: true,
    },
  ],
};
