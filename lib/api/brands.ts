import apiRequest from "@/lib/apiRequest";

export async function getBrands(
  page = 1,
  limit = 10,
  search?: string,
  status?: number
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));

  return apiRequest(`/api/brands?${params.toString()}`, "GET");
}

export async function getBrandById(id: string) {
  return apiRequest(`/api/brands/${id}`, "GET");
}

export async function createBrand(formData: FormData) {
  return apiRequest("/api/brands", "POST", formData, true);
}

export async function updateBrand(id: string, formData: FormData) {
  return apiRequest(`/api/brands/${id}`, "PUT", formData, true);
}

export async function deleteBrand(id: string) {
  return apiRequest(`/api/brands/${id}`, "DELETE");
}
