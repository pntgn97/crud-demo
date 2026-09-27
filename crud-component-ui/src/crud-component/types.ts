import type { ReactNode } from "react";

export type FieldType = "text" | "number" | "date" | "boolean" | "select" | "custom";

export interface SelectOption {
  value: string | number;
  label: string;
}

// "compact" is used for table cells and list items, "full" for the detail panel.
export type FieldRenderMode = "compact" | "full";

export interface FieldInputProps<T> {
  value: unknown;
  values: Partial<T>;
  onChange: (value: unknown) => void;
  error?: string;
}

export interface FieldConfig<T> {
  key: keyof T;
  label: string;
  type: FieldType;
  showInTable?: boolean;
  editable?: boolean;
  required?: boolean;
  sortable?: boolean;
  options?: SelectOption[];
  validate?: (value: unknown, entity: Partial<T>) => string | undefined;
  render?: (value: unknown, entity: T, mode: FieldRenderMode) => ReactNode;
  renderInput?: (props: FieldInputProps<T>) => ReactNode;
}

export interface EntityConfig<T> {
  label: string;
  idField: keyof T;
  fields: FieldConfig<T>[];
  listTitle?: keyof T;
  listSubtitle?: (keyof T)[];
}

export type SortDirection = "asc" | "desc";

export interface SortOption<T> {
  field: keyof T;
  direction: SortDirection;
}

export interface PaginationOptions {
  page: number;
  perPage: number;
}

export interface GetAllOptions<T> {
  sort?: SortOption<T>;
  pagination?: PaginationOptions;
}

export interface GetAllResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

export interface CrudService<T> {
  getAll(options?: GetAllOptions<T>): Promise<GetAllResult<T>>;
  getById(id: string | number): Promise<T>;
  create(data: Omit<T, "id">): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<void>;
}
