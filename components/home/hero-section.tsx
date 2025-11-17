"use client"

import { useEffect } from "react"
import gsap from "gsap"

export function HeroSection() {
  useEffect(() => {
    gsap.fromTo(".hero-content", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
  }, [])

  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-28 py-8 lg:py-20">
      <div className="hero-content grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4 text-balance">EA Portal - The Complete Electronic Makkah</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover the latest technology from top brands. Quality products at competitive prices. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem, sapiente inventore aliquam porro placeat quis totam odit earum iusto quia velit beatae perferendis exercitationem, cum impedit suscipit labore modi nemo.
          </p>
          <div className="flex gap-4">
            <button className="bg-yellow-600 cursor-pointer text-primary-foreground px-8 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Shop Now
            </button>
            <button className="border-2 border-yellow-600/80 text-yellow-600 px-8 py-2 rounded-lg font-semibold hover:bg-yellow-500/10 cursor-pointer transition-colors">
              Learn More
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <img src="/about_pic.jpg" alt="Hero" className="rounded-lg shadow-lg max-w-lvh w-full" />
        </div>
      </div>
    </section>
  )
}
