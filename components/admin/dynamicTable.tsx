"use client";

import { IconEdit, IconTrash } from "@tabler/icons-react";

export default function DataTable({
  columns,
  data,
  page,
  totalPages,
  setPage,
  search,
  setSearch,
  onEdit,
  onDelete,
  onRowClick,
}: {
  columns: any[];
  data: any[];
  page: number;
  totalPages: number;
  setPage: (n: number) => void;
  search: string;
  setSearch: (v: string) => void;
  onEdit: (row: any) => void;
  onDelete?: (row: any) => void;
  onRowClick?: (row: any) => void;
}) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Search */}
      <div className="p-3 border-b flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-2 font-semibold">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2">
                      {col.render ? col.render(row, i) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(row);
                      }}
                    >
                      <IconEdit size={18} className="text-cyan-700" />
                    </button>
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(row);
                        }}
                      >
                        <IconTrash size={18} className="text-red-600" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-4 text-gray-500"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-3 flex justify-center gap-2 border-t">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2 py-1">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
