import { createRestCrudService } from "../../crud-component";
import { API_BASE_URL } from "../api";
import type { Supplier } from "./supplier.types";

export const supplierService = createRestCrudService<Supplier>(`${API_BASE_URL}/suppliers`);
