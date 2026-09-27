import { useState } from "react";
import type { EntityConfig, FieldConfig } from "../types";

interface EntityFormProps<T> {
  config: EntityConfig<T>;
  initialValues?: Partial<T>;
  onSubmit: (data: Partial<T>) => void;
  onCancel?: () => void;
}

type FormErrors<T> = Partial<Record<keyof T, string>>;

export const EntityForm = <T,>({ config, initialValues, onSubmit, onCancel }: EntityFormProps<T>) => {
  const [values, setValues] = useState<Partial<T>>(initialValues ?? {});
  const [errors, setErrors] = useState<FormErrors<T>>({});

  const editableFields = config.fields.filter((field) => field.editable);

  const handleChange = (field: FieldConfig<T>, rawValue: string | boolean) => {
    const parsedValue = field.type === "number" && typeof rawValue === "string"
      ? (rawValue === "" ? "" : Number(rawValue))
      : rawValue;

    setValues((prev) => ({ ...prev, [field.key]: parsedValue }));
  };

  const validateAll = (): boolean => {
    const nextErrors: FormErrors<T> = {};

    for (const field of editableFields) {
      const value = values[field.key];

      if (field.required && (value === undefined || value === null || value === "")) {
        nextErrors[field.key] = `${field.label} je obavezno polje.`;
        continue;
      }

      const customError = field.validate?.(value, values);
      if (customError) {
        nextErrors[field.key] = customError;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      onSubmit(values);
    }
  };

  const fieldClasses =
    "w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500";
  const inputClasses = `${fieldClasses} rounded-md`;
  const selectClasses = `${fieldClasses} rounded-full`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {editableFields.map((field) => {
        const fieldName = String(field.key);
        const error = errors[field.key];

        return (
          <div key={fieldName} className="flex flex-col gap-1">
            <label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>

            {field.renderInput ? (
              field.renderInput({
                value: values[field.key],
                values,
                onChange: (value) => setValues((prev) => ({ ...prev, [field.key]: value })),
                error,
              })
            ) : field.type === "boolean" ? (
              <input
                id={fieldName}
                type="checkbox"
                checked={Boolean(values[field.key])}
                onChange={(e) => handleChange(field, e.target.checked)}
                className="h-4 w-4 self-start rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
            ) : field.type === "select" ? (
              <select
                id={fieldName}
                value={(values[field.key] as string | number | undefined) ?? ""}
                onChange={(e) => handleChange(field, e.target.value)}
                className={selectClasses}
              >
                <option value="" disabled>
                  Izaberite...
                </option>
                {field.options?.map((option) => (
                  <option key={String(option.value)} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={fieldName}
                type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                value={(values[field.key] as string | number | undefined) ?? ""}
                onChange={(e) => handleChange(field, e.target.value)}
                className={inputClasses}
              />
            )}

            {error && (
              <span role="alert" className="text-xs text-red-600">
                {error}
              </span>
            )}
          </div>
        );
      })}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          Sačuvaj
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Otkaži
          </button>
        )}
      </div>
    </form>
  );
};
