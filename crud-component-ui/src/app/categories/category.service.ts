import { createRestCrudService } from "../../crud-component";
import { API_BASE_URL } from "../api";
import type { Category } from "./category.types";

export const categoryService = createRestCrudService<Category>(`${API_BASE_URL}/categories`);
