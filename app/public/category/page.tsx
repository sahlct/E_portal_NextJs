"use client"

import { Suspense } from "react"
import { CategoryDetailPage } from "@/components/products/category-detail-page"

export default function CategoryDetail() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading category...</div>}>
      <CategoryDetailPage />
    </Suspense>
  )
}
