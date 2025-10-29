"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import gsap from "gsap"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/dummy-data"

interface ProductSliderProps {
  products: Product[]
}

export function ProductSlider({ products }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const { addToCart, removeFromCart, items } = useCart()

  const checkScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0)
      setCanScrollRight(
        scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10,
      )
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      gsap.to(scrollRef.current, {
        scrollLeft: direction === "left" ? "-=" + scrollAmount : "+=" + scrollAmount,
        duration: 0.6,
        ease: "power2.inOut",
      })
      setTimeout(checkScroll, 600)
    }
  }

  return (
    <div className="relative group">
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Products Container */}
      <div ref={scrollRef} onScroll={checkScroll} className="flex gap-6 overflow-x-auto hide-scrollbar pb-4">
        {products.map((product) => {
          const isInCart = items.some((item) => item.id === product.id)

          return (
            <div
              key={product.id}
              className="flex-shrink-0 w-64 bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative h-48 bg-secondary overflow-hidden group/image">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-300"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Sale
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-primary">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      if (isInCart) {
                        removeFromCart(product.id)
                      } else {
                        addToCart({
                          id: product.id,
                          title: product.title,
                          price: product.price,
                          image: product.image,
                          category: product.category,
                        })
                      }
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-opacity flex items-center justify-center gap-2 ${
                      isInCart
                        ? "bg-red-500 text-white hover:opacity-90"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add
                      </>
                    )}
                  </button>
                  <Link href={`/product/${product.id}`} className="flex-1">
                    <button className="w-full border border-primary text-primary py-2 rounded-lg text-sm font-semibold hover:bg-primary/10 transition-colors">
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
