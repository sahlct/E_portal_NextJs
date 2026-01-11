import apiRequest from "@/lib/apiRequest";

export async function getSubCategories(
  page = 1,
  limit = 10,
  search?: string,
  status?: number,
  category_id?: string
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (category_id) params.append("category_id", category_id);

  return apiRequest(`/api/sub-category?${params.toString()}`, "GET");
}

export async function getSubCategoryById(id: string) {
  return apiRequest(`/api/sub-category/${id}`, "GET");
}

export async function createSubCategory(formData: FormData) {
  return apiRequest("/api/sub-category", "POST", formData, true);
}

export async function updateSubCategory(id: string, formData: FormData) {
  return apiRequest(`/api/sub-category/${id}`, "PUT", formData, true);
}

export async function deleteSubCategory(id: string) {
  return apiRequest(`/api/sub-category/${id}`, "DELETE");
}
