"use client";

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { getBrands } from "@/lib/api/brands";

interface Brand {
  _id: string;
  brand_name: string;
  brand_image: string;
  status: number;
}

export function BrandsMarquee() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await getBrands(1, 100, undefined, 1);
        if (res?.data) setBrands(res.data);
      } catch (err) {
        console.error(" Failed to load brands:", err);
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
    <section className="w-full bg-[#e9ecf3] md:py-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
        <h2 className="md:text-3xl text-2xl font-semibold font-quicksand md:mb-14 mb-7 text-center text-gray-900 font-notosans">
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
                  className="bg-white rounded-2xl md:px-5 px-3 shadow-sm border border-gray-200 
                   md:w-52 w-32 md:h-32 h-20 md:mx-5 mx-3 flex items-center justify-center 
                   hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={server_url + brand?.brand_image || "/placeholder.svg"}
                    alt="Brand Logo"
                    className="md:h-16 h-14 object-contain hover:scale-110 transition-transform"
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
