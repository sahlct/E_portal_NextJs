"use client";

import React from "react";

export default function AdSection() {
  return (
    <section className="max-w-8xl mx-auto md:px-16 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 gap-5 md:h-48">
        <div
          style={{
            backgroundImage:
              "url('https://wordpress.templatetrip.com/WCM003_egudgets/wp-content/uploads/2023/08/banner-01.jpg')",
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat px-4 py-3 md:py-2 flex flex-col justify-center gap-3"
        >
          <div className="bg-yellow-300 md:px-4 px-2 py-1 rounded-xl w-fit">
            <h1 className="text-xs md:text-base">Smart Phones</h1>
          </div>
          <h1 className="md:text-3xl text-2xl md:font-semibold font-medium text-white font-notosans">Premium Phones</h1>
          <h2 className="md:text-lg text-md md:font-medium font-light text-white font-notosans">Starting at AED 399</h2>
        </div>
        <div
          style={{
            backgroundImage:
              "url('https://wordpress.templatetrip.com/WCM003_egudgets/wp-content/uploads/2023/08/banner-02.jpg')",
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat px-4 py-3 md:py-2 flex flex-col justify-center gap-3"
        >
          <div className="bg-yellow-300 md:px-4 px-3 py-1 rounded-xl w-fit">
            <h1 className="text-xs md:text-base">Smart Watches</h1>
          </div>
          <h1 className="md:text-3xl text-2xl md:font-semibold font-medium text-white font-notosans">Galaxy Watch 7</h1>
          <h2 className="md:text-lg text-md md:font-medium font-light font-notosans text-white">Starting at AED 299</h2>
        </div>
        <div
          style={{
            backgroundImage:
              "url('https://wordpress.templatetrip.com/WCM003_egudgets/wp-content/uploads/2023/08/banner-03.jpg')",
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat px-4 py-3 md:py-2 flex flex-col justify-center gap-3"
        >
          <div className="bg-yellow-300 px-4 py-1 rounded-xl w-fit">
            <h1 className="text-xs md:text-base">Cameras</h1>
          </div>
          <h1 className="md:text-3xl text-2xl md:font-semibold font-medium text-white font-notosans">Modern Camera's</h1>
          <h2 className="md:text-lg font-md md:font-medium font-light font-notosans text-white">Starting at AED 599</h2>
        </div>
      </div>
    </section>
  );
}
