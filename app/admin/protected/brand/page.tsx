"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IconEdit, IconPlus, IconTrash, IconX } from "@tabler/icons-react";

import {
  getBrands,
  deleteMultipleBrands,
  activateMultipleBrands,
  deactivateMultipleBrands,
  createBrands,
} from "@/lib/api/brand";
import DynamicFormModal from "@/components/admin/dynamicModal";
import ConfirmDeleteModal from "@/components/admin/deleteModal";

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("1");
  const [actionType, setActionType] = useState("delete");
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[] | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await getBrands(1, 100, Number(statusFilter));
      setBrands(res.data || []);
    } catch {
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [statusFilter]);

  const toggleSelect = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleBulkAction = async () => {
    if (selected.length === 0) return toast.error("Please select at least one brand.");
    try {
      if (actionType === "delete") {
        setDeleteTargetIds(selected);
        setDeleteOpen(true);
      } else if (actionType === "active") {
        await activateMultipleBrands(selected);
        toast.success("Selected brands activated");
      } else if (actionType === "inactive") {
        await deactivateMultipleBrands(selected);
        toast.success("Selected brands deactivated");
      }
      setSelected([]);
      fetchBrands();
    } catch {
      toast.error("Bulk action failed");
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTargetIds?.length) return setDeleteOpen(false);
    try {
      await deleteMultipleBrands(deleteTargetIds);
      toast.success("Deleted successfully");
      fetchBrands();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteOpen(false);
    }
  };

  const createSubmit = async (formData: FormData) => {
    const files = formData.getAll("brand_logo").filter(Boolean) as File[];
    const status = formData.get("status") as string;
    if (!files.length) throw new Error("Please select at least one logo");
    await createBrands(files);
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <select
            className="border rounded-lg px-4 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            <option value="delete">Delete</option>
            <option value="active">Activate</option>
            <option value="inactive">Deactivate</option>
          </select>

          <button
            className={`px-4 py-2 rounded-lg text-white ${
              selected.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
            disabled={selected.length === 0}
            onClick={handleBulkAction}
          >
            Apply
          </button>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <IconPlus size={18} /> New Brand
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : brands.length === 0 ? (
        <p>No brands found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {brands.map((brand) => (
            <div key={brand._id} className="relative border rounded-xl shadow-sm hover:shadow-md transition p-2">
              <input
                type="checkbox"
                className="absolute top-2 left-2 w-4 h-4 accent-blue-600"
                checked={selected.includes(brand._id)}
                onChange={() => toggleSelect(brand._id)}
              />
              <img
                src={brand.brand_logo}
                alt="Brand"
                onClick={() => setPreviewImage(brand.brand_logo)}
                className="w-full h-32 object-contain rounded-md bg-gray-100 hover:scale-105 transition-transform cursor-pointer"
              />
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    brand.status === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {brand.status === 1 ? "Active" : "Inactive"}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <button className="hover:text-blue-600" aria-label="Edit">
                    <IconEdit size={16} />
                  </button>
                  <button
                    className="hover:text-red-600"
                    onClick={() => {
                      setDeleteTargetIds([brand._id]);
                      setDeleteOpen(true);
                    }}
                    aria-label="Delete"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DynamicFormModal
        title="Add New Brand"
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        fields={[
          {
            name: "brand_logo",
            label: "Brand Logos (Multiple)",
            type: "file",
            multiple: true,
            required: true,
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },
        ]}
        onSubmit={createSubmit}
        onSuccess={() => {
          setCreateOpen(false);
          fetchBrands();
        }}
      />

      <ConfirmDeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirmed}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${deleteTargetIds?.length ?? 0} brand(s)?`}
      />

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative bg-white p-3 rounded-xl max-w-3xl w-full">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setPreviewImage(null)}
              aria-label="Close preview"
            >
              <IconX size={20} />
            </button>
            <img src={previewImage} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
