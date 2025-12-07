"use client";

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { getBrands } from "@/lib/api/brand";

interface Brand {
  _id: string;
  brand_logo: string;
  status: number;
}

export function BrandsMarquee() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await getBrands(1, 100, undefined, 1);
        if (res?.data) setBrands(res.data);
      } catch (err) {
        console.error("❌ Failed to load brands:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  const items =
    Array.isArray(brands) && brands.length > 0
      ? brands
      : [
          { _id: "fallback-1", brand_logo: "/placeholder.svg" },
          { _id: "fallback-2", brand_logo: "/placeholder.svg" },
          { _id: "fallback-3", brand_logo: "/placeholder.svg" },
        ];

  return (
    <section className="w-full bg-[#e9ecf3] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
        <h2 className="text-3xl font-semibold font-quicksand mb-14 text-center text-gray-900 font-notosans">
          Our Trusted Brands
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-8 text-gray-500">
            Loading brands...
          </div>
        ) : (
          <Marquee
            pauseOnHover
            speed={80}
            gradient={true}
            gradientWidth={80}
            gradientColor="#e9ecf3"
          >
            <div className="flex items-center">
              {items.map((brand, index) => (
                <div
                  key={brand._id + index}
                  className="bg-white rounded-2xl px-5 shadow-sm border border-gray-200 
                   w-52 h-32 mx-5 flex items-center justify-center 
                   hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={brand.brand_logo || "/placeholder.svg"}
                    alt="Brand Logo"
                    className="h-16 object-contain hover:scale-110 transition-transform"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </Marquee>
        )}
      </div>
    </section>
  );
}
