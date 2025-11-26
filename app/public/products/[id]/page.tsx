"use client"

import { Suspense } from "react"
import  SingleProductPage  from "@/components/product/page"

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading product...</div>}>
      <SingleProductPage />
    </Suspense>
  )
}
