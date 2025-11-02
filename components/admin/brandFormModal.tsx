"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IconTrash } from "@tabler/icons-react";

interface BrandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string | null, formData: FormData) => Promise<void>;
  onSuccess: () => void;
  title: string;
  defaultValues?: any; // for edit mode
}

export default function BrandFormModal({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
  title,
  defaultValues,
}: BrandFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState(defaultValues?.status?.toString() || "1");
  const [existingImage, setExistingImage] = useState<string | null>(null);

  // Setup edit mode
  useEffect(() => {
    if (defaultValues) {
      setStatus(defaultValues.status?.toString() || "1");
      setExistingImage(defaultValues.brand_logo || null);
      setFiles([]);
    } else {
      setExistingImage(null);
      setFiles([]);
      setStatus("1");
    }
  }, [defaultValues, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (defaultValues) {
      // Edit mode: allow only one image replace
      setFiles(selected.slice(0, 1));
      setExistingImage(null);
    } else {
      // Create mode: allow multiple image uploads
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExisting = () => {
    setExistingImage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isEdit = !!defaultValues;
    const formData = new FormData();

    if (!isEdit && files.length === 0) {
      toast.error("Please select at least one logo");
      return;
    }

    if (isEdit) {
      if (files.length > 0) {
        files.forEach((f) => formData.append("brand_logo", f));
      } else if (existingImage) {
        formData.append("existing_logo", existingImage);
      }
    } else {
      files.forEach((f) => formData.append("brand_logo", f));
    }

    formData.append("status", status);

    try {
      setLoading(true);
      await onSubmit(isEdit ? defaultValues._id : null, formData);
      toast.success(`${title} successful`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* File upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {defaultValues ? "Brand Logo" : "Brand Logos (Multiple)"}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple={!defaultValues}
              onChange={handleFileChange}
              className="w-full border rounded-md p-2"
            />

            {/* Existing image preview (for edit) */}
            {existingImage && (
              <div className="mt-3 border rounded-md p-3 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={existingImage}
                    alt="Current logo"
                    className="w-16 h-16 object-contain rounded border bg-white"
                  />
                  <span className="text-sm text-gray-700">Current Image</span>
                </div>
                <button
                  type="button"
                  onClick={removeExisting}
                  className="text-red-600 hover:text-red-800"
                  title="Remove existing image"
                >
                  <IconTrash size={18} />
                </button>
              </div>
            )}

            {/* File name previews (for add or edit new file) */}
            {files.length > 0 && (
              <div className="mt-3 border rounded-md p-3 bg-gray-50">
                <p className="text-sm mb-2 font-semibold">Selected Files:</p>
                <ul className="space-y-1">
                  {files.map((file, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center text-sm bg-white p-2 rounded-md shadow-sm"
                    >
                      <span className="truncate w-4/5">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove file"
                      >
                        <IconTrash size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-md p-2"
              required
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
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
