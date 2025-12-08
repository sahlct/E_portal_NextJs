"use client";

import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import TableFilter from "@/components/admin/filter_button";
import DataTable from "@/components/admin/dynamicTable";
import DynamicFormModal from "@/components/admin/dynamicModal";
import ConfirmDeleteModal from "@/components/admin/deleteModal";
import DynamicViewModal from "@/components/admin/dynmaicViewModal";
import { useDebounce } from "@/hooks/debounce";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/category";
import toast from "react-hot-toast";

export default function CategoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ status?: string ; is_listing?: string }>({});
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

  const loadCategories = async () => {
    try {
      const res = await getCategories(
        page,
        10,
        debouncedSearch,
        filters.status ? Number(filters.status) : undefined,
        filters.is_listing ? filters.is_listing : undefined
      );

      setData(res?.data || []);
      setTotalPages(res?.meta?.pages || 1);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page, debouncedSearch, filters]);

  const handleView = async (row: any) => {
    try {
      const res = await getCategoryById(row._id);
      const c = res?.data || res;

      const formatted = {
        "Category Name": c.category_name || "—",
        Image: c.category_image ? (
          <a
            href={server_url + c.category_image}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <img
              src={server_url + c.category_image}
              alt="sku"
              className="max-w-32 object-cover rounded border"
            />
          </a>
        ) : (
          "—"
        ),
        "Show in Listing": c.is_listing ? "Yes" : "No",
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

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load category details:", err);
    }
  };

  const fields = [
    {
      name: "category_name",
      label: "Category Name",
      type: "text",
      required: true,
    },
    {
      name: "category_image",
      label: "Category Image",
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

    // ⭐ NEW FIELD
    {
      name: "is_listing",
      label: "Show in Listing?",
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
      required: true,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Category</h1>
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
              {
                key: "is_listing",
                label: "Listing",
                options: [
                  { label: "Yes", value: "true" },
                  { label: "No", value: "false" },
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
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Add Category <IconPlus size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_: any, i: any) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "category_name", label: "Category Name" },
          {
            key: "category_image",
            label: "Image",
            render: (r: any) =>
              r.category_image ? (
                <a
                  href={server_url + r.category_image}
                  target="_blank"
                  className="text-blue-600 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <img
                    src={server_url + r.category_image}
                    alt="sku"
                    className="w-14 h-10 object-cover rounded border"
                  />
                </a>
              ) : (
                "—"
              ),
          },
          {
            key: "is_listing",
            label: "Listing",
            render: (r: any) =>
              r.is_listing ? (
                <span className="bg-blue-100 text-blue-800 px-3 py-0.5 rounded-full">
                  Yes
                </span>
              ) : (
                <span className="bg-gray-200 text-black px-3 py-0.5 rounded-full">
                  No
                </span>
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

      {/* Add/Edit Modal */}
      <DynamicFormModal
        title={selected ? "Edit Category" : "Add Category"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateCategory(selected._id, fd);
          else await createCategory(fd);
        }}
        onSuccess={loadCategories}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCategory(selected._id);
            toast.success("Category deleted successfully");
            setOpenDelete(false);
            loadCategories();
          }
        }}
        title="Delete Category"
        message={`Are you sure you want to delete "${selected?.category_name}"?`}
      />

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="Category Details"
        data={viewData}
      />
    </div>
  );
}
