"use client";

import { useEffect } from "react";
import gsap from "gsap";

export function HeroSection() {
  useEffect(() => {
    gsap.fromTo(
      ".hero-content",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="md:py-10">
      <section className="max-w-7xl mx-auto ">
        <div className="hero-content grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-5 items-center">
          {/* IMAGE - first on mobile, second on desktop */}
          <div className="flex justify-center order-1 md:order-2">
            <img
              src="/about_pic.jpg"
              alt="Hero"
              className="rounded-lg shadow-lg w-full max-w-md"
            />
          </div>

          {/* CONTENT - second on mobile, first on desktop */}
          <div className="order-2 md:order-1">
            <h1 className="md:text-4xl text-2xl md:font-bold font-semibold md:mb-4 mb-3 font-notosans">
              EA Portel - The Complete Electronic Souqe
            </h1>

            <p className="md:text-lg text-md text-muted-foreground mb-6">
              Discover the latest technology from top brands. Quality products
              at competitive prices. Lorem ipsum, dolor sit amet consectetur
              adipisicing elit. Autem, sapiente inventore aliquam porro placeat
              quis totam odit earum iusto quia velit beatae perferendis
              exercitationem, cum impedit suscipit labore modi nemo.
            </p>

            <div className="flex gap-4 md:gap-8 flex-wrap justify-start">
              <button className="bg-yellow-400 cursor-pointer md:px-8 px-6 md:py-2 py-1 border-2 border-yellow-400  rounded-lg font-semibold hover:opacity-90 transition-opacity text-white hover:bg-white hover:text-yellow-400">
                Shop Now
              </button>
              <button className="border-2 border-yellow-400 text-yellow-400 md:px-8 px-6 md:py-2 py-1 rounded-lg font-semibold hover:bg-yellow-400 hover:text-white cursor-pointer transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
