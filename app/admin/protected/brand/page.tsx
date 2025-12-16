// "use client";

// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { IconEdit, IconPlus, IconTrash, IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

// import {
//   getBrands,
//   deleteMultipleBrands,
//   updateMultipleBrandStatus,
//   createBrands,
//   updateBrand,
// } from "@/lib/api/brand";
// import ConfirmDeleteModal from "@/components/admin/deleteModal";
// import BrandFormModal from "@/components/admin/brandFormModal";
// import TableFilter from "@/components/admin/filter_button";
// import { useDebounce } from "@/hooks/debounce";

// export default function BrandPage() {
//   const [brands, setBrands] = useState<any[]>([]);
//   const [selected, setSelected] = useState<string[]>([]);
//   const [statusFilter, setStatusFilter] = useState("1");
//   const [actionType, setActionType] = useState("delete");
//   const [loading, setLoading] = useState(false);
//   const [createOpen, setCreateOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [deleteTargetIds, setDeleteTargetIds] = useState<string[] | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [editBrand, setEditBrand] = useState<any | null>(null);
//   const [filters, setFilters] = useState<{ status?: string }>({});
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [search, setSearch] = useState("");
//   const debouncedSearch = useDebounce(search, 500);

//   const limit = 18; 

//   const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

//   const fetchBrands = async () => {
//     try {
//       setLoading(true);
//       const res = await getBrands(
//         page,
//         limit,
//         debouncedSearch,
//         filters.status ? Number(filters.status) : undefined
//       );

//       setBrands(res.data || []);

//       //  Set total pages (from meta if available)
//       if (res.meta) {
//         const total = res.meta.total || 0;
//         setTotalPages(Math.ceil(total / limit));
//       } else {
//         setTotalPages(1);
//       }
//     } catch {
//       toast.error("Failed to load brands");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBrands();
//   }, [page, debouncedSearch, filters]);

//   const toggleSelect = (id: string) =>
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );

//   const handleBulkAction = async () => {
//     if (selected.length === 0)
//       return toast.error("Please select at least one brand.");
//     try {
//       if (actionType === "delete") {
//         setDeleteTargetIds(selected);
//         setDeleteOpen(true);
//       } else if (actionType === "active" || actionType === "inactive") {
//         const status = actionType === "active" ? 1 : 0;
//         await updateMultipleBrandStatus(selected, status);
//         toast.success(
//           status === 1
//             ? "Selected brands activated successfully"
//             : "Selected brands deactivated successfully"
//         );
//       }

//       setSelected([]);
//       fetchBrands();
//     } catch {
//       toast.error("Bulk action failed");
//     }
//   };

//   const handleDeleteConfirmed = async () => {
//     if (!deleteTargetIds?.length) return setDeleteOpen(false);
//     try {
//       await deleteMultipleBrands(deleteTargetIds);
//       toast.success("Deleted successfully");
//       fetchBrands();
//     } catch {
//       toast.error("Delete failed");
//     } finally {
//       setDeleteOpen(false);
//     }
//   };

//   const handleSubmit = async (id: string | null, formData: FormData) => {
//     if (id) {
//       await updateBrand(id, formData);
//     } else {
//       const files = formData.getAll("brand_logo").filter(Boolean) as File[];
//       await createBrands(files);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
//         <div className="flex items-center gap-3">
//           <select
//             className="border cursor-pointer rounded-lg px-3 py-2"
//             value={actionType}
//             onChange={(e) => setActionType(e.target.value)}
//           >
//             <option value="delete">Delete</option>
//             <option value="active">Activate</option>
//             <option value="inactive">Deactivate</option>
//           </select>

//           <button
//             className={`px-4 py-2 rounded-lg text-white ${
//               selected.length === 0
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-red-600 cursor-pointer hover:bg-red-700"
//             }`}
//             disabled={selected.length === 0}
//             onClick={handleBulkAction}
//           >
//             Apply
//           </button>
//         </div>

