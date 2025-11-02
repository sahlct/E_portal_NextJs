import apiRequest from "@/lib/apiRequest";

export async function getCarousels(
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

  return apiRequest(`/api/carousel?${params.toString()}`, "GET");
}

export async function getCarouselById(id: string) {
  return apiRequest(`/api/carousel/${id}`, "GET");
}

export async function createCarousel(formData: FormData) {
  return apiRequest("/api/carousel", "POST", formData, true);
}

export async function updateCarousel(id: string, formData: FormData) {
  return apiRequest(`/api/carousel/${id}`, "PUT", formData, true);
}

export async function deleteCarousel(id: string) {
  return apiRequest(`/api/carousel/${id}`, "DELETE");
}
