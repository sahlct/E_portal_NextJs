"use client";

import { useEffect, useState } from "react";
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";
import { getCarousels } from "@/lib/api/carousel";

export function Carousel() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  /* ---------- screen detection ---------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---------- fetch slides ---------- */
  useEffect(() => {
    getCarousels(1, 10, undefined, 1)
      .then((res) => setSlides(res?.data || []))
      .catch((err) => console.error("Carousel fetch error:", err));
  }, []);

  /* ---------- embla change listener ---------- */
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  /* ---------- loading fallback ---------- */
  if (!slides.length) {
    return (
      <div className="h-[400px] rounded-lg bg-muted animate-pulse" />
    );
  }

  return (
    <div className="relative">
      <ShadcnCarousel
        opts={{ loop: true }}
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        className="relative w-full h-[400px]"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide._id}>
              <div className="relative w-full h-[400px] overflow-hidden">
                <img
                  src={
                    isMobile
                      ? slide.mobile_file || "/placeholder.svg"
                      : slide.desktop_file || "/placeholder.svg"
                  }
                  alt={slide.title || "Slide"}
                  className="w-full h-full object-cover"
                />

                {/* Overlay content */}
                <div className="absolute inset-0 bg-black/10 flex flex-col justify-center items-center text-center px-6">
                  {slide.title && (
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                      {slide.title}
                    </h2>
                  )}

                  {slide.sub_title && (
                    <p className="text-base sm:text-lg text-white/90 mb-4">
                      {slide.sub_title}
                    </p>
                  )}

                  {slide.description && (
                    <p className="max-w-xl text-sm sm:text-base text-white/80 mb-5">
                      {slide.description}
                    </p>
                  )}

                  {slide.description && (
                    <button className="bg-yellow-600 px-6 py-2 rounded-lg font-semibold text-white hover:opacity-90 transition">
                      Learn More
                    </button>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Desktop arrows only */}
        {!isMobile && (
          <>
            <CarouselPrevious className="left-4 bg-white/80 hover:bg-white cursor-pointer hover:text-black" />
            <CarouselNext className="right-4 bg-white/80 hover:bg-white cursor-pointer hover:text-black" />
          </>
        )}
      </ShadcnCarousel>

      {/* Bottom dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
              current === index
                ? "w-6 bg-white"
                : "w-3 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
