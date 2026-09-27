import { CrudComponent } from "../../crud-component";
import { categoryConfig } from "./category.config";
import { categoryService } from "./category.service";

export const CategoriesPage = () => {
  return <CrudComponent service={categoryService} config={categoryConfig} viewMode="table" />;
};
