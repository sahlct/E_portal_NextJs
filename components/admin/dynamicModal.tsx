"use client";

import { IconX } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  multiple?: boolean;
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

  // Store selected files and previews
  const [filePreviews, setFilePreviews] = useState<
    Record<string, { url: string; file: File | null; isImage: boolean }[] | null>
  >({});

  // Load default existing images/files on edit
  useEffect(() => {
    if (!defaultValues) {
      setFilePreviews({});
      return;
    }

    const previews: any = {};
    fields.forEach((f) => {
      if (f.type === "file" && defaultValues[f.name]) {
        const value = defaultValues[f.name];

        // Handle multiple files (array)
        if (Array.isArray(value)) {
          previews[f.name] = value.map((path: string) => {
            const lower = path.toLowerCase();
            const isImage =
              lower.endsWith(".png") ||
              lower.endsWith(".jpg") ||
              lower.endsWith(".jpeg") ||
              lower.endsWith(".webp");

            return {
              url: path,
              file: null,
              isImage,
            };
          });
          return;
        }

        // Handle single file (string)
        if (typeof value === "string") {
          const lower = value.toLowerCase();
          const isImage =
            lower.endsWith(".png") ||
            lower.endsWith(".jpg") ||
            lower.endsWith(".jpeg") ||
            lower.endsWith(".webp");

          previews[f.name] = [
            {
              url: value,
              file: null,
              isImage,
            },
          ];
        }
      }
    });

    setFilePreviews(previews);
  }, [defaultValues, fields]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    multiple: boolean
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple) {
      // Handle multiple files
      const newPreviews = Array.from(files).map((file) => {
        const isImage = file.type.startsWith("image/");
        const url = URL.createObjectURL(file);
        return { url, file, isImage };
      });

      setFilePreviews((prev) => ({
        ...prev,
        [field]: newPreviews,
      }));
    } else {
      // Handle single file
      const file = files[0];
      const isImage = file.type.startsWith("image/");
      const url = URL.createObjectURL(file);

      setFilePreviews((prev) => ({
        ...prev,
        [field]: [{ url, file, isImage }],
      }));
    }
  };

  const removeFile = (field: string, index: number) => {
    setFilePreviews((prev) => {
      const current = prev[field];
      if (!current) return prev;

      const updated = current.filter((_, i) => i !== index);

      return {
        ...prev,
        [field]: updated.length > 0 ? updated : null,
      };
    });

    // Clear file input if no files left
    const currentPreviews = filePreviews[field];
    if (currentPreviews && currentPreviews.length === 1) {
      const input = document.querySelector(
        `input[name="${field}"]`
      ) as HTMLInputElement;
      if (input) input.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Inject actual selected files
      Object.entries(filePreviews).forEach(([key, items]) => {
        if (items && items.length > 0) {
          // Remove the default form data for this field
          formData.delete(key);

          // Add only the new files
          const newFiles = items.filter((item) => item.file !== null);
          if (newFiles.length > 0) {
            newFiles.forEach((item) => {
              if (item.file) {
                formData.append(key, item.file);
              }
            });
          }
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
                        ? defaultValues[f.name]
                        : f.options?.[0]?.value
                    }
                    className="w-full border rounded-md p-2"
                  >
                    {f.options?.map((opt) => (
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
                      multiple={f.multiple}
                      required={f.required && !filePreviews[f.name]}
                      onChange={(e) => handleFileChange(e, f.name, !!f.multiple)}
                      className="w-full border rounded-md p-2"
                    />

                    {/* PREVIEW (IMAGE OR FILE NAME) */}
                    {filePreviews[f.name] && filePreviews[f.name]!.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-3">
                        {filePreviews[f.name]!.map((preview, idx) => (
                          <div
                            key={idx}
                            className="border p-2 rounded-md bg-gray-50 relative w-fit"
                          >
                            {/* remove button */}
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full p-1 cursor-pointer hover:bg-red-500 z-10"
                              onClick={() => removeFile(f.name, idx)}
                            >
                              <IconX size={16} />
                            </button>

                            {preview.isImage ? (
                              <img
                                src={
                                  preview.file
                                    ? preview.url // new file (blob)
                                    : server_url + preview.url // old file (server)
                                }
                                className="w-24 h-24 object-cover rounded"
                                alt={`preview ${idx + 1}`}
                              />
                            ) : (
                              <div className="w-24 h-24 flex items-center justify-center">
                                <span className="text-gray-700 text-xs text-center px-2">
                                  {preview.file
                                    ? preview.file.name
                                    : "Existing File"}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
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