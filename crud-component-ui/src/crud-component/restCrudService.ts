import axios from "axios";
import type { CrudService, FilterOptions, GetAllOptions, GetAllResult } from "./types";

interface JsonServerPaginatedResponse<T> {
  data: T[];
  items: number;
  pages: number;
}

const isPaginatedResponse = <T,>(
  payload: T[] | JsonServerPaginatedResponse<T>,
): payload is JsonServerPaginatedResponse<T> => !Array.isArray(payload);

// Builds a json-server `_where` query. Everything goes through `_where` (with explicit operators)
// because plain `field=value` params coerce numeric strings to numbers, which breaks string ids.
const buildWhere = <T,>(filter: FilterOptions<T> | undefined): Record<string, unknown> | null => {
  const where: Record<string, unknown> = {};

  const text = filter?.search?.text.trim();
  if (text && filter?.search?.fields.length) {
    where.or = filter.search.fields.map((field) => ({ [String(field)]: { contains: text } }));
  }

  for (const [field, value] of Object.entries(filter?.values ?? {})) {
    if (value !== undefined) {
      where[field] = { eq: value };
    }
  }

  return Object.keys(where).length > 0 ? where : null;
};

export const createRestCrudService = <T,>(baseUrl: string): CrudService<T> => {
  const client = axios.create({ baseURL: baseUrl });

  return {
    getAll: async (options?: GetAllOptions<T>): Promise<GetAllResult<T>> => {
      const { sort, pagination, filter } = options ?? {};

      const params: Record<string, string | number> = {};
      const where = buildWhere(filter);
      if (where) {
        params._where = JSON.stringify(where);
      }
      if (sort) {
        params._sort = sort.direction === "desc" ? `-${String(sort.field)}` : String(sort.field);
      }
      if (pagination) {
        params._page = pagination.page;
        params._per_page = pagination.perPage;
      }

      const { data: payload } = await client.get<T[] | JsonServerPaginatedResponse<T>>("", { params });

      if (isPaginatedResponse(payload)) {
        return { data: payload.data, totalItems: payload.items, totalPages: payload.pages };
      }

      return { data: payload, totalItems: payload.length, totalPages: 1 };
    },

    getById: async (id) => {
      const { data } = await client.get<T>(`/${id}`);
      return data;
    },

    create: async (data) => {
      const response = await client.post<T>("", data);
      return response.data;
    },

    update: async (id, data) => {
      const response = await client.patch<T>(`/${id}`, data);
      return response.data;
    },

    delete: async (id) => {
      await client.delete(`/${id}`);
    },
  };
};
