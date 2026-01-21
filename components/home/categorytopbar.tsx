"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/api/category";
import { getSubCategories } from "@/lib/api/subCategory";
import { slugify } from "@/lib/slugify";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconChevronRight } from "@tabler/icons-react";

interface Category {
  _id: string;
  category_name: string;
  category_image: string;
  status: number;
}

interface SubCategory {
  _id: string;
  sub_category_name: string;
  category_id: string;
}

export default function CategoryTopbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // dropdown state (IMPORTANT FIX)
  const [dropdown, setDropdown] = useState<{
    category: Category | null;
    rect: DOMRect | null;
  }>({ category: null, rect: null });

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL || "";

  // ---------------- FETCH CATEGORIES ----------------
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories(1, 100, undefined, 1);
        if (res?.data) setCategories(res.data);
      } catch (err) {
        console.error("❌ Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // ---------------- FETCH SUBCATEGORIES ----------------
  useEffect(() => {
    if (!hoveredCategoryId) {
      setSubCategories([]);
      return;
    }

    async function fetchSubCategories() {
      try {
        const res = await getSubCategories(
          1,
          100,
          undefined,
          1,
          String(hoveredCategoryId),
        );
        if (res?.data) setSubCategories(res.data);
      } catch (err) {
        console.error("❌ Error loading subcategories:", err);
      }
    }

    fetchSubCategories();
  }, [hoveredCategoryId]);

  // ---------------- SCROLL LOGIC ----------------
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setShowLeft(el.scrollLeft > 5);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    if (categories.length) {
      setTimeout(checkScroll, 50);
    }
  }, [categories]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  // ---------------- DROPDOWN HANDLERS ----------------
  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    category: Category,
  ) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setDropdown({ category, rect });
    setHoveredCategoryId(category._id);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setDropdown({ category: null, rect: null });
      setHoveredCategoryId(null);
    }, 150);
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="w-full bg-white border-b px-4 py-4 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  // ---------------- JSX ----------------
  return (
    <div className="w-full bg-white border-b relative">
      <div className="px-4 py-3">
        <div className="relative">
          {/* LEFT ARROW (DESKTOP ONLY) */}
          {showLeft && (
            <button
              onClick={() => scroll("left")}
              className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10
              bg-white/90 p-1 rounded-full shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* CATEGORY SCROLL */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="
              flex gap-4 md:gap-8
              overflow-x-auto
              hide-scrollbar
              pb-2
              touch-pan-x
              justify-start
              sm:justify-center
            "
          >
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex-shrink-0"
                onMouseEnter={(e) => handleMouseEnter(e, category)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col items-center gap-2 cursor-pointer">
                  <div
                    className="
                      w-16 h-16 sm:w-20 sm:h-20
                      bg-gradient-to-br from-blue-100 to-yellow-100
                      rounded-lg overflow-hidden
                      border border-gray-200
                      shadow-sm hover:shadow-md
                      flex items-center justify-center
                    "
                  >
                    {category.category_image ? (
                      <img
                        src={server_url + category.category_image}
                        alt={category.category_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-400">
                        {category.category_name[0]}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] sm:text-xs font-medium text-gray-700 text-center max-w-[80px] line-clamp-1">
                    {category.category_name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT ARROW (DESKTOP ONLY) */}
          {showRight && (
            <button
              onClick={() => scroll("right")}
              className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10
              bg-white/90 p-1 rounded-full shadow-md"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* ---------------- FLOATING SUBCATEGORY DROPDOWN ---------------- */}
      {dropdown.category && dropdown.rect && subCategories.length > 0 && (
        <div
          className="hidden sm:block fixed z-[9999]"
          style={{
            top: dropdown.rect.bottom - 15,
            left: dropdown.rect.left,
          }}
          onMouseEnter={() => {
            if (closeTimerRef.current) {
              clearTimeout(closeTimerRef.current);
              closeTimerRef.current = null;
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-xl p-1">
            {subCategories.map((subCat) => (
              <Link
                key={subCat._id}
                href={`/public/products?category=${slugify(
                  dropdown.category!.category_name,
                )}&subCategory=${slugify(subCat.sub_category_name)}`}
                className="
                  flex items-center justify-between
                  px-2 py-1 text-xs
                  text-gray-700
                  hover:bg-blue-50 hover:text-blue-600
                  rounded-md
                "
              >
                <span>{subCat.sub_category_name}</span>
                <IconChevronRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
