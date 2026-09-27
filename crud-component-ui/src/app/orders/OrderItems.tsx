import type { Product } from "../products/product.types";
import type { OrderItem } from "./order.types";
import { formatAmount, formatItemCount, getOrderTotal, getProductName } from "./orderItems.utils";

export const OrderItemsSummary = ({ items = [] }: { items?: OrderItem[] }) => (
  <>
    {formatItemCount(items.length)} · {formatAmount(getOrderTotal(items))}
  </>
);

interface OrderItemsViewProps {
  items?: OrderItem[];
  products: Product[];
}

export const OrderItemsView = ({ items = [], products }: OrderItemsViewProps) => {
  if (items.length === 0) {
    return <span>-</span>;
  }

  return (
    <div className="mt-1 overflow-x-auto rounded-md border border-gray-200">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500">
            <th className="px-3 py-2 font-medium">Proizvod</th>
            <th className="px-3 py-2 text-right font-medium">Kol.</th>
            <th className="px-3 py-2 text-right font-medium">Cijena</th>
            <th className="px-3 py-2 text-right font-medium">Iznos</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-100 last:border-0">
              <td className="px-3 py-2">{getProductName(products, item.productId)}</td>
              <td className="px-3 py-2 text-right">{item.quantity}</td>
              <td className="px-3 py-2 text-right">{formatAmount(item.unitPrice)}</td>
              <td className="px-3 py-2 text-right">{formatAmount(item.quantity * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200 bg-gray-50 font-semibold">
            <td colSpan={3} className="px-3 py-2 text-right">
              Ukupno
            </td>
            <td className="px-3 py-2 text-right">{formatAmount(getOrderTotal(items))}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

interface OrderItemsEditorProps {
  value?: OrderItem[];
  onChange: (items: OrderItem[]) => void;
  products: Product[];
}

export const OrderItemsEditor = ({ value = [], onChange, products }: OrderItemsEditorProps) => {
  const updateItem = (index: number, changes: Partial<OrderItem>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...changes } : item)));
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    updateItem(index, { productId, unitPrice: product?.price ?? 0 });
  };

  const addItem = () => {
    onChange([...value, { productId: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="grid grid-cols-[1fr_4.5rem_6rem_2rem] gap-2 text-xs font-medium text-gray-500">
          <span>Proizvod</span>
          <span>Kol.</span>
          <span className="text-right">Iznos</span>
          <span />
        </div>
      )}

      {value.map((item, index) => (
        <div key={index} className="grid grid-cols-[1fr_4.5rem_6rem_2rem] items-center gap-2">
          <select
            value={item.productId}
            onChange={(e) => handleProductChange(index, e.target.value)}
            aria-label={`Proizvod, stavka ${index + 1}`}
            className="min-w-0 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="" disabled>
              Izaberite...
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => updateItem(index, { quantity: e.target.value === "" ? 0 : Number(e.target.value) })}
            aria-label={`Količina, stavka ${index + 1}`}
            className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-gray-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <span className="text-right text-sm text-gray-800">
            {formatAmount(item.quantity * item.unitPrice)}
          </span>
          <button
            type="button"
            onClick={() => removeItem(index)}
            aria-label={`Ukloni stavku ${index + 1}`}
            className="flex size-8 items-center justify-center rounded-full text-lg leading-none text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            ×
          </button>
        </div>
      ))}

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={addItem}
          className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
        >
          + Dodaj stavku
        </button>
        {value.length > 0 && (
          <span className="text-sm font-semibold text-gray-800">
            Ukupno: {formatAmount(getOrderTotal(value))}
          </span>
        )}
      </div>
    </div>
  );
};
