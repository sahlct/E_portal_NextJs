"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getBanners } from "@/lib/api/banner";
import { slugify } from "@/lib/slugify";

export default function AdSection() {
  const [banners, setBanners] = useState<any[]>([]);
  const server_url = process.env.NEXT_PUBLIC_SERVER_URL || "";

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await getBanners(1, 3, undefined, 1);
        setBanners(res?.data || []);
      } catch (err) {
        console.error("Failed to load banners", err);
      }
    };

    loadBanners();
  }, []);

  if (!banners.length) return null;

  return (
    <section className="md:px-16 px-4 py-10 pt-0 md:pt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 gap-5 md:h-48 max-w-7xl mx-auto">
        {banners.map((banner) => {
          const categoryName =
            banner.connected_category?.category_name || "";

          const href = categoryName
            ? `/public/products?${slugify(categoryName)}`
            : "#";

          return (
            <Link
              href={href}
              key={banner._id}
              className="block w-full h-full"
            >
              <div
                style={{
                  backgroundImage: `url(${server_url}${banner.banner_image})`,
                }}
                className="w-full h-full bg-cover bg-center bg-no-repeat px-4 py-3 md:py-2 flex flex-col justify-center gap-3 rounded-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                {/* CATEGORY */}
                {categoryName && (
                  <div className="bg-yellow-300 md:px-4 px-2 py-1 rounded-xl w-fit">
                    <h1 className="text-xs md:text-base font-medium">
                      {categoryName}
                    </h1>
                  </div>
                )}

                {/* TITLE */}
                <h1 className="md:text-3xl text-2xl md:font-semibold font-medium text-white font-notosans">
                  {banner.banner_title}
                </h1>

                {/* SUB TITLE */}
                {banner.banner_sub_title && (
                  <h2 className="md:text-lg text-md md:font-medium font-light text-white font-notosans">
                    {banner.banner_sub_title}
                  </h2>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
