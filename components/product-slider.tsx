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
import { IconStar } from "@tabler/icons-react";

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
}

interface Props {
  products: Product[];
}

export function ProductSlider({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart, removeFromCart, items } = useCart();

  const [showArrows, setShowArrows] = useState({
    left: false,
    right: false,
  });

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    if (window.innerWidth >= 1024) {
      const canScrollLeft = el.scrollLeft > 2; // exact check now works
      const canScrollRight =
        el.scrollLeft + el.clientWidth < el.scrollWidth - 2;

      setShowArrows({
        left: canScrollLeft,
        right: canScrollRight,
      });
    } else {
      setShowArrows({ left: false, right: false });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [products]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = 270;
    const gap = 24;
    const scrollAmount = (cardWidth + gap) * 2;

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
      {/* OUTER WRAPPER WITH PADDING (keeps arrows off padding) */}
      <div className="md:px-10">
        {/* LEFT ARROW */}
        {showArrows.left && (
          <button
            onClick={() => scroll("left")}
            className="
              hidden lg:flex 
              absolute left-3 top-1/2 -translate-y-1/2
              bg-white p-3 rounded-full shadow-md hover:bg-gray-100
              cursor-pointer z-20
            "
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* RIGHT ARROW */}
        {showArrows.right && (
          <button
            onClick={() => scroll("right")}
            className="
              hidden lg:flex 
              absolute right-3 top-1/2 -translate-y-1/2
              bg-white p-3 rounded-full shadow-md hover:bg-gray-100
              cursor-pointer z-20
            "
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* SCROLL CONTAINER WITHOUT PADDING */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="
            flex md:gap-10 gap-5
            overflow-x-auto hide-scrollbar 
            scroll-smooth
            pb-3
            snap-x snap-mandatory
          "
        >
          {products.map((p) => {
            const isInCart = items.some((i) => i.id === p.id);

            return (
              <div
                key={p.id}
                className="
                  snap-start
                  flex-shrink-0 
                  w-[250px]
                  rounded-xl
                  transition
                  gap-2 bg-white px-2 pt-2
                "
              >
                <Link href={`/public/products/${p.id}`}>
                  <div className="h-52 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={p.image}
                      className="w-full h-full object-cover hover:scale-110 transition duration-300"
                    />
                  </div>
                </Link>

                <div className="py-4">
                  <Link href={`/public/products/${p.id}`}>
                    <h3 className="font-medium text-sm mb-1 line-clamp-2 hover:text-blue-600 font-notosans">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 fill-current ${
                              star <= p.rating
                                ? "text-yellow-500"
                                : "text-yellow-300"
                            }`}
                          />
                        ))}
                        <span className="text-xs ms-3">
                          {p?.rating || "4.5/5"}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <p className="text-xs text-gray-500 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex gap-2 items-center mt-3">
                    <span className="font-bold text-blue-700 text-lg font-notosans">
                      AED {p.price}
                    </span>
                    {p.originalPrice && (
                      <span className="line-through text-gray-400 text-sm font-notosans">
                        AED {p.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (isInCart) removeFromCart(p.id);
                      else
                        addToCart({
                          id: p.id,
                          title: p.title,
                          price: p.price,
                          image: p.image,
                          category: p.category,
                        });
                    }}
                    className={`
                      w-full mt-4 flex items-center gap-2 justify-center
                      text-sm font-semibold py-2 rounded-lg cursor-pointer transition
                      ${
                        isInCart
                          ? "bg-gradient-to-r from-red-900 to-red-500 text-white hover:bg-red-600"
                          : "bg-gradient-to-r from-yellow-500 to-orange-400 text-white hover:opacity-90"
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
        </div>
      </div>
    </div>
  );
}
