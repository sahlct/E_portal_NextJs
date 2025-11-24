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
  getCarousels,
  getCarouselById,
  createCarousel,
  updateCarousel,
  deleteCarousel,
} from "@/lib/api/carousel";

export default function CarouselPage() {
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

  const loadCarousels = async () => {
    try {
      const res = await getCarousels(
        page,
        10,
        debouncedSearch,
        filters.status ? Number(filters.status) : undefined
      );
      setData(res?.data || []);
      setTotalPages(res?.meta?.pages || 1);
    } catch (err) {
      console.error("Error loading carousels:", err);
    }
  };

  useEffect(() => {
    loadCarousels();
  }, [page, debouncedSearch, filters]);

  const handleView = async (row: any) => {
    try {
      const res = await getCarouselById(row._id);
      const c = res?.data || res;

      const formatted = {
        Title: c.title || "—",
        "Sub Title": c.sub_title || "—",
        Description: (
          <p className="text-gray-700 whitespace-pre-line">
            {c.description || "—"}
          </p>
        ),
        "Desktop File": c.desktop_file ? (
          // <a
          //   href={c.desktop_file}
          //   target="_blank"
          //   rel="noopener noreferrer"
          //   className="text-blue-600 underline"
          // >
          //   View Desktop Image
          // </a>

          <a href={c.desktop_file} target="_blank" rel="noreferrer">
            <img
              src={c.desktop_file}
              alt="sku"
              className="max-w-40 object-cover rounded border"
            />
          </a>
        ) : (
          "—"
        ),
        "Mobile File": c.mobile_file ? (
          // <a
          //   href={c.mobile_file}
          //   target="_blank"
          //   rel="noopener noreferrer"
          //   className="text-blue-600 underline"
          // >
          //   View Mobile Image
          // </a>

          <a href={c.mobile_file} target="_blank" rel="noreferrer">
            <img
              src={c.mobile_file}
              alt="sku"
              className="max-w-40 object-cover rounded border"
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

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load carousel details:", err);
    }
  };

  const fields = [
    { name: "title", label: "Title", type: "text", required: false },
    { name: "sub_title", label: "Sub Title", type: "text", required: false },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: false,
    },
    {
      name: "desktop_file",
      label: "Desktop Image",
      type: "file",
      required: !selected,
    },
    {
      name: "mobile_file",
      label: "Mobile Image",
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Carousel</h1>
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
            Add Carousel <IconPlus size={18} />
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
          { key: "title", label: "Title", render: (r: any) => r.title || "—" },
          {
            key: "sub_title",
            label: "Sub Title",
            render: (r: any) => r.sub_title || "—",
          },
          {
            key: "description",
            label: "Description",
            render: (r: any) => (
              <div className="truncate max-w-[250px]" title={r.description}>
                {r.description || "—"}
              </div>
            ),
          },
          {
            key: "desktop_file",
            label: "Desktop Image",
            render: (r: any) =>
              r.desktop_file ? (
                <a
                  href={r.desktop_file}
                  target="_blank"
                  className="text-blue-600 underline"
                  onClick={(e) => {
                    e.stopPropagation(); 
                  }}
                >
                  <img
                    src={r.desktop_file}
                    alt=""
                    className="max-w-32 object-cover rounded border"
                  />
                </a>
              ) : (
                "—"
              ),
          },
          {
            key: "mobile_file",
            label: "Mobile Image",
            render: (r: any) =>
              r.mobile_file ? (
                <a
                  href={r.mobile_file}
                  target="_blank"
                  className="text-blue-600 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <img
                    src={r.mobile_file}
                    alt=""
                    className="max-w-32 object-cover rounded border"
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
        title={selected ? "Edit Carousel" : "Add Carousel"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateCarousel(selected._id, fd);
          else await createCarousel(fd);
        }}
        onSuccess={loadCarousels}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCarousel(selected._id);
            setOpenDelete(false);
            loadCarousels();
          }
        }}
        title="Delete Carousel"
        message={`Are you sure you want to delete "${selected?.title}"?`}
      />

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="Carousel Details"
        data={viewData}
      />
    </div>
  );
}
