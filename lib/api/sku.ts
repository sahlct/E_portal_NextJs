import apiRequest from "@/lib/apiRequest";

// List SKUs
export async function getProductSkus(
  page = 1,
  limit = 10,
  search?: string,
  status?: string,
  product_id?: string
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (product_id) params.append("product_id", product_id);

  return apiRequest(`/api/product-sku?${params.toString()}`, "GET");
}

// Get single SKU
export async function getProductSkuById(id: string) {
  return apiRequest(`/api/product-sku/${id}`, "GET");
}

// Create SKU (with variation)
export async function createProductSkuWithVariation(formData: FormData) {
  return apiRequest("/api/product-sku/with-variation", "POST", formData, true);
}

// Update SKU (with variation)
export async function updateProductSkuWithVariation(id: string, formData: FormData) {
  return apiRequest(`/api/product-sku/with-variation/${id}`, "PUT", formData, true);
}

// Delete SKU
export async function deleteProductSku(id: string) {
  return apiRequest(`/api/product-sku/${id}`, "DELETE");
}
