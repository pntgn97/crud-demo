interface LookupStatusProps {
  error: string | null;
}

// Shown by pages while the data they need for select options is loading or failed to load.
export const LookupStatus = ({ error }: LookupStatusProps) =>
  error ? (
    <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
      {error}
    </p>
  ) : (
    <p className="text-sm text-gray-500">Učitavanje...</p>
  );
