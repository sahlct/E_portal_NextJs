"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}

export default function DynamicFormModal({
  title,
  isOpen,
  onClose,
  fields,
  defaultValues,
  onSubmit,
  onSuccess,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  fields: Field[];
  defaultValues?: any;
  onSubmit: (formData: FormData) => Promise<void>;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
      toast.success(`${title} successful`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  name={f.name}
                  required={f.required}
                  defaultValue={defaultValues?.[f.name] || ""}
                  className="w-full border rounded-md p-2"
                />
              ) : f.type === "select" ? (
                <select
                  name={f.name}
                  required={f.required}
                  defaultValue={defaultValues?.[f.name] || ""}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select {f.label}</option>
                  {f.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type}
                  name={f.name}
                  required={f.required}
                  defaultValue={f.type === "file" ? undefined : defaultValues?.[f.name]}
                  className="w-full border rounded-md p-2"
                  accept={f.type === "file" ? "image/*" : undefined}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
