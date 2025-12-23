"use client";

import { useState, useEffect } from "react";
import { Carousel } from "@/components/carousel";
import { ProductSlider } from "@/components/product-slider";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { BrandsMarquee } from "@/components/home/brands-marquee";
import { getProductSkus } from "@/lib/api/sku";
import FeaturesBar from "../featuresBar";
import AdSection from "./adsection";
import TopOfferTicker from "../topofferPicker";
import ListingCategorySliders from "./listingCategorySliders";

export function HomePage() {
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await getProductSkus(
          1,
          10,
          "",
          "1",
          undefined,
          undefined,
          "",
          true
        );
        setLatestProducts(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestProducts();
  }, []);

  return (
    <div>
      <Carousel />
      <FeaturesBar />
      <AdSection />

      {/* Latest Products */}
      <div className="bg-[#f5f5f9]">
        <section className="max-w-8xl mx-auto px-4 md:px-16 md:py-10 py-8 ">
          <h2 className="md:text-3xl text-2xl font-semibold mb-6 font-notosans">
            Latest Products
          </h2>

          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading latest products...
            </div>
          ) : (
            <ProductSlider
              products={latestProducts.map((item) => ({
                id: item._id,
                title: item.product_sku_name,
                description: item.description,
                image: item.thumbnail_image,
                price: item.price,
                originalPrice: item.mrp > item.price ? item.mrp : null,
                category: item.product_id?.category_id || "",
                rating: 4.5,
                sku: item.sku,
              }))}
              showViewMore
              viewMoreText="View All Products"
              viewMoreHref="/public/products"
            />
          )}
        </section>
      </div>
      <TopOfferTicker />
      <CategoriesGrid />

      <BrandsMarquee />
      <ListingCategorySliders />
    </div>
  );
}
