"use client";

import { useState, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import TableFilter from "@/components/admin/filter_button";
import DataTable from "@/components/admin/dynamicTable";
import DynamicFormModal from "@/components/admin/dynamicModal";
import ConfirmDeleteModal from "@/components/admin/deleteModal";
import DynamicViewModal from "@/components/admin/dynmaicViewModal";
import { useDebounce } from "@/hooks/debounce";

import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from "@/lib/api/brands";

export default function BrandsPage() {
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ status?: string }>({});
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;
  const debouncedSearch = useDebounce(search, 500);

  /* ---------------- LOAD BRANDS ---------------- */
  const loadBrands = async () => {
    try {
      const res = await getBrands(
        page,
        10,
        debouncedSearch,
        filters.status ? Number(filters.status) : undefined
      );
      setData(res?.data || []);
      setTotalPages(res?.meta?.pages || 1);
    } catch (err) {
      console.error("Error loading brands:", err);
    }
  };

  useEffect(() => {
    loadBrands();
  }, [page, debouncedSearch, filters]);

  /* ---------------- VIEW ---------------- */
  const handleView = async (row: any) => {
    try {
      const res = await getBrandById(row._id);
      const b = res?.data || res;

      const formatted = {
        "Brand Name": b.brand_name || "—",
        "Brand Image": b.brand_image ? (
          <a
            href={server_url + b.brand_image}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={server_url + b.brand_image}
              alt="brand"
              className="w-28 h-20 object-contain border rounded"
            />
          </a>
        ) : (
          "—"
        ),
        "Popular":
          b.is_popular === true ? (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
              Yes
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">
              No
            </span>
          ),
        "Status":
          b.status === 1 ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs">
              Inactive
            </span>
          ),
        "Created At": new Date(b.created_at).toLocaleString("en-IN"),
        "Updated At": new Date(b.updated_at).toLocaleString("en-IN"),
      };

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load brand details:", err);
    }
  };

  /* ---------------- FORM FIELDS ---------------- */
  const fields = [
    {
      name: "brand_name",
      label: "Brand Name",
      type: "text",
      required: true,
    },
    {
      name: "brand_image",
      label: "Brand Image",
      type: "file",
      required: !selected,
    },
    {
      name: "is_popular",
      label: "Is Popular",
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ],
      required: true,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Brands</h1>

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
              setOpenForm(true);
            }}
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Add Brand <IconPlus size={18} />
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_: any, i: number) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "brand_name", label: "Brand Name" },
          {
            key: "brand_image",
            label: "Image",
            render: (r: any) =>
              r.brand_image ? (
                <img
                  src={server_url + r.brand_image}
                  className="w-20 h-14 object-contain border rounded"
                />
              ) : (
                "—"
              ),
          },
          {
            key: "is_popular",
            label: "Popular",
            render: (r: any) => (r.is_popular ? "Yes" : "No"),
          },
          {
            key: "status",
            label: "Status",
            render: (r: any) =>
              r.status === 1 ? (
                <span className="bg-green-100 px-3 py-0.5 rounded-full">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 px-3 py-0.5 rounded-full">
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
        onEdit={(row) => {
          setSelected({
            ...row,
            status: String(row.status),
            is_popular: String(row.is_popular),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView}
      />

      <DynamicFormModal
        title={selected ? "Edit Brand" : "Add Brand"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateBrand(selected._id, fd);
          else await createBrand(fd);
        }}
        onSuccess={loadBrands}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteBrand(selected._id);
            setOpenDelete(false);
            loadBrands();
          }
        }}
        title="Delete Brand"
        message={`Are you sure you want to delete "${selected?.brand_name}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="Brand Details"
        data={viewData}
      />
    </div>
  );
}
