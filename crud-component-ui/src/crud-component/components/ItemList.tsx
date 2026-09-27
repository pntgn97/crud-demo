import { Fragment } from "react";
import chevronRight from "../../assets/icons/chevron-right.svg";
import { getEntityId } from "../entityId";
import { renderFieldValue } from "../formatFieldValue";
import type { EntityConfig, EntityId, SortOption } from "../types";
import { Icon } from "./Icon";

interface ItemListProps<T> {
  items: T[];
  config: EntityConfig<T>;
  selectedId?: EntityId;
  sort?: SortOption<T> | null;
  onSortChange?: (sort: SortOption<T> | null) => void;
  onItemClick?: (item: T, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ItemList = <T,>({
  items,
  config,
  selectedId,
  sort,
  onSortChange,
  onItemClick,
}: ItemListProps<T>) => {
  const titleField =
    config.fields.find((field) => field.key === config.listTitle) ??
    config.fields.find((field) => field.showInTable) ??
    config.fields[0];
  const subtitleFields = (config.listSubtitle ?? [])
    .map((key) => config.fields.find((field) => field.key === key))
    .filter((field) => field !== undefined);
  const sortableFields = config.fields.filter((field) => field.sortable);

  const handleSortFieldChange = (key: string) => {
    const field = sortableFields.find((f) => String(f.key) === key);
    onSortChange?.(field ? { field: field.key, direction: sort?.direction ?? "asc" } : null);
  };

  const toggleSortDirection = () => {
    if (sort) {
      onSortChange?.({ ...sort, direction: sort.direction === "asc" ? "desc" : "asc" });
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {onSortChange && sortableFields.length > 0 && (
        <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            Sortiraj po
            <select
              value={sort ? String(sort.field) : ""}
              onChange={(e) => handleSortFieldChange(e.target.value)}
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Bez sortiranja</option>
              {sortableFields.map((field) => (
                <option key={String(field.key)} value={String(field.key)}>
                  {field.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={toggleSortDirection}
            disabled={!sort}
            aria-label={sort?.direction === "desc" ? "Sortirano opadajuće" : "Sortirano rastuće"}
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            <Icon
              src={chevronRight}
              className={`size-4 ${sort?.direction === "desc" ? "rotate-90" : "-rotate-90"}`}
            />
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="p-8 text-center text-sm text-gray-500">Nema podataka za prikaz.</p>
      ) : (
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {items.map((item) => {
            const id = getEntityId(item, config.idField);
            const isSelected = id === selectedId;

            return (
              <li key={String(id)} className="border-b border-gray-100 last:border-0">
                <button
                  type="button"
                  onClick={(e) => onItemClick?.(item, e)}
                  aria-current={isSelected}
                  className={`flex w-full flex-col gap-0.5 border-l-4 px-4 py-3 text-left ${
                    isSelected ? "border-sky-500 bg-sky-50" : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate text-sm font-medium text-gray-800">
                    {renderFieldValue(item, titleField, "compact")}
                  </span>
                  {subtitleFields.length > 0 && (
                    <span className="truncate text-xs text-gray-500">
                      {subtitleFields.map((field, index) => (
                        <Fragment key={String(field.key)}>
                          {index > 0 && " · "}
                          {renderFieldValue(item, field, "compact")}
                        </Fragment>
                      ))}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
