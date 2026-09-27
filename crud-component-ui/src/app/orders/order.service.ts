import { createRestCrudService } from "../../crud-component";
import { API_BASE_URL } from "../api";
import type { Order } from "./order.types";

export const orderService = createRestCrudService<Order>(`${API_BASE_URL}/orders`);
