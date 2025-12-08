"use client";

import { useState, useEffect } from "react";
import { Carousel } from "@/components/carousel";
import { HeroSection } from "@/components/home/hero-section";
import { ProductSlider } from "@/components/product-slider";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { BrandsMarquee } from "@/components/home/brands-marquee";
import { getProductSkus } from "@/lib/api/sku";
import ListingCategorySliders from "./listingCategorySliders";
import FeaturesBar from "../featuresBar";
import AdSection from "./adsection";
import TopOfferTicker from "../topofferPicker";

export function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  //  Fetch latest products from backend
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);
        const res = await getProductSkus(1, 10, "", "1", undefined, undefined, true);
        setLatestProducts(res?.data || []);
      } catch (err) {
        console.error("Error fetching latest products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestProducts();
  }, []);

  if (!mounted) return null;

  return (
    <div>
      {/* Carousel */}
      <Carousel />

      <FeaturesBar />

      {/* Hero Section */}
      <HeroSection />

      {/* Ad Section */}
      <AdSection />

      <TopOfferTicker />

      {/*  Latest Products Section */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 md:py-10 py-8 lg:px-14 bg-[#f5f5f9] mb-0">
        <h2 className="md:text-3xl text-2xl font-semibold mb-6 md:ms-10 font-notosans">Latest Products</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading latest products...</div>
        ) : latestProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No latest products available.</div>
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
              reviews: 12,
              inStock: !item.is_out_of_stock,
            }))}
          />
        )}
      </section>

      {/* Categories Grid */}
      <CategoriesGrid />


      {/* Brands Marquee */}
      <BrandsMarquee />

       <ListingCategorySliders />
    </div>
  );
}
