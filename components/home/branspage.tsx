"use client"

import { useEffect, useState } from "react"
import { getBrands } from "@/lib/api/brand"

interface Brand {
  _id: string
  brand_logo: string
  status: number
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  //  Fetch brands from backend
  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await getBrands(1, 100, undefined, 1) 
        if (res?.data) setBrands(res.data)
      } catch (err) {
        console.error("❌ Failed to load brands:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  //  Loading state (skeleton)
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-semibold mb-4 font-notosans">Our Brands</h1>
          <p className="text-muted-foreground mb-8">
            Shop from the world's leading technology brands
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg h-32 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  //  No data case
  if (brands.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-4">Our Brands</h1>
          <p className="text-muted-foreground mb-8">
            Shop from the world's leading technology brands
          </p>
          <p className="text-center text-muted-foreground mt-16">
            No brands available.
          </p>
        </div>
      </div>
    )
  }

  //  Display actual brand logos
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-4">Our Brands</h1>
        <p className="text-muted-foreground mb-8">
          Shop from the world's leading technology brands
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="bg-card rounded-lg p-6 border border-border flex items-center justify-center h-32 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <img
                src={brand.brand_logo || "/placeholder.svg"}
                alt="Brand Logo"
                className="h-16 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
