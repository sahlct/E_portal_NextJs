"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/api/category";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  _id: string;
  category_name: string;
  category_image: string;
  status: number;
}

export function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories(1, 100, undefined, 1);
        if (res?.data) setCategories(res.data);
      } catch (err) {
        console.log("❌ Error loading categories", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Arrow Visibility
  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = el.clientWidth * 0.8;

    el.scrollTo({
      left: dir === "left" ? el.scrollLeft - amount : el.scrollLeft + amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateArrows);
    return () => el.removeEventListener("scroll", updateArrows);
  }, []);

  // Group categories into pairs (2 per column)
  const grouped = [];
  for (let i = 0; i < categories.length; i += 2) {
    grouped.push(categories.slice(i, i + 2));
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="md:text-3xl text-2xl font-semibold mb-8 font-notosans">
          Shop by Category
        </h2>

        <div className="relative">
          {/* LEFT ARROW */}
          {showLeft && (
            <button
              onClick={() => scroll("left")}
              className="md:block hidden absolute left-0 top-1/2 -translate-y-1/2 z-30
            bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* SCROLLER */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth no-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {/* Loading Skeleton */}
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[250px] md:min-w-[320px] bg-gray-200 rounded-lg h-80 animate-pulse"
                ></div>
              ))}

            {/* REAL CONTENT — 2 cards per column */}
            {!loading &&
              grouped.map((pair, i) => (
                <div
                  key={i}
                  className="min-w-[250px] md:min-w-[320px]
                           grid grid-rows-2"
                >
                  {pair.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/public/products?category=${cat._id}`}
                      className="w-full border  px-5 py-8 bg-white 
                               flex justify-between items-center 
                               hover:shadow-md transition-all group"
                    >
                      <div>
                        <h3 className="text-lg font-medium font-notosans text-gray-900 group-hover:text-orange-500">
                          {cat.category_name}
                        </h3>
                        <p className="text-gray-500 mt-1 text-sm">
                          Explore items
                        </p>
                      </div>

                      <img
                        src={
                          server_url + cat.category_image || "/placeholder.svg"
                        }
                        className="h-20 w-20 object-contain ml-4"
                        alt={cat.category_name}
                      />
                    </Link>
                  ))}
                </div>
              ))}
          </div>

          {/* RIGHT ARROW */}
          {showRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute hidden md:block right-0 top-1/2 -translate-y-1/2 z-30
            bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
