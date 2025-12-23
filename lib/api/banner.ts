import apiRequest from "@/lib/apiRequest";

export async function getBanners(
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

  return apiRequest(`/api/banners?${params.toString()}`, "GET");
}

export async function getBannerById(id: string) {
  return apiRequest(`/api/banners/${id}`, "GET");
}

export async function createBanner(formData: FormData) {
  return apiRequest("/api/banners", "POST", formData, true);
}

export async function updateBanner(id: string, formData: FormData) {
  return apiRequest(`/api/banners/${id}`, "PUT", formData, true);
}

export async function deleteBanner(id: string) {
  return apiRequest(`/api/banners/${id}`, "DELETE");
}
