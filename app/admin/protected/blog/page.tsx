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
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/lib/api/blogs";

export default function BlogPage() {
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

  const debouncedSearch = useDebounce(search, 500);

  // ✅ Load Blogs with latest API format (with search + filters)
  const loadBlogs = async () => {
    try {
      const res = await getBlogs(
        page,
        10,
        debouncedSearch,
        filters.status ? Number(filters.status) : undefined
      );
      setData(res?.data || []);
      setTotalPages(res?.meta?.pages || 1);
    } catch (err) {
      console.error("Error loading blogs:", err);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [page, debouncedSearch, filters]);

  const handleView = async (row: any) => {
    try {
      const res = await getBlogById(row._id);
      const b = res?.data || res;

      const formatted = {
        "Blog Title": b.blog_title || "—",
        "Second Title": b.blog_sec_title || "—",
        "Description": (
          <p className="text-gray-700 whitespace-pre-line">
            {b.description || "—"}
          </p>
        ),
        "Thumbnail": b.blog_thumbnail ? (
          <a
            href={b.blog_thumbnail}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Thumbnail
          </a>
        ) : (
          "—"
        ),
        "Other Images": b.other_images?.length ? (
          <div className="flex flex-wrap gap-2">
            {b.other_images.map((img: string, idx: number) => (
              <a
                key={idx}
                href={img}
                target="_blank"
                className="text-blue-600 underline"
              >
                Image {idx + 1}
              </a>
            ))}
          </div>
        ) : (
          "—"
        ),
        "Date": b.date ? new Date(b.date).toLocaleDateString("en-IN") : "—",
        "Place": b.place || "—",
        "Status":
          b.status === 1 ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          ),
        "Created At": new Date(b.created_at).toLocaleString("en-IN"),
        "Updated At": new Date(b.updated_at).toLocaleString("en-IN"),
      };

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load blog details:", err);
    }
  };

  const fields = [
    { name: "blog_title", label: "Blog Title", type: "text", required: true },
    { name: "blog_sec_title", label: "Second Title", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "place", label: "Place", type: "text" },
    {
      name: "blog_thumbnail",
      label: "Blog Thumbnail",
      type: "file",
      required: !selected,
    },
    {
      name: "other_images",
      label: "Other Images",
      type: "file",
      multiple: true,
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
        <h1 className="text-2xl font-semibold text-cyan-700">Blogs</h1>
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
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Add Blog <IconPlus size={18} />
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
          { key: "blog_title", label: "Blog Title" },
          { key: "blog_sec_title", label: "Second Title" },
          {
            key: "blog_thumbnail",
            label: "Thumbnail",
            render: (r: any) =>
              r.blog_thumbnail ? (
                <a
                  href={r.blog_thumbnail}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View
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
        title={selected ? "Edit Blog" : "Add Blog"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateBlog(selected._id, fd);
          else await createBlog(fd);
        }}
        onSuccess={loadBlogs}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteBlog(selected._id);
            setOpenDelete(false);
            loadBlogs();
          }
        }}
        title="Delete Blog"
        message={`Are you sure you want to delete "${selected?.blog_title}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="Blog Details"
        data={viewData}
      />
    </div>
  );
}
