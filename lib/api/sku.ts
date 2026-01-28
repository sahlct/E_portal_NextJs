import apiRequest from "@/lib/apiRequest";

// Update multiple SKUs' is_new
export async function updateMultipleSkuIsNew(sku_ids: string[], is_new: boolean) {
  return apiRequest("/api/product-sku/singleEdit/is-new", "PUT", { sku_ids, is_new });
}

//  Existing APIs unchanged
export async function getProductSkus(
  page = 1,
  limit = 10,
  search?: string,
  status?: string,
  product_id?: string,
  category_id?: string,
  sub_category_id?: string,
  inner_category_id?: string,
  brand_id?: string,      
  is_new?: boolean
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (product_id && typeof product_id === "string" && product_id.length > 0) params.append("product_id", product_id);
  if (category_id && typeof category_id === "string" && category_id.length > 0) params.append("category_id", category_id);
  if (sub_category_id && typeof sub_category_id === "string" && sub_category_id.length > 0) params.append("sub_category_id", sub_category_id);
  if (inner_category_id && typeof inner_category_id === "string" && inner_category_id.length > 0) params.append("inner_category_id", inner_category_id);
  if (brand_id && typeof brand_id === "string" && brand_id.length > 0) params.append("brand_id", brand_id);
  if (is_new !== undefined) params.append("is_new", String(is_new));

  return apiRequest(`/api/product-sku?${params.toString()}`, "GET");
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  if (!slug) {
    throw new Error("Slug is required");
  }

  return apiRequest(`/api/product-sku/slug/${slug}`, "GET");
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
