"use client";

import { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Trash2,
  Star,
} from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useCart } from "@/context/cart-context";
import { slugify } from "@/lib/slugify";

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  description?: string;
  image: string;
  category: string;
  rating?: number;
  sku: string;
}

interface Props {
  products: Product[];

  // 🔹 NEW (optional)
  showViewMore?: boolean;
  viewMoreHref?: string;
  viewMoreText?: string;
}

export function ProductSlider({
  products,
  showViewMore = false,
  viewMoreHref,
  viewMoreText = "View More",
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart, removeFromCart, items } = useCart();
  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

  const [showArrows, setShowArrows] = useState({
    left: false,
    right: false,
  });

  // ----------------------------
  // CHECK SCROLL POSITION
  // ----------------------------
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const canScrollLeft = el.scrollLeft > 2;
    const canScrollRight =
      el.scrollLeft + el.clientWidth < el.scrollWidth - 2;

    if (window.innerWidth >= 1024) {
      setShowArrows({ left: canScrollLeft, right: canScrollRight });
    } else {
      setShowArrows({ left: false, right: canScrollRight });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [products]);

  // ----------------------------
  // SCROLL HANDLER (UNCHANGED)
  // ----------------------------
  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const isMobile = window.innerWidth < 768;

    const cardWidth = isMobile ? el.clientWidth * 0.7 : 270;
    const gap = isMobile ? 20 : 24;
    const scrollAmount = isMobile
      ? cardWidth + gap
      : (cardWidth + gap) * 2;

    gsap.to(el, {
      scrollLeft:
        dir === "left"
          ? el.scrollLeft - scrollAmount
          : el.scrollLeft + scrollAmount,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: checkScroll,
      onComplete: checkScroll,
    });
  };

  return (
    <div className="relative w-full py-2">
      <div className="">
        {/* LEFT ARROW */}
        {showArrows.left && (
          <button
            onClick={() => scroll("left")}
            className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2
              bg-white p-3 rounded-full shadow-md cursor-pointer z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* RIGHT ARROW */}
        {showArrows.right && (
          <button
            onClick={() => scroll("right")}
            className="flex absolute right-3 top-1/2 -translate-y-1/2
              bg-white p-3 rounded-full shadow-md cursor-pointer z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* SCROLL CONTAINER (UNCHANGED) */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="
            flex gap-2 md:gap-8
            overflow-x-auto hide-scrollbar
            scroll-smooth
            pb-3
            px-4 md:px-0
            snap-x snap-mandatory
          "
        >
          {/* ================= PRODUCTS (UNCHANGED) ================= */}
          {products.map((p) => {
            const isInCart = items.some((i) => i.id === p.id);

            return (
              <div
                key={p.id}
                className="
                  snap-start flex-shrink-0
                  max-w-40 sm:min-w-[45vw] md:min-w-[250px]
                  bg-white rounded-xl
                  px-2 pt-2
                "
              >
                <Link href={`/public/products/${slugify(p.sku)}`}>
                  <div className="h-36 md:h-52 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={server_url + p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition duration-300 hover:scale-110"
                    />
                  </div>
                </Link>

                <div className="py-3">
                  <Link href={`/public/products/${slugify(p.sku)}`}>
                    <h3 className="font-medium text-sm mb-1 line-clamp-1 hover:text-blue-600">
                      {p.title}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 fill-current ${
                            star <= (p.rating || 4)
                              ? "text-yellow-500"
                              : "text-yellow-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs ms-2">
                        {p.rating || "4.5"}
                      </span>
                    </div>
                  </Link>

                  <div className="flex md:items-center flex-col-reverse md:flex-row md:gap-2 gap-1 mt-3 font-notosans">
                    <span className="font-semibold text-blue-700 md:text-lg text-md">
                      AED {p.price}
                    </span>
                    {p.originalPrice && (
                      <span className="line-through text-gray-400 md:text-sm text-xs">
                        AED {p.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      isInCart
                        ? removeFromCart(p.id)
                        : addToCart({
                            id: p.id,
                            title: p.title,
                            price: p.price,
                            image: p.image,
                            category: p.category,
                          })
                    }
                    className={`
                      w-full md:mt-4 mt-2 flex items-center justify-center gap-2
                      py-2 rounded-lg text-sm font-semibold transition cursor-pointer
                      ${
                        isInCart
                          ? "bg-gradient-to-r from-red-900 to-red-500 text-white"
                          : "bg-gradient-to-r from-yellow-500 to-orange-400 text-white"
                      }
                    `}
                  >
                    {isInCart ? (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Remove from Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {/* ================= VIEW MORE (NEW, SAFE) ================= */}
          {showViewMore && viewMoreHref && (
            <Link href={viewMoreHref}>
              <div
                className="
                  snap-start flex-shrink-0
                  max-w-40 sm:min-w-[45vw] md:min-w-[250px]
                  bg-gray-200 h-full rounded-xl
                  px-20 pt-2
                  flex items-center justify-center
                  cursor-pointer hover:bg-gray-300 transition
                "
              >
                <span className="text-sm font-semibold text-gray-700">
                  {viewMoreText}
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
