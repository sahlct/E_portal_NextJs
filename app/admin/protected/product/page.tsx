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
import { getBrands } from "@/lib/api/brands";
import toast from "react-hot-toast";
import Select from "react-select";

interface Variation {
  name: string;
  options: string[];
}

interface Feature {
  option: string;
  value: string;
}

interface Product {
  _id: string;
  product_name: string;
  product_image?: string;
  category_id: string;
  brand_id?: string | null;
  brand_name?: string | null;
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
  const [brands, setBrands] = useState<{ label: string; value: string }[]>([]);

  const debouncedSearch = useDebounce(search, 500);
  const server_url = process.env.NEXT_PUBLIC_SERVER_URL || "";

  // --- Load categories
  const loadCategories = async () => {
    try {
      const res = await getCategories(page, 100, undefined, 1);
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

  // --- Load brands
  const loadBrands = async () => {
    try {
      const res = await getBrands(1, 100, undefined, 1);
      if (res?.data) {
        setBrands(
          res.data.map((b: any) => ({
            label: b.brand_name || "Unnamed",
            value: b._id,
          }))
        );
      }
    } catch (err) {
      console.error("Error loading brands:", err);
    }
  };

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
    loadBrands();
  }, []);

  // --- View single product
  const handleView = async (row: Product) => {
    try {
      const res = await getProductById(row._id);
      const c = res?.data;

      const formatted: Record<string, any> = {
        "Product Name": c.product_name || "—",
        Categories: c.categories?.length ? (
          <div className="flex flex-wrap gap-2">
            {c.categories.map((cat: any) => (
              <span
                key={cat._id}
                className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs font-medium"
              >
                {cat.category_name}
              </span>
            ))}
          </div>
        ) : (
          "—"
        ),

        Brand: c.brand_name || "—",
        "Product Image": c.product_image ? (
          <a
            href={server_url + c.product_image}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <img
              src={server_url + c.product_image}
              alt="product"
              className="w-24 h-20 object-cover rounded border"
            />
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

      if (c.advantages?.length) {
        formatted["Advantages"] = (
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {c.advantages.map((adv: string, i: number) => (
              <li key={i}>{adv}</li>
            ))}
          </ul>
        );
      }

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

      if (c.features?.length) {
        formatted["Features"] = (
          <table className="w-full border text-sm">
            <tbody>
              {c.features.map((f: any, i: number) => (
                <tr key={i} className="border-b">
                  <td className="px-3 py-2 font-medium bg-gray-50 w-1/3">
                    {f.option}
                  </td>
                  <td className="px-3 py-2">{f.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
        brand_id: c.brand_id || "",
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
          { key: "brand_name", label: "Brand" },
          {
            key: "product_image",
            label: "Image",
            render: (r: any) =>
              r.product_image ? (
                <a
                  href={server_url + r.product_image}
                  target="_blank"
                  className="text-blue-600 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <img
                    src={server_url + r.product_image}
                    alt="product"
                    className="w-14 h-10 object-cover rounded border"
                  />
                </a>
              ) : (
                "—"
              ),
          },
          // { key: "category_name", label: "Category" },
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
          brands={brands}
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
  brands,
}: {
  isEdit: boolean;
  product: any;
  onClose: () => void;
  onSuccess: () => void;
  categories: { label: string; value: string }[];
  brands: { label: string; value: string }[];
}) {
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<Feature[]>(product?.features || []);
  const [selectedCategories, setSelectedCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [advantages, setAdvantages] = useState<string[]>(
    product?.advantages?.length ? product.advantages : [""]
  );
  const server_url = process.env.NEXT_PUBLIC_SERVER_URL || "";

  // --------------------- FILE PREVIEW STATE ---------------------
  const [imagePreview, setImagePreview] = useState<{
    url: string;
    file: File | null;
    isImage: boolean;
  } | null>(null);

  useEffect(() => {
    if (product?.categories?.length) {
      setSelectedCategories(
        product.categories.map((c: any) => ({
          label: c.category_name,
          value: c._id,
        }))
      );
    }
  }, [product]);

  // Load existing image preview on edit
  useEffect(() => {
    if (product?.product_image) {
      const isImage =
        product.product_image.endsWith(".png") ||
        product.product_image.endsWith(".jpg") ||
        product.product_image.endsWith(".jpeg") ||
        product.product_image.endsWith(".webp");

      setImagePreview({
        url: product.product_image,
        file: null,
        isImage,
      });
    }
  }, [product]);

  useEffect(() => {
    if (product?.features?.length) {
      setFeatures(product.features);
    }
  }, [product]);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const url = URL.createObjectURL(file);

    setImagePreview({ url, file, isImage });
  };

  const removeImage = () => {
    setImagePreview(null);
    const input = document.querySelector(
      'input[name="product_image"]'
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  // --------------------- VARIATIONS ---------------------
  const [variations, setVariations] = useState<Variation[]>(
    product?.variations || []
  );

  // --------------------- SUBMIT ---------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const categoryIds = selectedCategories.map((c) => c.value);
      formData.set("category_id", JSON.stringify(categoryIds));

      // const advantages = advantagesInput
      //   .split(",")
      //   .map((a: any) => a.trim())
      //   .filter(Boolean);

      // formData.set("advantages", JSON.stringify(advantages));

      const advantagesClean = advantages.map((a) => a.trim()).filter(Boolean);

      formData.set("advantages", JSON.stringify(advantagesClean));

      // ------------------ FEATURES ------------------
      const cleanFeatures = features
        .map((f) => ({
          option: f.option.trim(),
          value: f.value.trim(),
        }))
        .filter((f) => f.option && f.value);

      formData.append("features", JSON.stringify(cleanFeatures));

      // attach image file
      if (imagePreview?.file) {
        formData.set("product_image", imagePreview.file);
      }

      // ------------------ variation processing -------------------
      let finalVariations = null;

      const cleanVariations = variations.map((v) => ({
        variation_name: v.name.trim().toLowerCase(),
        options: v.options
          .map((opt) => opt.trim().toLowerCase())
          .filter(Boolean),
      }));

      const hasValidVariation = cleanVariations.some(
        (v) => v.variation_name && v.options.length > 0
      );

      if (hasValidVariation) {
        finalVariations = cleanVariations;
      } else {
        finalVariations = null; // ← when no real variations
      }

      formData.append("variations", JSON.stringify(finalVariations));

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

  // -------------------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
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

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium text-sm">Categories</label>

            <Select
              isMulti
              options={categories}
              value={selectedCategories}
              onChange={(vals) => setSelectedCategories(vals as any)}
              placeholder="Select categories"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Brand (Optional) */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Brand (Optional)
            </label>
            <select
              name="brand_id"
              defaultValue={product?.brand_id || ""}
              className="w-full border rounded p-2"
            >
              <option value="">No Brand</option>
              {brands.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* <div>
            <label className="block mb-1 font-medium text-sm">
              Advantages (comma separated)
            </label>
            <input
              type="text"
              placeholder="13 inch display, 2kw battery, automatic"
              value={advantagesInput}
              onChange={(e) => setAdvantagesInput(e.target.value)}
              className="w-full border rounded p-2 placeholder:text-gray-400"
            />
          </div> */}

          <div>
            <label className="block mb-1 font-medium text-sm">Advantages</label>

            <div className="border rounded p-2 space-y-3 bg-white">
              {advantages.map((adv, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="mt-2 text-lg leading-none">•</span>

                  <textarea
                    value={adv}
                    rows={1}
                    placeholder="Type advantage… (Enter = new bullet, Shift+Enter = new line)"
                    className="flex-1 resize-none overflow-hidden outline-none border-b border-gray-200 focus:border-cyan-600 py-1 text-sm leading-relaxed placeholder:text-gray-500"
                    onChange={(e) => {
                      const updated = [...advantages];
                      updated[i] = e.target.value;
                      setAdvantages(updated);
                    }}
                    onKeyDown={(e) => {
                      // ENTER → new bullet
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const updated = [...advantages];
                        updated.splice(i + 1, 0, "");
                        setAdvantages(updated);
                      }

                      // BACKSPACE on empty → remove bullet
                      if (
                        e.key === "Backspace" &&
                        !adv &&
                        advantages.length > 1
                      ) {
                        e.preventDefault();
                        const updated = advantages.filter(
                          (_, idx) => idx !== i
                        );
                        setAdvantages(updated);
                      }
                    }}
                    onInput={(e) => {
                      // Auto-grow textarea height
                      const el = e.currentTarget;
                      el.style.height = "auto";
                      el.style.height = el.scrollHeight + "px";
                    }}
                  />
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Enter → new bullet · Shift + Enter → new line
            </p>
          </div>

          {/* Product Image + PREVIEW */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Product Image
            </label>

            <input
              type="file"
              name="product_image"
              accept="*"
              onChange={onImageChange}
              className="w-full border rounded p-2"
            />

            {imagePreview && (
              <div className="mt-2 flex items-center gap-3 border p-2 rounded bg-gray-50 relative w-fit">
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-1.5 py-0.5 cursor-pointer"
                  onClick={removeImage}
                >
                  ✕
                </button>

                {imagePreview.isImage ? (
                  <img
                    src={
                      imagePreview.file
                        ? imagePreview.url // blob URL → create time
                        : server_url + imagePreview.url // server file → edit time
                    }
                    className="w-24 h-24 object-cover rounded"
                  />
                ) : (
                  <span className="text-sm text-gray-700">
                    {imagePreview.file?.name || "Existing File"}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Status */}
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

          {/* Variations */}
          <div className="border-t pt-3">
            <h3 className="font-medium text-gray-700 mb-2">Variations</h3>

            {variations.map((v, i) => (
              <div key={i} className="border rounded p-3 mb-3 bg-gray-50">
                {/* Variation name */}
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
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setVariations(variations.filter((_, idx) => idx !== i))
                    }
                    className="ml-2 text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Options */}
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
                    />
                    {v.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...variations];
                          updated[i].options.splice(j, 1);
                          setVariations(updated);
                        }}
                        className="ml-2 text-gray-600 hover:text-red-600 cursor-pointer"
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
                  className="text-sm text-cyan-700 font-medium hover:underline cursor-pointer"
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
              className="px-3 py-1 bg-cyan-700 text-white rounded text-sm hover:bg-cyan-800 cursor-pointer"
            >
              + Add Variation
            </button>
          </div>

          {/* ---------------- FEATURES ---------------- */}
          <div className="border-t pt-3">
            <h3 className="font-medium text-gray-700 mb-2">Product Features</h3>

            {features.map((f, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  placeholder="Feature name (e.g. Display)"
                  value={f.option}
                  onChange={(e) => {
                    const updated = [...features];
                    updated[i].option = e.target.value;
                    setFeatures(updated);
                  }}
                  className="border rounded p-2 flex-1"
                />

                <input
                  type="text"
                  placeholder="Feature value (e.g. AMOLED)"
                  value={f.value}
                  onChange={(e) => {
                    const updated = [...features];
                    updated[i].value = e.target.value;
                    setFeatures(updated);
                  }}
                  className="border rounded p-2 flex-1"
                />

                <button
                  type="button"
                  onClick={() =>
                    setFeatures(features.filter((_, idx) => idx !== i))
                  }
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                >
                  <IconTrash size={18} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setFeatures([...features, { option: "", value: "" }])
              }
              className="mt-2 px-3 py-1 bg-cyan-700 text-white rounded text-sm hover:bg-cyan-800 cursor-pointer"
            >
              + Add Feature
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800 cursor-pointer"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
