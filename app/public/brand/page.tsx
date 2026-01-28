"use client"

import { Suspense } from "react"
import { BrandDetailPage } from "@/components/products/brand-detail-page"

export default function BrandDetail() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading brand...</div>}>
      <BrandDetailPage />
    </Suspense>
  )
}
