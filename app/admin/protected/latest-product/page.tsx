"use client";

import { useState, useEffect } from "react";
import { IconPlus, IconEdit } from "@tabler/icons-react";
import TableFilter from "@/components/admin/filter_button";
import DataTable from "@/components/admin/dynamicTable";
import DynamicViewModal from "@/components/admin/dynmaicViewModal";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/debounce";
import Select from "react-select";

import {
  getProductSkus,
  getProductSkuById,
  updateMultipleSkuIsNew
} from "@/lib/api/sku";

export default function LatestProductPage() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{ status?: string }>({});
  const [totalPages, setTotalPages] = useState(1);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedSku, setSelectedSku] = useState<any | null>(null);
  const [viewData, setViewData] = useState<Record<string, any> | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  // ✅ Load only latest products
  const loadLatestProducts = async () => {
    try {
      const res = await getProductSkus(page, 100, debouncedSearch, filters.status, undefined, undefined, true);
      setData(res?.data || []);
      setTotalPages(Math.ceil(res?.total / 100) || 1);
    } catch (err) {
      console.error("Error loading latest products:", err);
    }
  };

  useEffect(() => {
    loadLatestProducts();
  }, [page, debouncedSearch, filters]);

  // ✅ View modal handler
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
          <a href={c.thumbnail_image} target="_blank" className="text-blue-600 underline">
           <img src={c.thumbnail_image} alt="sku" className="w-20 h-16 object-cover rounded border" />
          </a>
        ) : (
          "—"
        ),
        Images: c.sku_image?.length ? (
          <div className="flex flex-wrap gap-2">
            {c.sku_image.map((img: string, i: number) => (
              <a key={i} href={img} target="_blank" rel="noreferrer">
                <img src={img} alt="sku" className="w-16 h-16 object-cover rounded border" />
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
      setOpenViewModal(true);
    } catch (err) {
      console.error("Failed to view SKU:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Latest Products</h1>
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
              setOpenAddModal(true);
            }}
            className="bg-cyan-700 cursor-pointer flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Add Latest Product <IconPlus size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_: any, i: number) => i + 1 + (page - 1) * 100 },
          { key: "sku", label: "SKU" },
          { key: "product_sku_name", label: "SKU Name" },
          {
            key: "product_id",
            label: "Product",
            render: (r: any) => r.product_id?.product_name || "—",
          },
          {
            key: "status",
            label: "Status",
            render: (r: any) =>
              r.status === 1 ? (
                <span className="bg-green-100 text-black px-3 py-0.5 rounded-full">Active</span>
              ) : (
                <span className="bg-red-100 text-black px-3 py-0.5 rounded-full">Inactive</span>
              ),
          },
          {
            key: "thumbnail_image",
            label: "Thumbnail",
            render: (r: any) =>
              r.thumbnail_image ? (
                <img
                  src={r.thumbnail_image}
                  alt="thumbnail"
                  className="w-16 h-10 object-cover rounded border"
                />
              ) : (
                "—"
              ),
          }
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onRowClick={handleView}
        onEdit={(row) => {
          setSelectedSku(row);
          setOpenEditModal(true);
        }}
        // onDelete={()=>()}
      />

      {/* Add Latest Product Modal */}
      {openAddModal && (
        <AddLatestProductModal
          onClose={() => setOpenAddModal(false)}
          onSuccess={loadLatestProducts}
        />
      )}

      {/* Edit Modal */}
      {openEditModal && selectedSku && (
        <EditIsNewModal
          sku={selectedSku}
          onClose={() => setOpenEditModal(false)}
          onSuccess={loadLatestProducts}
        />
      )}

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setViewData(null);
        }}
        title="Latest Product Details"
        data={viewData}
      />
    </div>
  );
}


function AddLatestProductModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [skus, setSkus] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load SKUs (status = 1)
  useEffect(() => {
    (async () => {
      try {
        const res = await getProductSkus(1, 100, "", "1");
        setSkus(res?.data || []);

        // Preselect is_new = true
        const preSelected =
          res?.data
            ?.filter((s: any) => s.is_new === true)
            .map((s: any) => ({
              value: s._id,
              label: `${s.product_sku_name} (${s.sku})`,
            })) || [];
        setSelectedOptions(preSelected);
      } catch (err) {
        console.error("Error loading SKUs:", err);
      }
    })();
  }, []);

  // ✅ Convert SKUs for Select
  const options = skus.map((sku: any) => ({
    value: sku._id,
    label: `${sku.product_sku_name} (${sku.sku})`,
  }));

  const handleSubmit = async () => {
    try {
      if (selectedOptions.length === 0)
        return toast.error("Select at least one SKU");
      setLoading(true);

      const selectedIds = selectedOptions.map((opt) => opt.value);
      await updateMultipleSkuIsNew(selectedIds, true);

      toast.success("Latest products added successfully");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to add latest products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg relative"
        style={{ zIndex: 9999 }}
      >
        <div className="flex justify-between mb-3">
          <h2 className="text-lg font-semibold">Add Latest Products</h2>
          <button onClick={onClose} className="hover:scale-110 cursor-pointer">✕</button>
        </div>

        {/* ✅ Multi-select Field (Dropdown scrolls independently) */}
        <div className="mb-5 relative z-50">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Select Product SKUs
          </label>
          <Select
            isMulti
            options={options}
            value={selectedOptions}
            onChange={(opts) => setSelectedOptions(opts || [])}
            placeholder="Select SKUs..."
            className="react-select-container"
            classNamePrefix="react-select"
            menuPortalTarget={document.body} // ✅ render menu OUTSIDE modal DOM
            menuPosition="absolute"
            menuPlacement="auto"
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 99999, // ✅ ensure dropdown appears above modal
              }),
              menu: (provided) => ({
                ...provided,
                maxHeight: "180px",
                overflowY: "auto",
                backgroundColor: "#fff",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }),
              control: (provided) => ({
                ...provided,
                borderColor: "#d1d5db",
                "&:hover": { borderColor: "#0e7490" },
                minHeight: "42px",
              }),
            }}
          />
        </div>

       
        {/* Footer */}
        <div className="flex justify-end gap-2 border-t pt-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800 cursor-pointer"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}



/* ---------------- Edit Modal ---------------- */
function EditIsNewModal({ sku, onClose, onSuccess }: { sku: any; onClose: () => void; onSuccess: () => void }) {
  const [isNew, setIsNew] = useState(sku.is_new);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateMultipleSkuIsNew([sku._id], isNew);
      toast.success("Updated successfully");
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between mb-3">
          <h2 className="text-lg font-semibold">Edit Latest Status</h2>
          <button onClick={onClose} className="hover:scale-120 cursor-pointer">✕</button>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Is New</label>
          <select
            value={isNew ? "true" : "false"}
            onChange={(e) => setIsNew(e.target.value === "true")}
            className="border rounded p-2 w-full"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 border-t pt-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800 cursor-pointer"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