//         <div className="flex gap-2 items-center">
//           <TableFilter
//             fields={[
//               {
//                 key: "status",
//                 label: "Status",
//                 options: [
//                   { label: "Active", value: "1" },
//                   { label: "Inactive", value: "0" },
//                 ],
//               },
//             ]}
//             onChange={(f) => {
//               setFilters(f);
//               setPage(1);
//             }}
//           />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="border rounded-lg px-3 py-2"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button
//             onClick={() => {
//               setEditBrand(null);
//               setCreateOpen(true);
//             }}
//             className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
//           >
//             Add New Brands <IconPlus size={18} />
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : brands.length === 0 ? (
//         <p>No brands found.</p>
//       ) : (
//         <>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
//             {brands.map((brand) => (
//               <div
//                 key={brand._id}
//                 className="relative border rounded-xl shadow-sm hover:shadow-md transition p-2"
//               >
//                 <input
//                   type="checkbox"
//                   className="absolute top-2 left-2 w-4 h-4 accent-blue-600"
//                   checked={selected.includes(brand._id)}
//                   onChange={() => toggleSelect(brand._id)}
//                 />
//                 <img
//                   src={server_url + brand.brand_logo}
//                   alt="Brand"
//                   onClick={() => setPreviewImage(brand.brand_logo)}
//                   className="w-full h-32 object-contain rounded-md bg-gray-100 cursor-pointer"
//                 />
//                 <div className="flex items-center justify-between mt-2">
//                   <span
//                     className={`text-xs px-2 py-1 rounded-full ${
//                       brand.status === 1
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {brand.status === 1 ? "Active" : "Inactive"}
//                   </span>
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <button
//                       className="hover:text-blue-600"
//                       onClick={() => {
//                         setEditBrand(brand);
//                         setCreateOpen(true);
//                       }}
//                       aria-label="Edit"
//                     >
//                       <IconEdit size={16} />
//                     </button>
//                     <button
//                       className="hover:text-red-600"
//                       onClick={() => {
//                         setDeleteTargetIds([brand._id]);
//                         setDeleteOpen(true);
//                       }}
//                       aria-label="Delete"
//                     >
//                       <IconTrash size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/*  Pagination Controls */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-4 mt-8">
//               <button
//                 className="px-3 py-2 rounded-lg border text-sm flex items-center gap-1 disabled:opacity-50"
//                 onClick={() => setPage((p) => Math.max(p - 1, 1))}
//                 disabled={page === 1}
//               >
//                 <IconChevronLeft size={18} /> Previous
//               </button>
//               <span className="text-sm text-gray-700">
//                 Page {page} of {totalPages}
//               </span>
//               <button
//                 className="px-3 py-2 rounded-lg border text-sm flex items-center gap-1 disabled:opacity-50"
//                 onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//                 disabled={page === totalPages}
//               >
//                 Next <IconChevronRight size={18} />
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       <BrandFormModal
//         title={editBrand ? "Edit Brand" : "Add New Brand"}
//         isOpen={createOpen}
//         onClose={() => setCreateOpen(false)}
//         onSubmit={handleSubmit}
//         onSuccess={() => {
//           setCreateOpen(false);
//           fetchBrands();
//         }}
//         defaultValues={editBrand}
//       />

//       <ConfirmDeleteModal
//         isOpen={deleteOpen}
//         onClose={() => setDeleteOpen(false)}
//         onConfirm={handleDeleteConfirmed}
//         title="Confirm Delete"
//         message={`Are you sure you want to delete ${
//           deleteTargetIds?.length ?? 0
//         } brand(s)?`}
//       />

//       {previewImage && (
//         <div
//           className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
//           onClick={() => setPreviewImage(null)}
//         >
//           <div className="relative bg-white p-3 rounded-xl max-w-3xl w-full">
//             <button
//               className="absolute cursor-pointer top-2 right-2 text-gray-600 hover:text-red-500"
//               onClick={() => setPreviewImage(null)}
//               aria-label="Close preview"
//             >
//               <IconX size={20} />
//             </button>
//             <img
//               src={server_url + previewImage}
//               alt="Preview"
//               className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
