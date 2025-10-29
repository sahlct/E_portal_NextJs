"use client"

import Link from "next/link"
import { Star, ShoppingCart, Trash2 } from "lucide-react"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/dummy-data"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, items } = useCart()
  const isInCart = items.some((item) => item.id === product.id)

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 bg-secondary overflow-hidden group">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.originalPrice && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              Sale
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
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
            disabled={!product.inStock}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-opacity flex items-center justify-center gap-2 ${
              isInCart
                ? "bg-red-500 text-white hover:opacity-90 disabled:opacity-50"
                : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
}
