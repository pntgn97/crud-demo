import { createRestCrudService } from "../../crud-component";
import { API_BASE_URL } from "../api";
import type { Receipt } from "./receipt.types";

export const receiptService = createRestCrudService<Receipt>(`${API_BASE_URL}/receipts`);
