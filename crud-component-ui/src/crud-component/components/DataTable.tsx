import chevronRight from "../../assets/icons/chevron-right.svg";
import { renderFieldValue } from "../formatFieldValue";
import type { EntityConfig, SortOption } from "../types";
import { Icon } from "./Icon";

interface DataTableProps<T> {
  items: T[];
  config: EntityConfig<T>;
  selectedId?: string | number;
  sort?: SortOption<T> | null;
  onSortChange?: (field: keyof T) => void;
  onRowClick?: (item: T, event: React.MouseEvent<HTMLTableRowElement>) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export const DataTable = <T,>({
  items,
  config,
  selectedId,
  sort,
  onSortChange,
  onRowClick,
  onEdit,
  onDelete,
}: DataTableProps<T>) => {
  const columns = config.fields.filter((field) => field.showInTable);
  const hasActions = Boolean(onEdit || onDelete);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
        Nema podataka za prikaz.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((column) => {
              const isSorted = sort?.field === column.key;
              const canSort = Boolean(column.sortable && onSortChange);

              return (
                <th
                  key={String(column.key)}
                  onClick={() => canSort && onSortChange?.(column.key)}
                  className={`px-4 py-3 font-semibold text-gray-700 ${
                    canSort ? "cursor-pointer select-none hover:text-gray-900" : ""
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {column.label}
                    {isSorted && (
                      <Icon
                        src={chevronRight}
                        className={`size-3.5 ${sort?.direction === "asc" ? "-rotate-90" : "rotate-90"}`}
                      />
                    )}
                  </span>
                </th>
              );
            })}
            {hasActions && (
              <th className="px-4 py-3 font-semibold text-gray-700">Akcije</th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const id = item[config.idField] as unknown as string | number;
            const isSelected = id === selectedId;

            return (
              <tr
                key={String(id)}
                onClick={(e) => onRowClick?.(item, e)}
                aria-selected={isSelected}
                className={`border-b border-gray-100 last:border-0 ${
                  onRowClick ? "cursor-pointer" : ""
                } ${isSelected ? "bg-sky-50" : "hover:bg-gray-50"}`}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3 text-gray-800">
                    {renderFieldValue(item, column, "compact")}
                  </td>
                ))}

                {hasActions && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                          className="rounded-full border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Izmijeni
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item);
                          }}
                          className="rounded-full border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Obriši
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
