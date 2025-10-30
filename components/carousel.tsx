"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import gsap from "gsap"

interface Slide {
  id: string
  title: string
  subtitle: string
  image: string
  cta: string
}

interface CarouselProps {
  slides: Slide[]
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay || slides.length === 0) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoplay, slides.length])

  useEffect(() => {
    const slides_elements = document.querySelectorAll(".carousel-slide")
    slides_elements.forEach((slide, index) => {
      if (index === current) {
        gsap.to(slide, { opacity: 1, duration: 0.8, ease: "power2.inOut" })
      } else {
        gsap.to(slide, { opacity: 0, duration: 0.8, ease: "power2.inOut" })
      }
    })
  }, [current])

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setAutoplay(false)
    setTimeout(() => setAutoplay(true), 10000)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoplay(false)
    setTimeout(() => setAutoplay(true), 10000)
  }

  if (slides.length === 0) {
    return <div className="w-full h-96 bg-secondary rounded-lg" />
  }

  return (
    <div className="relative w-full h-96 overflow-hidden bg-secondary">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`carousel-slide absolute inset-0 transition-opacity duration-500 ${
            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-8">
            <h2 className="text-4xl font-bold text-white mb-2 text-balance">{slide.title}</h2>
            <p className="text-lg text-white/90 mb-6">{slide.subtitle}</p>
            <button className="bg-yellow-600 cursor-pointer text-primary-foreground px-8 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              {slide.cta}
            </button>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-black" />
      </button>
      <button
        onClick={next}
        className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-black" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index)
              setAutoplay(false)
              setTimeout(() => setAutoplay(true), 10000)
            }}
            className={`w-2 h-2 cursor-pointer rounded-full transition-all ${index === current ? "bg-white w-8" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
