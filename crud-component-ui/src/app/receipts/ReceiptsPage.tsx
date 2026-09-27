import { useMemo } from "react";
import { CrudComponent } from "../../crud-component";
import { articleService } from "../articles/article.service";
import { LookupStatus } from "../LookupStatus";
import { supplierService } from "../suppliers/supplier.service";
import { useAllItems } from "../useAllItems";
import { createReceiptConfig } from "./receipt.config";
import { receiptService } from "./receipt.service";

export const ReceiptsPage = () => {
  const articles = useAllItems(articleService, "catalogNumber");
  const suppliers = useAllItems(supplierService, "name");
  const receiptConfig = useMemo(
    () => (articles.items && suppliers.items ? createReceiptConfig(articles.items, suppliers.items) : null),
    [articles.items, suppliers.items],
  );

  if (!receiptConfig) {
    return <LookupStatus error={articles.error ?? suppliers.error} />;
  }

  return <CrudComponent service={receiptService} config={receiptConfig} viewMode="master-detail" />;
};
