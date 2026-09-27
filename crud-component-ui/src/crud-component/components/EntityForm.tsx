import { useState } from "react";
import type { EntityConfig, FieldConfig } from "../types";

interface EntityFormProps<T> {
  config: EntityConfig<T>;
  initialValues?: Partial<T>;
  onSubmit: (data: Partial<T>) => void | Promise<void>;
  onCancel?: () => void;
  // Error reported by the save operation itself (e.g. a server error), shown above the buttons.
  submitError?: string | null;
}

type FormErrors<T> = Partial<Record<keyof T, string>>;

export const EntityForm = <T,>({
  config,
  initialValues,
  onSubmit,
  onCancel,
  submitError,
}: EntityFormProps<T>) => {
  const [values, setValues] = useState<Partial<T>>(initialValues ?? {});
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [submitting, setSubmitting] = useState(false);

  const editableFields = config.fields.filter((field) => field.editable);

  const handleChange = (field: FieldConfig<T>, rawValue: string | boolean) => {
    const parsedValue = field.type === "number" && typeof rawValue === "string"
      ? (rawValue === "" ? "" : Number(rawValue))
      : rawValue;

    setValues((prev) => ({ ...prev, [field.key]: parsedValue }));
  };

  const validateField = async (field: FieldConfig<T>): Promise<string | undefined> => {
    const value = values[field.key];

    if (field.required && (value === undefined || value === null || value === "")) {
      return `${field.label} je obavezno polje.`;
    }

    try {
      return await field.validate?.(value, values);
    } catch {
      return "Provjera vrijednosti nije uspjela. Pokušajte ponovo.";
    }
  };

  // Validators may be asynchronous (e.g. checks against the server), so all of them run in parallel.
  const validateAll = async (): Promise<boolean> => {
    const results = await Promise.all(editableFields.map(validateField));

    const nextErrors: FormErrors<T> = {};
    editableFields.forEach((field, index) => {
      const error = results[index];
      if (error) {
        nextErrors[field.key] = error;
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      if (await validateAll()) {
        await onSubmit(values);
      }
    } finally {
      setSubmitting(false);
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

      {submitError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {submitError}
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Čuvanje..." : "Sačuvaj"}
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
