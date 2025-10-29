"use client"

import { Suspense } from "react"
import { SingleProductPage } from "@/components/product/single-product-page"

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading product...</div>}>
      <SingleProductPage productId={params.id} />
    </Suspense>
  )
}
