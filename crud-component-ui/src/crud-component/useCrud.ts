import { useCallback, useEffect, useRef, useState, type SetStateAction } from "react";
import { getEntityId } from "./entityId";
import type { CrudService, EntityId, FilterOptions, IdField, SortOption } from "./types";

export interface UseCrudOptions<T> {
  idField: IdField<T>;
  defaultPerPage?: number;
}

export interface UseCrudResult<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  selectedItem: T | null;
  sort: SortOption<T> | null;
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  filter: FilterOptions<T>;
  select: (item: T | null) => void;
  setFilter: (filter: SetStateAction<FilterOptions<T>>) => void;
  setSort: (field: keyof T) => void;
  setSortOption: (sort: SortOption<T> | null) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  load: () => Promise<void>;
  clearError: () => void;
  // Mutations resolve to true on success; on failure they resolve to false and set `error`.
  create: (data: Partial<T>) => Promise<boolean>;
  update: (id: EntityId, data: Partial<T>) => Promise<boolean>;
  remove: (id: EntityId) => Promise<boolean>;
}

export const useCrud = <T,>(service: CrudService<T>, options: UseCrudOptions<T>): UseCrudResult<T> => {
  const { idField } = options;
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [sort, setSortState] = useState<SortOption<T> | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPageState] = useState(options.defaultPerPage ?? 10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filter, setFilterState] = useState<FilterOptions<T>>({});
  // Incremented on every load so responses of superseded requests can be ignored.
  const lastRequestRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++lastRequestRef.current;
    setLoading(true);
    setError(null);
    try {
      const result = await service.getAll({ sort: sort ?? undefined, pagination: { page, perPage }, filter });
      if (requestId !== lastRequestRef.current) {
        return;
      }
      setItems(result.data);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);
      // Replace the selected item with its fresh copy so the detail view reflects the latest data.
      setSelectedItem((current) => {
        if (!current) {
          return null;
        }
        const currentId = getEntityId(current, idField);
        return result.data.find((item) => getEntityId(item, idField) === currentId) ?? current;
      });
    } catch (err) {
      if (requestId === lastRequestRef.current) {
        setError(err instanceof Error ? err.message : "Greška pri učitavanju podataka");
      }
    } finally {
      if (requestId === lastRequestRef.current) {
        setLoading(false);
      }
    }
  }, [service, idField, sort, page, perPage, filter]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (data: Partial<T>) => {
      setError(null);
      try {
        await service.create(data);
        await load();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška pri dodavanju stavke");
        return false;
      }
    },
    [service, load],
  );

  const update = useCallback(
    async (id: EntityId, data: Partial<T>) => {
      setError(null);
      try {
        await service.update(id, data);
        await load();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška pri izmjeni stavke");
        return false;
      }
    },
    [service, load],
  );

  const remove = useCallback(
    async (id: EntityId) => {
      setError(null);
      try {
        await service.delete(id);
        setSelectedItem((current) => (current && getEntityId(current, idField) === id ? null : current));
        await load();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška pri brisanju stavke");
        return false;
      }
    },
    [service, idField, load],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const select = useCallback((item: T | null) => {
    setSelectedItem(item);
  }, []);

  const setSort = useCallback((field: keyof T) => {
    setSortState((current) => {
      if (!current || current.field !== field) {
        return { field, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { field, direction: "desc" };
      }
      return null;
    });
    setPage(1);
  }, []);

  const setSortOption = useCallback((next: SortOption<T> | null) => {
    setSortState(next);
    setPage(1);
  }, []);

  const setFilter = useCallback((next: SetStateAction<FilterOptions<T>>) => {
    setFilterState(next);
    setPage(1);
  }, []);

  const setPerPage = useCallback((next: number) => {
    setPerPageState(next);
    setPage(1);
  }, []);

  return {
    items,
    loading,
    error,
    selectedItem,
    sort,
    page,
    perPage,
    totalPages,
    totalItems,
    filter,
    select,
    setFilter,
    setSort,
    setSortOption,
    setPage,
    setPerPage,
    load,
    clearError,
    create,
    update,
    remove,
  };
};
