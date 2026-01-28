import apiRequest from "@/lib/apiRequest";

export async function getInnerCategories(
  page = 1,
  limit = 10,
  search?: string,
  status?: number,
  category_id?: string,
  sub_category_id?: string
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (category_id && typeof category_id === "string" && category_id.length > 0) params.append("category_id", category_id);
  if (sub_category_id && typeof sub_category_id === "string" && sub_category_id.length > 0) params.append("sub_category_id", sub_category_id);

  return apiRequest(`/api/inner-category?${params.toString()}`, "GET");
}

export async function getInnerCategoryById(id: string) {
  return apiRequest(`/api/inner-category/${id}`, "GET");
}

export async function createInnerCategory(formData: FormData) {
  return apiRequest("/api/inner-category", "POST", formData, true);
}

export async function updateInnerCategory(id: string, formData: FormData) {
  return apiRequest(`/api/inner-category/${id}`, "PUT", formData, true);
}

export async function deleteInnerCategory(id: string) {
  return apiRequest(`/api/inner-category/${id}`, "DELETE");
}
