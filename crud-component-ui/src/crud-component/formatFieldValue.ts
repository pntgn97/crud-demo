import type { ReactNode } from "react";
import type { FieldConfig, FieldRenderMode } from "./types";

export const formatFieldValue = <T,>(value: unknown, field: FieldConfig<T>): string => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  switch (field.type) {
    case "boolean":
      return value ? "Da" : "Ne";
    case "date": {
      const date = new Date(value as string);
      return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
    }
    case "select": {
      const option = field.options?.find((o) => o.value === value);
      return option ? option.label : String(value);
    }
    default:
      return String(value);
  }
};

export const renderFieldValue = <T,>(
  item: T,
  field: FieldConfig<T>,
  mode: FieldRenderMode,
): ReactNode =>
  field.render ? field.render(item[field.key], item, mode) : formatFieldValue(item[field.key], field);
