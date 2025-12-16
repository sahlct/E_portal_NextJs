// import apiRequest from "../apiRequest";

// export async function getBrands(
//   page = 1,
//   limit = 100,
//   search?: string,
//   status?: number
// ) {
//   const params = new URLSearchParams({
//     page: String(page),
//     limit: String(limit),
//   });

//   if (search) params.append("search", search);
//   if (status !== undefined) params.append("status", String(status));

//   return apiRequest(`/api/brands?${params.toString()}`, "GET");
// }

// export const createBrands = async (files: File[]) => {
//   const formData = new FormData();
//   files.forEach((file) => {
//     formData.append("brand_logo", file);
//   });
//   return await apiRequest("/api/brands", "POST", formData, true);
// };

// export const deleteMultipleBrands = async (ids: string[]) => {
//   return await apiRequest("/api/brands/delete-multiple", "POST", { ids });
// };

// // ✅ Single API for both activate & deactivate
// export const updateMultipleBrandStatus = async (ids: string[], status: number) => {
//   return await apiRequest("/api/brands/bulk-status", "POST", { ids, status });
// };

// export const getBrandById = async (id: string) => {
//   return await apiRequest(`/api/brands/${id}`, "GET");
// };

// export const updateBrand = async (id: string, data: any) => {
//   const isFormData = data instanceof FormData;
//   return await apiRequest(`/api/brands/${id}`, "PUT", data, isFormData);
// };
