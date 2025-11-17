"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { getCarousels } from "@/lib/api/carousel";

export function Carousel() {
  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detect screen size to show mobile/desktop image
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // ✅ Fetch carousel data from backend
  useEffect(() => {
    async function fetchCarousels() {
      try {
        const res = await getCarousels(1, 10, undefined, 1); // ✅ /api/carousel?page=1&limit=10&status=1
        if (res?.data) {
          setSlides(res.data);
        }
      } catch (err) {
        console.error("❌ Failed to load carousel:", err);
      }
    }
    fetchCarousels();
  }, []);

  // ✅ Auto-play functionality
  useEffect(() => {
    if (!autoplay || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplay, slides.length]);

  // ✅ GSAP fade animation
  useEffect(() => {
    const slidesElements = document.querySelectorAll(".carousel-slide");
    slidesElements.forEach((slide, index) => {
      if (index === current) {
        gsap.to(slide, { opacity: 1, duration: 0.8, ease: "power2.inOut" });
      } else {
        gsap.to(slide, { opacity: 0, duration: 0.8, ease: "power2.inOut" });
      }
    });
  }, [current]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  // ✅ Fallback while loading
  if (slides.length === 0) {
    return (
      <div className="w-full h-[450px] bg-gray-200 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="relative w-full h-[460px] overflow-hidden bg-secondary mb-0">
      {/* Slides  */}
      {slides.map((slide, index) => (
        <div
          key={slide._id}
          className={`carousel-slide absolute inset-0 transition-opacity duration-500 ${
            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={
              isMobile
                ? slide.mobile_file || "/placeholder.svg"
                : slide.desktop_file || "/placeholder.svg"
            }
            alt={slide.title || "Carousel Slide"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10 flex flex-col justify-center items-center p-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {slide.title}
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-4">
              {slide.sub_title}
            </p>
            {slide.description && (
              <>
                <p className="text-sm sm:text-base text-white/80 max-w-xl mb-4">
                  {slide.description}
                </p>
                <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Learn More
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-black" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-black" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index);
              setAutoplay(false);
              setTimeout(() => setAutoplay(true), 10000);
            }}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
              index === current ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
