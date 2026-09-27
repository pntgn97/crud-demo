import { useMemo } from "react";
import { CrudComponent } from "../../crud-component";
import { articleService } from "../articles/article.service";
import { LookupStatus } from "../LookupStatus";
import { useAllItems } from "../useAllItems";
import { createIssueConfig } from "./issue.config";
import { issueService } from "./issue.service";

export const IssuesPage = () => {
  const { items: articles, error } = useAllItems(articleService, "catalogNumber");
  const issueConfig = useMemo(() => (articles ? createIssueConfig(articles) : null), [articles]);

  if (!issueConfig) {
    return <LookupStatus error={error} />;
  }

  return <CrudComponent service={issueService} config={issueConfig} viewMode="master-detail" />;
};
