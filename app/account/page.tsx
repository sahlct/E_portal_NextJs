"use client"

import { Suspense } from "react"
import { AccountPage } from "@/components/account/account-page"

export default function Account() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading account...</div>}>
      <AccountPage />
    </Suspense>
  )
}
