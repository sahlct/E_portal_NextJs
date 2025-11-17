"use client"

import Link from "next/link"

interface ProductCardProps {
  product: {
    _id: string
    product_sku_name: string
    thumbnail_image?: string
    price: number
    mrp: number
    is_out_of_stock: boolean
    product_id: { product_name: string }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/product/${product._id}`}>
        <div className="relative h-48 bg-secondary overflow-hidden group">
          <img
            src={product.thumbnail_image || "/placeholder.svg"}
            alt={product.product_sku_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {product.is_out_of_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
          {product.product_sku_name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          {product.product_id?.product_name}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-primary">
            ₹{product.price.toLocaleString()}
          </span>
          {product.mrp > product.price && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.mrp.toLocaleString()}
            </span>
          )}
        </div>

        <Link
          href={`/product/${product._id}`}
          className="block w-full text-center bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
