import { useEffect, useState } from "react";
import { CrudComponent } from "../../crud-component";
import { categoryService } from "../categories/category.service";
import type { Category } from "../categories/category.types";
import { createProductConfig } from "./product.config";
import { productService } from "./product.service";

export const ProductsPage = () => {
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    categoryService.getAll().then((result) => setCategories(result.data));
  }, []);

  if (!categories) {
    return <p>Učitavanje kategorija...</p>;
  }

  const productConfig = createProductConfig(categories);

  return <CrudComponent service={productService} config={productConfig} viewMode="master-detail" />;
};
