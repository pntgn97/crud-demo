import { createRestCrudService } from "../../crud-component";
import { API_BASE_URL } from "../api";
import type { Product } from "./product.types";

export const productService = createRestCrudService<Product>(`${API_BASE_URL}/products`);
