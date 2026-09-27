import { CrudComponent } from "../../crud-component";
import { supplierConfig } from "./supplier.config";
import { supplierService } from "./supplier.service";

export const SuppliersPage = () => {
  return <CrudComponent service={supplierService} config={supplierConfig} viewMode="table" />;
};
