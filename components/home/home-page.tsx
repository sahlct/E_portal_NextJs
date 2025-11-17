"use client";

import { useState, useEffect } from "react";
import { Carousel } from "@/components/carousel";
import { HeroSection } from "@/components/home/hero-section";
import { ProductSlider } from "@/components/product-slider";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { BrandsMarquee } from "@/components/home/brands-marquee";
import { getProductSkus } from "@/lib/api/sku";

export function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch latest products from backend
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
    <div className="space-y-12 pb-12">
      {/* Carousel */}
      <Carousel />

      {/* Hero Section */}
      <HeroSection />

      {/* ✅ Latest Products Section */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 py-10 lg:px-14 bg-yellow-50 mb-0">
        <h2 className="text-3xl font-semibold mb-6 ms-10">Latest Products</h2>
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

      {/* Ad Section */}
      <section className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 text-primary-foreground flex flex-col justify-center" style={{backgroundImage: "url(https://cd9941cc.delivery.rocketcdn.me/wp-content/uploads/2024/10/Cleartrip-Flight-Bookings-Discount-Offer-with-RBL-BoB-and-Yes-Bank-Credit-Cards.webp)", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"}}>
            {/* <h3 className="text-2xl font-bold mb-2">Exclusive Deals</h3>
            <p className="mb-4">Get up to 40% off on selected items</p>
            <button className="bg-primary-foreground text-primary px-6 py-2 rounded-lg font-semibold w-fit hover:opacity-90 transition-opacity">
              Shop Now
            </button> */}
          </div>
          <div className="bg-secondary flex items-center justify-center">
            <img src="https://images.hindustantimes.com/img/2022/09/22/1600x900/BBD_1663828892711_1663828901583_1663828901583.png" alt="Event" className="" />
          </div>
        </div>
      </section>

      {/* Brands Marquee */}
      <BrandsMarquee />
    </div>
  );
}
