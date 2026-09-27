import axios from "axios";
import type { CrudService, GetAllOptions, GetAllResult } from "./types";

interface JsonServerPaginatedResponse<T> {
  data: T[];
  items: number;
  pages: number;
}

const isPaginatedResponse = <T,>(
  payload: T[] | JsonServerPaginatedResponse<T>,
): payload is JsonServerPaginatedResponse<T> => !Array.isArray(payload);

export const createRestCrudService = <T,>(baseUrl: string): CrudService<T> => {
  const client = axios.create({ baseURL: baseUrl });

  return {
    getAll: async (options?: GetAllOptions<T>): Promise<GetAllResult<T>> => {
      const { sort, pagination } = options ?? {};

      const params: Record<string, string | number> = {};
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
