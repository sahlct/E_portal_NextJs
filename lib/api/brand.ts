import apiRequest from "../apiRequest";

// ✅ Get all brands (with pagination, status filter)
export const getBrands = async (page = 1, limit = 10, status?: number) => {
  let url = `/api/brands?page=${page}&limit=${limit}`;
  if (status !== undefined) url += `&status=${status}`;
  return await apiRequest(url, "GET");
};

// ✅ Create new brand(s) (supports multiple images)
export const createBrands = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("brand_logo", file);
  });
  return await apiRequest("/api/brands", "POST", formData, true);
};

// ✅ Delete multiple brands
export const deleteMultipleBrands = async (ids: string[]) => {
  return await apiRequest("/api/brands/delete-multiple", "POST", { ids });
};

// ✅ Activate multiple brands
export const activateMultipleBrands = async (ids: string[]) => {
  return await apiRequest("/api/brands/multiple-active", "POST", { ids });
};

// ✅ Deactivate multiple brands
export const deactivateMultipleBrands = async (ids: string[]) => {
  return await apiRequest("/api/brands/multiple-inactive", "POST", { ids });
};

// ✅ Get single brand details
export const getBrandById = async (id: string) => {
  return await apiRequest(`/api/brands/${id}`, "GET");
};

// ✅ Update a brand (e.g. replace image or change status)
export const updateBrand = async (id: string, data: any) => {
  const isFormData = data instanceof FormData;
  return await apiRequest(`/api/brands/${id}`, "PUT", data, isFormData);
};
