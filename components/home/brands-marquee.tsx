"use client"

import Marquee from "react-fast-marquee"
import { brands } from "@/lib/dummy-data"

export function BrandsMarquee() {
  // If brands may be undefined or empty, provide a safe fallback
  const items = Array.isArray(brands) && brands.length ? brands : [
    // optional example fallback — you can remove these lines if brands always exists
    { id: "example-1", name: "Example", logo: "/placeholder.svg" },
    { id: "example-2", name: "Example 2", logo: "/placeholder.svg" },
    { id: "example-3", name: "Example 3", logo: "/placeholder.svg" },
  ]

  return (
    <section className="max-w-8xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Top Brands</h2>

      <div className="bg-white rounded-lg py-6 overflow-hidden">
        {/* react-fast-marquee ensures a single horizontal row */}
        <Marquee
          pauseOnHover
          speed={80}
          gradient={true}        // disables left/right fade so logos are fully visible
          direction="left"
          // optionally: play={true} // default is true
        >
          <div className="flex items-center space-x-16 whitespace-nowrap">
            {items.map((brand) => (
              <div
                key={brand.id}
                className="flex-shrink-0 flex items-center justify-center"
                aria-label={brand.name || "brand"}
              >
                <img
                  src={brand.logo || "/placeholder.svg"}
                  alt={brand.name || ""}
                  className="h-10 sm:h-12 md:h-14 object-contain transition-opacity"
                  draggable={false}
                  // prevent image drag from interrupting marquee
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  )
}
