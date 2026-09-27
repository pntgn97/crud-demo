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
  // Included in the free-text search (case-insensitive "contains"); intended for text fields.
  searchable?: boolean;
  // Gets its own filter dropdown with exact-match comparison; supported for "select" and "boolean" fields.
  filterable?: boolean;
  options?: SelectOption[];
  // May return a promise, e.g. to check a value against the server when the form is submitted.
  validate?: (value: unknown, entity: Partial<T>) => string | undefined | Promise<string | undefined>;
  render?: (value: unknown, entity: T, mode: FieldRenderMode) => ReactNode;
  renderInput?: (props: FieldInputProps<T>) => ReactNode;
}

export type EntityId = string | number;

// Keys of T whose values can serve as an identifier.
export type IdField<T> = { [K in keyof T]-?: T[K] extends EntityId ? K : never }[keyof T];

export interface EntityConfig<T> {
  label: string;
  idField: IdField<T>;
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

export type FilterValue = string | number | boolean;

export interface SearchOption<T> {
  text: string;
  fields: (keyof T)[];
}

// An item matches when any search field contains the text AND every entry in `values` is equal.
export interface FilterOptions<T> {
  search?: SearchOption<T>;
  values?: Partial<Record<keyof T, FilterValue>>;
}

export interface GetAllOptions<T> {
  sort?: SortOption<T>;
  pagination?: PaginationOptions;
  filter?: FilterOptions<T>;
}

export interface GetAllResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

export interface CrudService<T> {
  getAll(options?: GetAllOptions<T>): Promise<GetAllResult<T>>;
  getById(id: EntityId): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: EntityId, data: Partial<T>): Promise<T>;
  delete(id: EntityId): Promise<void>;
}
