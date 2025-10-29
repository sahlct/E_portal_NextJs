"use client"

import { Suspense } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function Admin() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading admin dashboard...</div>}>
      <AdminDashboard />
    </Suspense>
  )
}
