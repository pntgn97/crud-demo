import type { StockDocument } from "../documents/document.types";

export interface Receipt extends StockDocument {
  supplierId: string;
}
