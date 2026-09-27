import { useCallback, useEffect, useState } from "react";
import type { CrudService, SortOption } from "./types";

export interface UseCrudOptions {
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
  select: (item: T | null) => void;
  setSort: (field: keyof T) => void;
  setSortOption: (sort: SortOption<T> | null) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  load: () => Promise<void>;
  create: (data: Omit<T, "id">) => Promise<void>;
  update: (id: string | number, data: Partial<T>) => Promise<void>;
  remove: (id: string | number) => Promise<void>;
}

export const useCrud = <T extends { id: string | number }>(
  service: CrudService<T>,
  options?: UseCrudOptions,
): UseCrudResult<T> => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [sort, setSortState] = useState<SortOption<T> | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPageState] = useState(options?.defaultPerPage ?? 10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.getAll({ sort: sort ?? undefined, pagination: { page, perPage } });
      setItems(result.data);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri učitavanju podataka");
    } finally {
      setLoading(false);
    }
  }, [service, sort, page, perPage]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (data: Omit<T, "id">) => {
      setError(null);
      try {
        await service.create(data);
        await load();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška pri dodavanju stavke");
      }
    },
    [service, load],
  );

  const update = useCallback(
    async (id: string | number, data: Partial<T>) => {
      setError(null);
      try {
        await service.update(id, data);
        await load();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška pri izmjeni stavke");
      }
    },
    [service, load],
  );

  const remove = useCallback(
    async (id: string | number) => {
      setError(null);
      try {
        await service.delete(id);
        setSelectedItem((current) => (current && current.id === id ? null : current));
        await load();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška pri brisanju stavke");
      }
    },
    [service, load],
  );

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
    select,
    setSort,
    setSortOption,
    setPage,
    setPerPage,
    load,
    create,
    update,
    remove,
  };
};
