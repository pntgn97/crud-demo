import type { EntityConfig } from "../../crud-component";
import type { ArticleGroup } from "../groups/group.types";
import { articleService } from "./article.service";
import type { ArticleWithStock } from "./article.types";
import { UNIT_OPTIONS } from "./article.utils";
import { StockLevel } from "./StockLevel";

export const createArticleConfig = (groups: ArticleGroup[]): EntityConfig<ArticleWithStock> => ({
  label: "Artikli",
  idField: "id",
  listTitle: "name",
  listSubtitle: ["catalogNumber", "groupId", "stock"],
  fields: [
    {
      key: "catalogNumber",
      label: "Kataloški broj",
      type: "text",
      showInTable: true,
      editable: true,
      required: true,
      sortable: true,
      searchable: true,
      // Client-side check only; a unique constraint on the server would be the reliable guarantee.
      validate: async (value, article) => {
        const { data } = await articleService.getAll({
          filter: { values: { catalogNumber: String(value).trim() } },
        });
        return data.some((existing) => existing.id !== article.id)
          ? "Artikl sa ovim kataloškim brojem već postoji."
          : undefined;
      },
    },
    {
      key: "name",
      label: "Naziv",
      type: "text",
      showInTable: true,
      editable: true,
      required: true,
      sortable: true,
      searchable: true,
    },
    {
      key: "manufacturer",
      label: "Proizvođač",
      type: "text",
      showInTable: true,
      editable: true,
      required: true,
      sortable: true,
      searchable: true,
    },
    {
      key: "groupId",
      label: "Grupa",
      type: "select",
      showInTable: true,
      editable: true,
      required: true,
      filterable: true,
      options: groups.map((group) => ({ value: group.id, label: group.name })),
    },
    {
      key: "unit",
      label: "Jedinica mjere",
      type: "select",
      showInTable: true,
      editable: true,
      required: true,
      options: UNIT_OPTIONS,
    },
    {
      key: "shelfLocation",
      label: "Lokacija na polici",
      type: "text",
      showInTable: true,
      editable: true,
      sortable: true,
    },
    {
      key: "stock",
      label: "Stanje",
      type: "number",
      showInTable: true,
      // Computed from receipts and issues (see articleWithStockService), so it is read-only.
      render: (_value, article, mode) => <StockLevel article={article} mode={mode} />,
    },
    {
      key: "minStock",
      label: "Minimalna zaliha",
      type: "number",
      showInTable: true,
      editable: true,
      required: true,
      sortable: true,
      validate: (value) =>
        typeof value === "number" && value < 0 ? "Minimalna zaliha ne može biti negativna." : undefined,
    },
  ],
});
