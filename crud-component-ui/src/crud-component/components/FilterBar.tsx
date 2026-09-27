import { useEffect, useState, type SetStateAction } from "react";
import type { EntityConfig, FieldConfig, FilterOptions, FilterValue } from "../types";

interface FilterBarProps<T> {
  config: EntityConfig<T>;
  filter: FilterOptions<T>;
  onFilterChange: (filter: SetStateAction<FilterOptions<T>>) => void;
  searchDelay?: number;
}

interface FilterChoice {
  value: FilterValue;
  label: string;
}

const BOOLEAN_CHOICES: FilterChoice[] = [
  { value: true, label: "Da" },
  { value: false, label: "Ne" },
];

const getFilterOptions = <T,>(field: FieldConfig<T>): FilterChoice[] =>
  field.type === "boolean" ? BOOLEAN_CHOICES : (field.options ?? []);

export const FilterBar = <T,>({ config, filter, onFilterChange, searchDelay = 300 }: FilterBarProps<T>) => {
  const hasSearch = config.fields.some((field) => field.searchable);
  const filterFields = config.fields.filter(
    (field) => field.filterable && (field.type === "select" || field.type === "boolean"),
  );

  const appliedText = filter.search?.text ?? "";
  const [searchText, setSearchText] = useState(appliedText);

  // Apply the search text only after the user stops typing, to avoid a request per keystroke.
  useEffect(() => {
    if (searchText === appliedText) {
      return;
    }
    const timer = setTimeout(() => {
      const fields = config.fields.filter((field) => field.searchable).map((field) => field.key);
      onFilterChange((prev) => ({ ...prev, search: { text: searchText, fields } }));
    }, searchDelay);
    return () => clearTimeout(timer);
  }, [searchText, appliedText, config, onFilterChange, searchDelay]);

  const handleValueChange = (field: FieldConfig<T>, rawValue: string) => {
    // Select elements always yield strings, so map back to the option's original value (e.g. number, boolean).
    const option = getFilterOptions(field).find((o) => String(o.value) === rawValue);
    const value: FilterValue | undefined = option?.value;
    onFilterChange((prev) => ({ ...prev, values: { ...prev.values, [field.key]: value } }));
  };

  const isActive =
    appliedText.trim() !== "" || Object.values(filter.values ?? {}).some((value) => value !== undefined);

  const handleReset = () => {
    setSearchText("");
    onFilterChange({});
  };

  const controlClasses =
    "rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {hasSearch && (
        <input
          type="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Pretraga..."
          aria-label="Pretraga"
          className={`${controlClasses} w-full sm:w-64`}
        />
      )}

      {filterFields.map((field) => {
        const current = filter.values?.[field.key];

        return (
          <label key={String(field.key)} className="flex items-center gap-2 text-sm text-gray-600">
            {field.label}
            <select
              value={current === undefined ? "" : String(current)}
              onChange={(e) => handleValueChange(field, e.target.value)}
              className={controlClasses}
            >
              <option value="">Sve</option>
              {getFilterOptions(field).map((option) => (
                <option key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        );
      })}

      {isActive && (
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Poništi filtere
        </button>
      )}
    </div>
  );
};
