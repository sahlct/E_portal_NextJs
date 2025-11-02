"use client";

export default function TableFilter({
  fields,
  onChange,
}: {
  fields: { key: string; label: string; options: { label: string; value: string }[] }[];
  onChange: (filters: Record<string, string>) => void;
}) {
  return (
    <div className="flex gap-3">
      {fields.map((f) => (
        <select
          key={f.key}
          onChange={(e) => onChange({ [f.key]: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">{f.label}</option>
          {f.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
