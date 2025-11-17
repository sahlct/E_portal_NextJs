import apiRequest from "@/lib/apiRequest";

// List products
export async function getProducts(
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

  return apiRequest(`/api/products?${params.toString()}`, "GET");
}

// Get single product
export async function getProductById(id: string) {
  return apiRequest(`/api/products/${id}`, "GET");
}

// Create product (with variations)
export async function createProductWithVariation(formData: FormData) {
  return apiRequest("/api/products/with-variation", "POST", formData, true);
}

// Get variations by product id
export async function getVariations(productId: string) {
  return apiRequest(`/api/products/get-variations/${productId}`, "GET");
}

// Update product (with variations)
export async function updateProductWithVariation(id: string, formData: FormData) {
  return apiRequest(`/api/products/with-variation/${id}`, "PUT", formData, true);
}

// Delete product
export async function deleteProduct(id: string) {
  return apiRequest(`/api/products/${id}`, "DELETE");
}
