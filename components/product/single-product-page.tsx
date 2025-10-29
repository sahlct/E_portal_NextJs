"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, ShoppingCart, ChevronLeft } from "lucide-react"
import { useProduct } from "@/hooks/use-products"
import { useCart } from "@/context/cart-context"

interface SingleProductPageProps {
  productId: string
}

export function SingleProductPage({ productId }: SingleProductPageProps) {
  const { data: product, isLoading } = useProduct(productId)
  const { addToCart, items } = useCart()
  const [quantity, setQuantity] = useState(1)

  if (isLoading) return <div className="text-center py-12">Loading...</div>
  if (!product) return <div className="text-center py-12">Product not found</div>

  const isInCart = items.some((item) => item.id === product.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/products" className="flex items-center gap-2 text-primary hover:opacity-80 mb-8">
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="bg-secondary rounded-lg overflow-hidden h-96 flex items-center justify-center">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-secondary rounded-lg h-20 flex items-center justify-center cursor-pointer hover:opacity-80"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={`View ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-b border-border pb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-primary">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-2xl text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-green-600 font-semibold">
                  Save ${(product.originalPrice - product.price).toFixed(2)} (
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Specs */}
            {product.specs && (
              <div>
                <h3 className="font-semibold text-lg mb-4">Specifications</h3>
                <div className="space-y-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground capitalize">{key}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
              <span className={product.inStock ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 pt-4">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-secondary transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-2 border-l border-r border-border">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: product.image,
                      category: product.category,
                    })
                  }
                  setQuantity(1)
                }}
                disabled={!product.inStock}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {isInCart ? "Add More to Cart" : "Add to Cart"}
              </button>
            </div>

            {/* Buy Now */}
            <button className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
