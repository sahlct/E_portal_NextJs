import apiRequest from "@/lib/apiRequest";

export async function getBlogs(
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

  return apiRequest(`/api/blogs?${params.toString()}`, "GET");
}

export async function getBlogById(id: string) {
  return apiRequest(`/api/blogs/${id}`, "GET");
}

export async function createBlog(formData: FormData) {
  return apiRequest("/api/blogs", "POST", formData, true);
}

export async function updateBlog(id: string, formData: FormData) {
  return apiRequest(`/api/blogs/${id}`, "PUT", formData, true);
}

export async function deleteBlog(id: string) {
  return apiRequest(`/api/blogs/${id}`, "DELETE");
}
