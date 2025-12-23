"use client";

import { useState, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import TableFilter from "@/components/admin/filter_button";
import DataTable from "@/components/admin/dynamicTable";
import ConfirmDeleteModal from "@/components/admin/deleteModal";
import DynamicViewModal from "@/components/admin/dynmaicViewModal";
import { useDebounce } from "@/hooks/debounce";
import toast from "react-hot-toast";
import {
  getProductSkus,
  getProductSkuById,
  createProductSkuWithVariation,
  updateProductSkuWithVariation,
  deleteProductSku,
} from "@/lib/api/sku";
import { getProductById, getProducts } from "@/lib/api/product";

export default function ProductSKU() {
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ status?: string }>({});
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [viewData, setViewData] = useState<Record<string, any> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

  // Load SKU list
  const loadSkus = async () => {
    try {
      const res = await getProductSkus(
        page,
        10,
        debouncedSearch,
        filters.status
      );
      setData(res?.data || []);
      setTotalPages(Math.ceil(res?.total / 10) || 1);
    } catch (err) {
      console.error("Error loading SKUs:", err);
    }
  };

  useEffect(() => {
    loadSkus();
  }, [page, debouncedSearch, filters]);

  // --- View SKU ---
  const handleView = async (row: any) => {
    try {
      const res = await getProductSkuById(row._id);
      const c = res?.data;

      const formatted: Record<string, any> = {
        SKU: c.sku,
        "SKU Name": c.product_sku_name,
        Product: c.product_id?.product_name || "—",
        MRP: c.mrp,
        Price: c.price,
        Quantity: c.quantity,
        "Is New": c.is_new ? "Yes" : "No",
        "Out of Stock": c.is_out_of_stock ? "Yes" : "No",
        "Single Order Limit": c.single_order_limit,
        Description: c.description || "—",
        Thumbnail: c.thumbnail_image ? (
          <a
            href={server_url + c.thumbnail_image}
            target="_blank"
            className="text-blue-600 underline"
          >
            <img
              src={server_url + c.thumbnail_image}
              alt="sku"
              className="w-16 h-16 object-cover rounded border"
            />
          </a>
        ) : (
          "—"
        ),
        Images: c.sku_image?.length ? (
          <div className="flex flex-wrap gap-2">
            {c.sku_image.map((img: string, i: number) => (
              <a
                key={i}
                href={server_url + img}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={server_url + img}
                  alt="sku"
                  className="w-16 h-16 object-cover rounded border"
                />
              </a>
            ))}
          </div>
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
      };

      if (c.variation_configurations?.length) {
        formatted["Variations"] = (
          <div className="space-y-2">
            {c.variation_configurations.map((v: any, i: number) => (
              <div key={i} className="border rounded p-2 bg-gray-50">
                <p className="font-medium text-gray-800">
                  {v.variation.name} → {v.option.name}
                </p>
              </div>
            ))}
          </div>
        );
      }

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to view SKU:", err);
    }
  };

  // --- Edit SKU ---
  const handleEdit = async (row: any) => {
    try {
      const res = await getProductSkuById(row._id);
      const c = res.data;
      setSelected(c);
      setEditMode(true);
      setOpenForm(true);
    } catch (err) {
      toast.error("Failed to fetch SKU details");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Product SKUs</h1>
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
            className="bg-cyan-700 flex items-center cursor-pointer gap-2 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Add SKU <IconPlus size={18} />
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_: any, i: number) => i + 1 + (page - 1) * 10,
          },
          {
            key: "sku",
            label: "SKU",
            render: (r: any) => (
              <div className="max-w-[250px] line-clamp-1">{r.sku}</div>
            ),
          },
          { key: "product_sku_name", label: "SKU Name" },
          {
            key: "product_id",
            label: "Product",
            render: (r: any) => r.product_id?.product_name || "—",
          },
          {
            key: "thumbnail_image",
            label: "Thumbnail",
            render: (r: any) =>
              r.thumbnail_image ? (
                <a
                  href={server_url + r.thumbnail_image}
                  target="_blank"
                  className="text-blue-600 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <img
                    src={server_url + r.thumbnail_image}
                    alt="thumbnail"
                    className="w-16 h-10 object-cover rounded border"
                  />
                </a>
              ) : (
                "—"
              ),
          },
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

      {/* --- Create/Edit Form Modal --- */}
      {openForm && (
        <SkuFormModal
          isEdit={editMode}
          sku={selected}
          onClose={() => setOpenForm(false)}
          onSuccess={loadSkus}
        />
      )}

      {/* --- Delete Modal --- */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteProductSku(selected._id);
            toast.success("SKU deleted successfully");
            setOpenDelete(false);
            loadSkus();
          }
        }}
        title="Delete SKU"
        message={`Are you sure you want to delete "${selected?.product_sku_name}"?`}
      />

      {/* --- View Modal --- */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="SKU Details"
        data={viewData}
      />
    </div>
  );
}

