"use client";

import { useState, useEffect } from "react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import TableFilter from "@/components/admin/filter_button";
import DataTable from "@/components/admin/dynamicTable";
import ConfirmDeleteModal from "@/components/admin/deleteModal";
import DynamicViewModal from "@/components/admin/dynmaicViewModal";
import { useDebounce } from "@/hooks/debounce";
import {
  getProducts,
  getProductById,
  createProductWithVariation,
  updateProductWithVariation,
  deleteProduct,
} from "@/lib/api/product";
import { getCategories } from "@/lib/api/category";
import toast from "react-hot-toast";

interface Variation {
  name: string;
  options: string[];
}

interface Product {
  _id: string;
  product_name: string;
  product_image?: string;
  category_id: string;
  status: number;
  created_at?: string;
  updated_at?: string;
  variations?: Variation[];
}

export default function ProductPage() {
  const [data, setData] = useState<Product[]>([]);
  const [filters, setFilters] = useState<{ status?: string }>({});
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [viewData, setViewData] = useState<Record<string, any> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  const debouncedSearch = useDebounce(search, 500);

  // --- Load categories
  const loadCategories = async () => {
    try {
      const res = await getCategories(
        page,
        100,
        undefined,
        1
      );
      if (res?.data) {
        const formatted = res.data.map((cat: any) => ({
          label: cat.category_name || "Unnamed",
          value: cat._id,
        }));
        setCategories(formatted);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  // const loadCategories = async () => {
  //   try {
  //     const res = await getCategories(
  //       page,
  //       10,
  //       debouncedSearch,
  //       filters.status ? Number(filters.status) : undefined
  //     );
  //     setData(res?.data || []);
  //     setTotalPages(res?.meta?.pages || 1);
  //   } catch (err) {
  //     console.error("Error loading categories:", err);
  //   }
  // };

  // --- Load products
  const loadProducts = async () => {
    try {
      const res = await getProducts(
        page,
        10,
        debouncedSearch,
        filters.status ? Number(filters.status) : undefined
      );
      setData(res?.data || []);
      setTotalPages(res?.meta?.pages || 1);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, debouncedSearch, filters]);

  useEffect(() => {
    loadCategories();
  }, []);

  // --- View single product
  const handleView = async (row: Product) => {
    try {
      const res = await getProductById(row._id);
      const c = res?.data;

      const formatted: Record<string, any> = {
        "Product Name": c.product_name || "—",
        Category: c.category_id || "—",
        "Product Image": c.product_image ? (
          <a
            href={c.product_image}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Image
          </a>
        ) : (
          "—"
        ),
        Status:
          c.status === 1 ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          ),
        "Created At": new Date(c.created_at).toLocaleString("en-IN"),
        "Updated At": new Date(c.updated_at).toLocaleString("en-IN"),
      };

      if (c.variations?.length) {
        formatted["Variations"] = (
          <div className="space-y-2">
            {c.variations.map((v: any, i: number) => (
              <div key={v._id || i} className="border rounded p-2 bg-gray-50">
                <p className="font-medium text-gray-800">
                  {i + 1}. {v.name}
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  {v.options?.map((opt: any, j: number) => (
                    <li key={j}>{opt.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      }

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load product details:", err);
    }
  };

  // --- Handle edit
  const handleEdit = async (row: Product) => {
    try {
      const res = await getProductById(row._id);
      const c = res.data;
      const formatted = {
        ...c,
        status: String(c.status),
        variations: c.variations?.map((v: any) => ({
          name: v.name,
          options: v.options.map((o: any) => o.name),
        })),
      };
      setSelected(formatted);
      setEditMode(true);
      setOpenForm(true);
    } catch (err) {
      console.error("Failed to load product for edit:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Products</h1>
        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Active", value: "1" },
                  { label: "Inactive", value: "0" },
                ],
              },
            ]}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
          />
          <button
            onClick={() => {
              setSelected(null);
              setEditMode(false);
              setOpenForm(true);
            }}
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Add Product <IconPlus size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_: any, i: number) => i + 1 + (page - 1) * 10,
          },
          { key: "product_name", label: "Product Name" },
          {
            key: "product_image",
            label: "Image",
            render: (r: any) =>
              r.product_image ? (
                <a
                  href={r.product_image}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              ) : (
                "—"
              ),
          },
          { key: "category_id", label: "Category ID" },
          {
            key: "status",
            label: "Status",
            render: (r: any) =>
              r.status === 1 ? (
                <span className="bg-green-100 text-black px-3 py-0.5 rounded-full">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-black px-3 py-0.5 rounded-full">
                  Inactive
                </span>
              ),
          },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onEdit={handleEdit}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView}
      />

      {/* Product Modal */}
      {openForm && (
        <ProductFormModal
          isEdit={editMode}
          product={selected}
          categories={categories}
          onClose={() => setOpenForm(false)}
          onSuccess={loadProducts}
        />
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteProduct(selected._id);
            setOpenDelete(false);
            loadProducts();
          }
        }}
        title="Delete Product"
        message={`Are you sure you want to delete "${selected?.product_name}"?`}
      />

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="Product Details"
        data={viewData}
      />
    </div>
  );
}

/* --------------------- PRODUCT FORM MODAL --------------------- */
function ProductFormModal({
  isEdit,
  product,
  onClose,
  onSuccess,
  categories,
}: {
  isEdit: boolean;
  product: any;
  onClose: () => void;
  onSuccess: () => void;
  categories: { label: string; value: string }[];
}) {
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<Variation[]>(
    product?.variations || [{ name: "", options: [""] }]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);

      // ✅ Correct transformation to match required payload
      const formattedVariations = variations.map((v) => ({
        variation_name: v.name.trim().toLowerCase(), // convert key & clean name
        options: v.options
          .map((opt) => opt.trim().toLowerCase())
          .filter(Boolean), // ensure lowercase + remove empties
      }));

      console.log("Payload variations:", formattedVariations); // ✅ Debug log — remove in production

      formData.append("variations", JSON.stringify(formattedVariations));

      if (isEdit) {
        await updateProductWithVariation(product._id, formData);
        toast.success("Product updated successfully");
      } else {
        await createProductWithVariation(formData);
        toast.success("Product created successfully");
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-sm">
              Product Name
            </label>
            <input
              name="product_name"
              defaultValue={product?.product_name || ""}
              required
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Category</label>
            <select
              name="category_id"
              required
              defaultValue={product?.category_id || ""}
              className="w-full border rounded p-2"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Product Image
            </label>
            <input
              type="file"
              name="product_image"
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Status</label>
            <select
              name="status"
              required
              defaultValue={String(product?.status ?? "1")}
              className="w-full border rounded p-2"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          {/* Variation Builder */}
          <div className="border-t pt-3">
            <h3 className="font-medium text-gray-700 mb-2">Variations</h3>
            {variations.map((v, i) => (
              <div key={i} className="border rounded p-3 mb-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    placeholder="Variation name (e.g. Color)"
                    value={v.name}
                    onChange={(e) => {
                      const updated = [...variations];
                      updated[i].name = e.target.value;
                      setVariations(updated);
                    }}
                    className="border rounded p-2 flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setVariations(variations.filter((_, idx) => idx !== i))
                    }
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>

                {v.options.map((opt, j) => (
                  <div key={j} className="flex items-center mb-2">
                    <input
                      type="text"
                      placeholder="Option name"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...variations];
                        updated[i].options[j] = e.target.value;
                        setVariations(updated);
                      }}
                      className="border rounded p-2 flex-1"
                      required
                    />
                    {v.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...variations];
                          updated[i].options.splice(j, 1);
                          setVariations(updated);
                        }}
                        className="ml-2 text-gray-600 hover:text-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const updated = [...variations];
                    updated[i].options.push("");
                    setVariations(updated);
                  }}
                  className="text-sm text-cyan-700 font-medium hover:underline"
                >
                  + Add Option
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setVariations([...variations, { name: "", options: [""] }])
              }
              className="px-3 py-1 bg-cyan-700 text-white rounded text-sm hover:bg-cyan-800"
            >
              + Add Variation
            </button>
          </div>

          <div className="flex justify-end gap-2 border-t pt-3">
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
