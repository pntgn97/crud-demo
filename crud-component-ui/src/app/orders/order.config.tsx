import type { EntityConfig } from "../../crud-component";
import type { Product } from "../products/product.types";
import { OrderItemsEditor, OrderItemsSummary, OrderItemsView } from "./OrderItems";
import { validateOrderItems } from "./orderItems.utils";
import type { Order, OrderItem } from "./order.types";

export const createOrderConfig = (products: Product[]): EntityConfig<Order> => ({
  label: "Narudžba",
  idField: "id",
  listTitle: "customerName",
  listSubtitle: ["date", "status", "items"],
  fields: [
    {
      key: "customerName",
      label: "Ime kupca",
      type: "text",
      showInTable: true,
      editable: true,
      required: true,
      sortable: true,
    },
    {
      key: "date",
      label: "Datum",
      type: "date",
      showInTable: true,
      editable: true,
      required: true,
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      showInTable: true,
      editable: true,
      required: true,
      options: [
        { value: "u obradi", label: "U obradi" },
        { value: "završena", label: "Završena" },
        { value: "otkazana", label: "Otkazana" },
      ],
    },
    {
      key: "items",
      label: "Stavke",
      type: "custom",
      showInTable: true,
      editable: true,
      validate: validateOrderItems,
      render: (value, _order, mode) =>
        mode === "full" ? (
          <OrderItemsView items={value as OrderItem[]} products={products} />
        ) : (
          <OrderItemsSummary items={value as OrderItem[]} />
        ),
      renderInput: ({ value, onChange }) => (
        <OrderItemsEditor value={value as OrderItem[] | undefined} onChange={onChange} products={products} />
      ),
    },
  ],
});
