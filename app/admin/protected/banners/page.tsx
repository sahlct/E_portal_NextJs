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
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/lib/api/banner";

import { getCategories } from "@/lib/api/category";

export default function BannerPage() {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ status?: string }>({});
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL || "";
  const debouncedSearch = useDebounce(search, 500);

  /* ---------------- LOAD DATA ---------------- */
  const loadBanners = async () => {
    const res = await getBanners(
      page,
      10,
      debouncedSearch,
      filters.status ? Number(filters.status) : undefined
    );
    setData(res?.data || []);
    setTotalPages(res?.meta?.pages || 1);
  };

  const loadCategories = async () => {
    const res = await getCategories(1, 100, undefined, 1);
    setCategories(res?.data || []);
  };

  useEffect(() => {
    loadBanners();
  }, [page, debouncedSearch, filters]);

  useEffect(() => {
    loadCategories();
  }, []);

  /* ---------------- VIEW ---------------- */
  const handleView = async (row: any) => {
    const res = await getBannerById(row._id);
    const b = res?.data;

    setViewData({
      "Banner Title": b.banner_title,
      "Sub Title": b.banner_sub_title || "—",
      Category: b.connected_category
        ? `${b.connected_category.category_name}`
        : "—",
      Image: (
        <img
          src={server_url + b.banner_image}
          className="max-w-48 rounded border"
        />
      ),
      Status:
        b.status === 1 ? (
          <span className="bg-green-100 px-3 py-1 rounded-full text-xs">
            Active
          </span>
        ) : (
          <span className="bg-red-100 px-3 py-1 rounded-full text-xs">
            Inactive
          </span>
        ),
      "Created At": new Date(b.created_at).toLocaleString("en-IN"),
      "Updated At": new Date(b.updated_at).toLocaleString("en-IN"),
    });

    setOpenView(true);
  };

  /* ---------------- FORM FIELDS ---------------- */
  const fields = [
    { name: "banner_title", label: "Banner Title", type: "text", required: true },
    {
      name: "banner_sub_title",
      label: "Banner Sub Title",
      type: "text",
    },
    {
      name: "connected_category_id",
      label: "Connected Category",
      type: "select",
      options: categories.map((c) => ({
        label: c.category_name,
        value: c._id,
      })),
    },
    {
      name: "banner_image",
      label: "Banner Image",
      type: "file",
      required: !selected,
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
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Banners</h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-cyan-700 text-white px-4 py-2 rounded flex gap-2"
        >
          Add Banner <IconPlus size={18} />
        </button>
      </div>

      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_: any, i: number) => i + 1 + (page - 1) * 10,
          },
          { key: "banner_title", label: "Banner Title" },
          {
            key: "connected_category",
            label: "Category",
            render: (r: any) =>
              r.connected_category?.category_name || "—",
          },
          {
            key: "banner_image",
            label: "Image",
            render: (r: any) => (
              <img
                src={server_url + r.banner_image}
                className="w-20 h-12 object-cover rounded border"
              />
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (r: any) =>
              r.status === 1 ? "Active" : "Inactive",
          },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onEdit={(row) => {
          setSelected({ ...row, status: String(row.status) });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView}
      />

      <DynamicFormModal
        title={selected ? "Edit Banner" : "Add Banner"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateBanner(selected._id, fd);
          else await createBanner(fd);
        }}
        onSuccess={loadBanners}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          await deleteBanner(selected._id);
          setOpenDelete(false);
          loadBanners();
        }}
        title="Delete Banner"
        message={`Delete "${selected?.banner_title}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="Banner Details"
        data={viewData}
      />
    </div>
  );
}
