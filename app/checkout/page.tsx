"use client"

import { Suspense } from "react"
import { CheckoutPage } from "@/components/checkout/checkout-page"

export default function Checkout() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading checkout...</div>}>
      <CheckoutPage />
    </Suspense>
  )
}
