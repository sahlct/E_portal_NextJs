"use client"

import { Suspense } from "react"
import { CartPageContent } from "@/components/cart/cart-page"

export default function CartPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading cart...</div>}>
      <CartPageContent />
    </Suspense>
  )
}
