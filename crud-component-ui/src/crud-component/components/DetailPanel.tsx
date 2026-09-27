import { useState } from "react";
import { renderFieldValue } from "../formatFieldValue";
import type { EntityConfig } from "../types";
import { EntityForm } from "./EntityForm";

interface DetailPanelProps<T> {
  item: T;
  config: EntityConfig<T>;
  onUpdate?: (data: Partial<T>) => void;
  onDelete?: (item: T) => void;
}

export const DetailPanel = <T,>({ item, config, onUpdate, onDelete }: DetailPanelProps<T>) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="min-w-0 overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-gray-800">Izmjena</h3>
        <EntityForm
          config={config}
          initialValues={item}
          onSubmit={(data) => {
            onUpdate?.(data);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-gray-800">Detalji</h3>

      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {config.fields.map((field) => (
          <div key={String(field.key)} className={field.type === "custom" ? "sm:col-span-2" : undefined}>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {field.label}
            </dt>
            <dd className="mt-0.5 text-sm text-gray-800">
              {renderFieldValue(item, field, "full")}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
        {onUpdate && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            Izmijeni
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Obriši
          </button>
        )}
      </div>
    </div>
  );
};
