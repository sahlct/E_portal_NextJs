"use client"

import { Suspense } from "react"
import { ProductsPage } from "@/components/products/products-page"

export default function Products() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading products...</div>}>
      <ProductsPage />
    </Suspense>
  )
}