/* ---------------- SKU FORM MODAL ---------------- */
function SkuFormModal({
  isEdit,
  sku,
  onClose,
  onSuccess,
}: {
  isEdit: boolean;
  sku: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [variations, setVariations] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const page = 1;
  const [selectedProductId, setSelectedProductId] = useState(
    sku?.product_id?._id || ""
  );
  const [existingImages, setExistingImages] = useState<string[]>(
    sku?.sku_image || []
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    sku?.thumbnail_image || null
  );
  const [skuImages, setSkuImages] = useState<File[]>([]);

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL || "";

  //  Load all products for dropdown
  useEffect(() => {
    (async () => {
      const res = await getProducts(page, 100, undefined, undefined);
      setProducts(res?.data || []);
    })();
  }, []);

  //  Preload variations + selected options on edit
  useEffect(() => {
    if (isEdit && sku?.product_id?._id) {
      setSelectedOptions(
        sku?.variation_configurations?.map((v: any) => v.option._id) || []
      );
      handleProductChange(sku.product_id._id);
    }
  }, [isEdit, sku]);

  //  Load variations for selected product using correct API
  const handleProductChange = async (productId: string) => {
    try {
      setSelectedProductId(productId);
      if (!productId) {
        setVariations([]);
        return;
      }

      const res = await getProductById(productId); //  correct single product API
      if (res?.data?.variations) {
        setVariations(res.data.variations);
      } else {
        setVariations([]);
      }
    } catch (err) {
      console.error("Error loading product variations:", err);
      setVariations([]);
    }
  };

  //  Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) setSkuImages((p) => [...p, ...files]);
  };

  const handleImageRemove = (index: number) => {
    setSkuImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExistingImageRemove = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleThumbnailRemove = () => {
    setThumbnailPreview(null);

    const input = document.querySelector(
      'input[name="thumbnail_image"]'
    ) as HTMLInputElement;

    if (input) input.value = "";
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  //  Submit SKU
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      selectedOptions.forEach((id) =>
        formData.append("sku_variation_conf[]", id)
      );

      existingImages.forEach((url) =>
        formData.append("existing_sku_image", url)
      );

      skuImages.forEach((file) => formData.append("sku_image", file));

      if (isEdit) {
        await updateProductSkuWithVariation(sku._id, formData);
        toast.success("SKU updated successfully");
      } else {
        await createProductSkuWithVariation(formData);
        toast.success("SKU created successfully");
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-3">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit SKU" : "Add SKU"}
          </h2>
          <button onClick={onClose} className="cursor-pointer hover:scale-110">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Select Product
            </label>
            <select
              name="product_id"
              required
              value={selectedProductId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.product_name}
                </option>
              ))}
            </select>
          </div>

          {/* SKU Basic Fields */}
          <div>
            <label className="block mb-1 font-medium text-sm">SKU Code</label>
            <input
              name="sku"
              defaultValue={sku?.sku || ""}
              placeholder="Enter SKU code"
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">SKU Name</label>
            <input
              name="product_sku_name"
              defaultValue={sku?.product_sku_name || ""}
              placeholder="Enter SKU name"
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={sku?.description || ""}
              placeholder="Enter description"
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Thumbnail Image
            </label>
            <input
              type="file"
              name="thumbnail_image"
              className="w-full border rounded p-2"
              onChange={handleThumbnailChange}
            />
            {thumbnailPreview && (
              <div className="relative w-24 h-24 border rounded overflow-hidden group mt-2">
                <img
                  src={
                    thumbnailPreview.startsWith("blob:")
                      ? thumbnailPreview
                      : server_url + thumbnailPreview
                  }
                  alt="Thumbnail Preview"
                  className="object-cover w-full h-full"
                />

                {/* remove button */}
                <button
                  type="button"
                  onClick={handleThumbnailRemove}
                  className="absolute top-1 right-1 cursor-pointer bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* SKU Images */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              SKU Images (Multiple)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full border rounded p-2"
            />

            {/* Existing images preview */}
            {existingImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {existingImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 border rounded overflow-hidden group"
                  >
                    <img
                      src={server_url + img}
                      alt="existing"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleExistingImageRemove(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Newly selected images */}
            {skuImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {skuImages.map((file, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 border rounded overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs  cursor-pointer flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-medium text-sm">MRP</label>
              <input
                name="mrp"
                type="number"
                defaultValue={sku?.mrp || ""}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Price</label>
              <input
                name="price"
                type="number"
                defaultValue={sku?.price || ""}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Quantity</label>
              <input
                name="quantity"
                type="number"
                defaultValue={sku?.quantity || ""}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">
                Single Order Limit
              </label>
              <input
                name="single_order_limit"
                type="number"
                defaultValue={sku?.single_order_limit || ""}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Status + Booleans */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block mb-1 font-medium text-sm">Status</label>
              <select
                name="status"
                defaultValue={String(sku?.status ?? "1")}
                className="w-full border p-2 rounded"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Is New</label>
              <select
                name="is_new"
                defaultValue={
                  sku?.is_new === true || sku?.is_new === "true"
                    ? "true"
                    : "false"
                }
                className="w-full border p-2 rounded"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">
                Is Out of Stock
              </label>
              <select
                name="is_out_of_stock"
                defaultValue={
                  sku?.is_out_of_stock === true ||
                  sku?.is_out_of_stock === "true"
                    ? "true"
                    : "false"
                }
                className="w-full border p-2 rounded"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>

          {/* Variations */}
          {variations.length > 0 && (
            <div>
              <label className="block mb-2 font-medium text-sm text-gray-800">
                Variation Options
              </label>
              <div className="space-y-4">
                {variations.map((v: any) => (
                  <div key={v._id} className="border rounded-lg p-3 bg-gray-50">
                    <p className="font-medium text-gray-700 mb-2">{v.name}</p>
                    <select
                      className="border rounded p-2 w-full"
                      value={
                        selectedOptions.find((id) =>
                          v.options.some((opt: any) => opt._id === id)
                        ) || ""
                      }
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        setSelectedOptions((prev) => {
                          const filtered = prev.filter(
                            (id) =>
                              !v.options.some((opt: any) => opt._id === id)
                          );
                          return selectedId
                            ? [...filtered, selectedId]
                            : filtered;
                        });
                      }}
                    >
                      <option value="">Select {v.name}</option>
                      {v.options.map((opt: any) => (
                        <option key={opt._id} value={opt._id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

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
