import type { EntityConfig } from "../../crud-component";
import { GroupArticles } from "./GroupArticles";
import type { ArticleGroup } from "./group.types";

export const groupConfig: EntityConfig<ArticleGroup> = {
  label: "Grupe artikala",
  idField: "id",
  listTitle: "name",
  listSubtitle: ["description"],
  fields: [
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
      key: "description",
      label: "Opis",
      type: "text",
      showInTable: true,
      editable: true,
      searchable: true,
    },
    {
      // Not stored on the group: the field is keyed by the group id and renders the group's articles
      // in the detail panel only.
      key: "id",
      label: "Artikli",
      type: "custom",
      render: (_value, group, mode) => (mode === "full" ? <GroupArticles groupId={group.id} /> : null),
    },
  ],
};
