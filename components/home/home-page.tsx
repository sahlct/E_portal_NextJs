"use client"

import { useState, useEffect } from "react"
import { Carousel } from "@/components/carousel"
import { HeroSection } from "@/components/home/hero-section"
import { ProductSlider } from "@/components/product-slider"
import { CategoriesGrid } from "@/components/home/categories-grid"
import { BrandsMarquee } from "@/components/home/brands-marquee"
import { bannerAds, products } from "@/lib/dummy-data"

export function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const laptops = products.filter((p) => p.category === "laptops")
  const monitors = products.filter((p) => p.category === "monitors")
  const cctvWifi = products.filter((p) => p.category === "cctv" || p.category === "wifi")

  return (
    <div className="space-y-12 pb-12">
      {/* Carousel */}
      <Carousel slides={bannerAds} />

      {/* Hero Section */}
      <HeroSection />

      {/* Recent Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">Recent Products</h2>
        <ProductSlider products={products.slice(0, 8)} />
      </section>

      {/* Categories Grid */}
      <CategoriesGrid />

      {/* Ad Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-primary-foreground flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-2">Exclusive Deals</h3>
            <p className="mb-4">Get up to 40% off on selected items</p>
            <button className="bg-primary-foreground text-primary px-6 py-2 rounded-lg font-semibold w-fit hover:opacity-90 transition-opacity">
              Shop Now
            </button>
          </div>
          <div className="bg-secondary rounded-lg p-8 flex items-center justify-center">
            <img src="/vibrant-tech-event.png" alt="Event" className="rounded-lg" />
          </div>
        </div>
      </section>

      {/* Top Laptops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">Top Laptops</h2>
        <ProductSlider products={laptops} />
      </section>

      {/* Top Monitors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">Top Monitors</h2>
        <ProductSlider products={monitors} />
      </section>

      {/* CCTV & WiFi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">Security & Connectivity</h2>
        <ProductSlider products={cctvWifi} />
      </section>

      {/* Brands Marquee */}
      <BrandsMarquee />
    </div>
  )
}
