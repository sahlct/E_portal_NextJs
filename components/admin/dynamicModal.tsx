"use client";

import { IconX } from "@tabler/icons-react";
import { useState, useEffect } from "react";
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
  const server_url = process.env.NEXT_PUBLIC_SERVER_URL || "";

  console.log("fields", fields);
  console.log("defaultValues", defaultValues);

  // Store selected files and previews
  const [filePreviews, setFilePreviews] = useState<
    Record<string, { url: string; file: File | null; isImage: boolean } | null>
  >({});

  // Load default existing image/file on edit
  useEffect(() => {
    if (!defaultValues) {
      setFilePreviews({});
      return;
    }

    const previews: any = {};
    fields.forEach((f) => {
      if (f.type === "file" && defaultValues[f.name]) {
        const value = defaultValues[f.name];

        //  Skip if array (like other_images)
        if (Array.isArray(value)) {
          previews[f.name] = null;
          return;
        }

        //  Skip if not string
        if (typeof value !== "string") {
          previews[f.name] = null;
          return;
        }

        const lower = value.toLowerCase();
        const isImage =
          lower.endsWith(".png") ||
          lower.endsWith(".jpg") ||
          lower.endsWith(".jpeg") ||
          lower.endsWith(".webp");

        previews[f.name] = {
          url: value,
          file: null,
          isImage,
        };
      }
    });

    setFilePreviews(previews);
  }, [defaultValues, fields]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const url = URL.createObjectURL(file);

    setFilePreviews((prev) => ({
      ...prev,
      [field]: { url, file, isImage },
    }));
  };

  const removeFile = (field: string) => {
    setFilePreviews((prev) => ({
      ...prev,
      [field]: null,
    }));

    // clear file input value
    const input = document.querySelector(
      `input[name="${field}"]`
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // inject actual selected files
      Object.entries(filePreviews).forEach(([key, item]) => {
        if (item?.file) {
          formData.set(key, item.file);
        }
      });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-2 sm:p-4 sm:pb-0">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-xl cursor-pointer hover:scale-125 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.name} className="space-y-1">
                <label className="block text-sm font-medium">{f.label}</label>

                {/* textarea */}
                {f.type === "textarea" && (
                  <textarea
                    name={f.name}
                    required={f.required}
                    defaultValue={defaultValues?.[f.name] || ""}
                    className="w-full border rounded-md p-2"
                  />
                )}

                {/* select */}
                {f.type === "select" && (
                  <select
                    name={f.name}
                    required={f.required}
                    defaultValue={
                      defaultValues
                        ? defaultValues[f.name] // Edit: show existing status
                        : f.options?.[0]?.value // Create: default = first option (Active)
                    }
                    className="w-full border rounded-md p-2"
                  >
                    {defaultValues
                      ? // Edit mode: no placeholder
                        f.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))
                      : // Create mode: preselect Active, no "Select Status"
                        f.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                  </select>
                )}

                {/* file input */}
                {f.type === "file" && (
                  <>
                    <input
                      type="file"
                      name={f.name}
                      accept="*"
                      required={f.required && !filePreviews[f.name]}
                      onChange={(e) => handleFileChange(e, f.name)}
                      className="w-full border rounded-md p-2"
                    />

                    {/* PREVIEW (IMAGE OR FILE NAME) */}
                    {filePreviews[f.name] && (
                      <div className="mt-2 flex items-center gap-3 border p-2 rounded-md bg-gray-50 relative w-fit">
                        {/* remove button */}
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full p-1 cursor-pointer"
                          onClick={() => removeFile(f.name)}
                        >
                          <IconX size={16} />
                        </button>

                        {filePreviews[f.name]?.isImage ? (
                          <img
                            src={server_url + filePreviews[f.name]?.url}
                            className="w-24 h-24 object-cover rounded"
                            alt="preview"
                          />
                        ) : (
                          <span className="text-gray-700 text-sm">
                            {server_url + filePreviews[f.name]?.file
                              ? filePreviews[f.name]?.file?.name
                              : "Existing File"}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* normal input */}
                {f.type !== "textarea" &&
                  f.type !== "select" &&
                  f.type !== "file" && (
                    <input
                      type={f.type}
                      name={f.name}
                      required={f.required}
                      defaultValue={
                        f.type === "date" && defaultValues?.[f.name]
                          ? new Date(defaultValues[f.name])
                              .toISOString()
                              .split("T")[0]
                          : defaultValues?.[f.name] || ""
                      }
                      className="w-full border rounded-md p-2"
                    />
                  )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 py-4 border-t mt-6 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-cyan-700 text-white rounded cursor-pointer hover:bg-cyan-800"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
