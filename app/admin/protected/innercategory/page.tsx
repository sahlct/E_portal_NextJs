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
  getInnerCategories,
  getInnerCategoryById,
  createInnerCategory,
  updateInnerCategory,
  deleteInnerCategory,
} from "@/lib/api/innerCategory";
import { getCategories } from "@/lib/api/category";
import { getSubCategories } from "@/lib/api/subCategory";
import toast from "react-hot-toast";

export default function InnerCategoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState<{
    status?: string;
    category_id?: string;
    sub_category_id?: string;
  }>({});
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

  /* Load dropdown data */
  const loadCategories = async () => {
    const res = await getCategories(1, 100);
    setCategories(res?.data || []);
  };

  const loadSubCategories = async (categoryId?: string) => {
    const res = await getSubCategories(1, 100, undefined, undefined, categoryId);
    setSubCategories(res?.data || []);
  };

  /* Load inner categories */
  const loadInnerCategories = async () => {
    const res = await getInnerCategories(
      page,
      10,
      debouncedSearch,
      filters.status ? Number(filters.status) : undefined,
      filters.category_id,
      filters.sub_category_id
    );

    setData(res?.data || []);
    setTotalPages(res?.meta?.pages || 1);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadSubCategories(filters.category_id);
  }, [filters.category_id]);

  useEffect(() => {
    loadInnerCategories();
  }, [page, debouncedSearch, filters]);

  /* View */
  const handleView = async (row: any) => {
    const res = await getInnerCategoryById(row._id);
    const c = res?.data || res;

    setViewData({
      "Inner Category Name": c.inner_category_name,
      Category: c.category_name,
      "Sub Category": c.sub_category_name,
      Image: c.inner_category_image ? (
        <img
          src={server_url + c.inner_category_image}
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
      name: "sub_category_id",
      label: "Sub Category",
      type: "select",
      required: true,
      options: subCategories.map((s) => ({
        label: s.sub_category_name,
        value: s._id,
      })),
    },
    {
      name: "inner_category_name",
      label: "Inner Category Name",
      type: "text",
      required: true,
    },
    {
      name: "inner_category_image",
      label: "Inner Category Image",
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
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">
          Inner Category
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
              {
                key: "sub_category_id",
                label: "Sub Category",
                options: subCategories.map((s) => ({
                  label: s.sub_category_name,
                  value: s._id,
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
            Add Inner Category <IconPlus size={18} />
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
          { key: "inner_category_name", label: "Inner Category" },
          { key: "category_name", label: "Category" },
          { key: "sub_category_name", label: "Sub Category" },
          {
            key: "inner_category_image",
            label: "Image",
            render: (r: any) =>
              r.inner_category_image ? (
                <img
                  src={server_url + r.inner_category_image}
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
        title={selected ? "Edit Inner Category" : "Add Inner Category"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateInnerCategory(selected._id, fd);
          else await createInnerCategory(fd);
        }}
        onSuccess={loadInnerCategories}
      />

      {/* Delete */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Inner Category"
        message={`Are you sure you want to delete "${selected?.inner_category_name}"?`}
        onConfirm={async () => {
          await deleteInnerCategory(selected._id);
          toast.success("Inner category deleted");
          setOpenDelete(false);
          loadInnerCategories();
        }}
      />

      {/* View */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="Inner Category Details"
        data={viewData}
      />
    </div>
  );
}
