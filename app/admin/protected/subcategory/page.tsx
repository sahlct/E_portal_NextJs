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
  getSubCategories,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "@/lib/api/subCategory";
import { getCategories } from "@/lib/api/category";
import toast from "react-hot-toast";

export default function SubCategoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ status?: string; category_id?: string }>({});
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

  /* Load categories for dropdown */
  const loadCategories = async () => {
    const res = await getCategories(1, 100);
    setCategories(res?.data || []);
  };

  /* Load sub categories */
  const loadSubCategories = async () => {
    const res = await getSubCategories(
      page,
      10,
      debouncedSearch,
      filters.status ? Number(filters.status) : undefined,
      filters.category_id
    );

    setData(res?.data || []);
    setTotalPages(res?.meta?.pages || 1);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadSubCategories();
  }, [page, debouncedSearch, filters]);

  /* View handler */
  const handleView = async (row: any) => {
    const res = await getSubCategoryById(row._id);
    const c = res?.data || res;

    setViewData({
      "Sub Category Name": c.sub_category_name,
      Category: c.category_name,
      Image: c.sub_category_image ? (
        <img
          src={server_url + c.sub_category_image}
          className="max-w-32 rounded border"
        />
      ) : (
        "—"
      ),
      Status:
        c.status === 1 ? (
          <span className="bg-green-100 px-3 py-1 rounded-full text-xs">
            Active
          </span>
        ) : (
          <span className="bg-red-100 px-3 py-1 rounded-full text-xs">
            Inactive
          </span>
        ),
      "Created At": new Date(c.created_at).toLocaleString("en-IN"),
      "Updated At": new Date(c.updated_at).toLocaleString("en-IN"),
    });

    setOpenView(true);
  };

  /* Form fields */
  const fields = [
    {
      name: "category_id",
      label: "Category",
      type: "select",
      required: true,
      options: categories.map((c) => ({
        label: c.category_name,
        value: c._id,
      })),
    },
    {
      name: "sub_category_name",
      label: "Sub Category Name",
      type: "text",
      required: true,
    },
    {
      name: "sub_category_image",
      label: "Sub Category Image",
      type: "file",
      required: !selected,
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
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">
          Sub Category
        </h1>
        <div className="flex gap-3">
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
                key: "category_id",
                label: "Category",
                options: categories.map((c) => ({
                  label: c.category_name,
                  value: c._id,
                })),
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
            className="bg-cyan-700 cursor-pointer flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Add Sub Category <IconPlus size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_: any, i: number) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "sub_category_name", label: "Sub Category Name" },
          { key: "category_name", label: "Category" },
          {
            key: "sub_category_image",
            label: "Image",
            render: (r: any) =>
              r.sub_category_image ? (
                <img
                  src={server_url + r.sub_category_image}
                  className="w-14 h-10 rounded border object-cover"
                />
              ) : (
                "—"
              ),
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
          setSelected({ ...row, status: String(row.status) });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView}
      />

      {/* Add/Edit */}
      <DynamicFormModal
        title={selected ? "Edit Sub Category" : "Add Sub Category"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateSubCategory(selected._id, fd);
          else await createSubCategory(fd);
        }}
        onSuccess={loadSubCategories}
      />

      {/* Delete */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Sub Category"
        message={`Are you sure you want to delete "${selected?.sub_category_name}"?`}
        onConfirm={async () => {
          await deleteSubCategory(selected._id);
          toast.success("Sub category deleted");
          setOpenDelete(false);
          loadSubCategories();
        }}
      />

      {/* View */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="Sub Category Details"
        data={viewData}
      />
    </div>
  );
}
