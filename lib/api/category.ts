import apiRequest from "@/lib/apiRequest";

// ✅ Get all categories
export async function getCategories(
  page = 1,
  limit = 10,
  search?: string,
  status?: number,
  is_listing?: string
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (is_listing !== undefined) params.append("is_listing", is_listing);

  return apiRequest(`/api/categories?${params.toString()}`, "GET");
}

// ✅ Get single category by ID
export async function getCategoryById(id: string) {
  return apiRequest(`/api/categories/${id}`, "GET");
}

// ✅ Create new category
export async function createCategory(formData: FormData) {
  return apiRequest("/api/categories", "POST", formData, true);
}

// ✅ Update existing category
export async function updateCategory(id: string, formData: FormData) {
  return apiRequest(`/api/categories/${id}`, "PUT", formData, true);
}

// ✅ Delete category
export async function deleteCategory(id: string) {
  return apiRequest(`/api/categories/${id}`, "DELETE");
}
