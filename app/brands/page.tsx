"use client"

import { brands } from "@/lib/dummy-data"

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-4">Our Brands</h1>
        <p className="text-muted-foreground mb-8">Shop from the world's leading technology brands</p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-card rounded-lg p-6 border border-border flex items-center justify-center h-32 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <img src={brand.logo || "/placeholder.svg"} alt={brand.name} className="h-16 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
