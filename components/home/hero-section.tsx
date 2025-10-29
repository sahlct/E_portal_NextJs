"use client"

import { useEffect } from "react"
import gsap from "gsap"

export function HeroSection() {
  useEffect(() => {
    gsap.fromTo(".hero-content", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="hero-content grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-4 text-balance">Premium Electronics & Gadgets</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover the latest technology from top brands. Quality products at competitive prices.
          </p>
          <div className="flex gap-4">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Shop Now
            </button>
            <button className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <img src="/modern-laptop-workspace.png" alt="Hero" className="rounded-lg shadow-lg max-w-md w-full" />
        </div>
      </div>
    </section>
  )
}
