import { useMemo } from "react";
import { CrudComponent } from "../../crud-component";
import { groupService } from "../groups/group.service";
import { LookupStatus } from "../LookupStatus";
import { useAllItems } from "../useAllItems";
import { createArticleConfig } from "./article.config";
import { articleWithStockService } from "./articleWithStock.service";

export const ArticlesPage = () => {
  const { items: groups, error } = useAllItems(groupService, "name");
  const articleConfig = useMemo(() => (groups ? createArticleConfig(groups) : null), [groups]);

  if (!articleConfig) {
    return <LookupStatus error={error} />;
  }

  return <CrudComponent service={articleWithStockService} config={articleConfig} viewMode="master-detail" />;
};
