"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/category";
import { getProductSkus } from "@/lib/api/sku";
import { ProductSlider } from "@/components/product-slider";

export default function ListingCategorySliders() {
  const [items, setItems] = useState<{ category: any; products: any[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListingCategories();
  }, []);

  const fetchListingCategories = async () => {
    try {
      setLoading(true);

      // 1️ Get listing categories
      const res = await getCategories(1, 10, "", undefined, "true");

      const categories = res?.data || [];
      if (!categories.length) {
        setItems([]);
        return;
      }

      const result: any[] = [];

      // 2️ Load SKUs for each category
      for (const cat of categories) {
        const skuRes = await getProductSkus(
          1,
          15,
          "",
          "1", // only active SKUs
          undefined,
          cat._id // category_id
        );

        const skus = skuRes?.data || [];

        result.push({
          category: cat,
          products: skus.map((item: any) => ({
            id: item._id,
            title: item.product_sku_name,
            description: item.description,
            image: item.thumbnail_image,
            price: item.price,
            originalPrice: item.mrp > item.price ? item.mrp : null,
            category: item.product_id?.category_id || "",
            rating: 4.5,
            reviews: 12,
            inStock: !item.is_out_of_stock,
          })),
        });
      }

      setItems(result);
    } catch (err) {
      console.error("Error loading listing category sliders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">Loading products...</div>
    );

  if (!items.length)
    return (
      <div className="text-center py-10 text-gray-500">
        No categories available for listing.
      </div>
    );

  return (
    <div className="">
      {items.map((block, index) => (
        <section
          key={index}
          className="max-w-8xl mx-auto px-4 sm:px-6 md:py-10 py-5 lg:px-16 bg-[#f5f5f9]"
        >
          <h2 className="md:text-3xl text-2xl font-semibold mb-6  font-notosans">
            {block.category.category_name}
          </h2>

          <ProductSlider
            products={block.products}
            showViewMore
            viewMoreText="View All Products"
            viewMoreHref="/public/products"
          />
        </section>
      ))}
    </div>
  );
}
