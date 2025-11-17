"use client"

import { useEffect, useState } from "react"
import Marquee from "react-fast-marquee"
import { getBrands } from "@/lib/api/brand"

interface Brand {
  _id: string
  brand_logo: string
  status: number
}

export function BrandsMarquee() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ Fetch brands from backend
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

  // ✅ Fallback for empty or error case
  const items =
    Array.isArray(brands) && brands.length > 0
      ? brands
      : [
          { _id: "fallback-1", brand_logo: "/placeholder.svg" },
          { _id: "fallback-2", brand_logo: "/placeholder.svg" },
          { _id: "fallback-3", brand_logo: "/placeholder.svg" },
        ]

  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-14 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Top Brands
      </h2>

      <div className="bg-white rounded-lg py-6 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-8 text-gray-500">
            Loading brands...
          </div>
        ) : (
          <Marquee
            pauseOnHover
            speed={80}
            gradient={true}
            gradientColor={"rgb(255, 255, 255)"}
            direction="left"
          >
            <div className="flex items-center space-x-16 whitespace-nowrap">
              {items.map((brand) => (
                <div
                  key={brand._id}
                  className="flex items-center justify-center"
                  aria-label="Brand logo"
                >
                  <img
                    src={brand.brand_logo || "/placeholder.svg"}
                    alt="Brand logo"
                    className="h-10 sm:h-12 md:h-14 max-w-36 object-contain transition-transform hover:scale-110 duration-300"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
              ))}
            </div>
          </Marquee>
        )}
      </div>
    </section>
  )
}
