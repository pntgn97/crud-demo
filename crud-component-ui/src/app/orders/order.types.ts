export type OrderStatus = "u obradi" | "završena" | "otkazana";

export interface OrderItem {
  productId: string;
  quantity: number;
  // Price at the moment of ordering, so later product price changes don't rewrite history.
  unitPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
}
