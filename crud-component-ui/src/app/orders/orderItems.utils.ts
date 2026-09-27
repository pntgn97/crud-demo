import type { Product } from "../products/product.types";
import type { OrderItem } from "./order.types";

export const getOrderTotal = (items: OrderItem[] = []) =>
  items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

export const formatAmount = (amount: number) =>
  amount.toLocaleString("sr-Latn-RS", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatItemCount = (count: number) => {
  const lastTwo = count % 100;
  const last = count % 10;
  if (last === 1 && lastTwo !== 11) return `${count} stavka`;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${count} stavke`;
  return `${count} stavki`;
};

export const getProductName = (products: Product[], productId: string) =>
  products.find((product) => product.id === productId)?.name ?? "Nepoznat proizvod";

export const validateOrderItems = (value: unknown): string | undefined => {
  const items = (value as OrderItem[] | undefined) ?? [];
  if (items.length === 0) {
    return "Narudžba mora imati bar jednu stavku.";
  }
  if (items.some((item) => !item.productId)) {
    return "Izaberite proizvod za svaku stavku.";
  }
  if (items.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1)) {
    return "Količina mora biti cijeli broj veći od 0.";
  }
  return undefined;
};

