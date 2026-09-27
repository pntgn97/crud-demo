import { useEffect, useState } from "react";
import type { CrudService } from "../crud-component";

interface AllItemsState<T> {
  items: T[] | null;
  error: string | null;
}

// Loads every record of a resource (no pagination), e.g. for select options in another entity's form.
export const useAllItems = <T,>(service: CrudService<T>, sortField?: keyof T): AllItemsState<T> => {
  const [state, setState] = useState<AllItemsState<T>>({ items: null, error: null });

  useEffect(() => {
    let active = true;
    service
      .getAll(sortField ? { sort: { field: sortField, direction: "asc" } } : undefined)
      .then((result) => {
        if (active) {
          setState({ items: result.data, error: null });
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setState({ items: null, error: err instanceof Error ? err.message : "Greška pri učitavanju podataka" });
        }
      });
    return () => {
      active = false;
    };
  }, [service, sortField]);

  return state;
};
