"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { brands } from "@/lib/dummy-data"

export function BrandsMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!marqueeRef.current) return

    const marquee = marqueeRef.current
    const marqueeContent = marquee.querySelector(".marquee-content") as HTMLElement

    if (!marqueeContent) return

    // Clone content for seamless loop
    const clone = marqueeContent.cloneNode(true)
    marquee.appendChild(clone)

    gsap.to(".marquee-content", {
      x: -marqueeContent.offsetWidth,
      duration: 40,
      ease: "none",
      repeat: -1,
    })
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Top Brands</h2>
      <div ref={marqueeRef} className="overflow-hidden bg-secondary rounded-lg py-6">
        <div className="marquee-content flex gap-16 px-8 whitespace-nowrap">
          {brands.map((brand) => (
            <div key={brand.id} className="flex-shrink-0 flex items-center justify-center">
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                className="h-10 object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
