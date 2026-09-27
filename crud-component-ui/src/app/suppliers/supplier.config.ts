import type { EntityConfig } from "../../crud-component";
import type { Supplier } from "./supplier.types";

const isBlank = (value: unknown) => value === undefined || value === null || value === "";

export const supplierConfig: EntityConfig<Supplier> = {
  label: "Dobavljači",
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
      searchable: true,
    },
    {
      key: "jib",
      label: "JIB",
      type: "text",
      showInTable: true,
      editable: true,
      searchable: true,
      validate: (value) =>
        isBlank(value) || /^\d{13}$/.test(String(value)) ? undefined : "JIB mora imati tačno 13 cifara.",
    },
    {
      key: "address",
      label: "Adresa",
      type: "text",
      editable: true,
    },
    {
      key: "city",
      label: "Grad",
      type: "text",
      showInTable: true,
      editable: true,
      sortable: true,
      searchable: true,
    },
    {
      key: "phone",
      label: "Telefon",
      type: "text",
      showInTable: true,
      editable: true,
    },
    {
      key: "email",
      label: "E-mail",
      type: "text",
      showInTable: true,
      editable: true,
      validate: (value) =>
        isBlank(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
          ? undefined
          : "Unesite ispravnu e-mail adresu.",
    },
  ],
};
