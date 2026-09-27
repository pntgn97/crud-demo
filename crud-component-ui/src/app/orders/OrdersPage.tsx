import { useEffect, useState } from "react";
import { CrudComponent } from "../../crud-component";
import { productService } from "../products/product.service";
import type { Product } from "../products/product.types";
import { createOrderConfig } from "./order.config";
import { orderService } from "./order.service";

export const OrdersPage = () => {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    productService.getAll().then((result) => setProducts(result.data));
  }, []);

  if (!products) {
    return <p>Učitavanje proizvoda...</p>;
  }

  const orderConfig = createOrderConfig(products);

  return <CrudComponent service={orderService} config={orderConfig} viewMode="master-detail" />;
};
