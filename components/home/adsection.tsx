"use client";

import React from "react";

export default function AdSection() {
  return (
    <section className="max-w-8xl mx-auto px-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 h-48">
        <div
          style={{
            backgroundImage:
              "url('https://wordpress.templatetrip.com/WCM003_egudgets/wp-content/uploads/2023/08/banner-01.jpg')",
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat px-4 py-2 flex flex-col justify-center gap-3"
        >
          <div className="bg-yellow-300 px-4 py-1 rounded-xl w-fit">
            <h1>Smart Phones</h1>
          </div>
          <h1 className="text-3xl font-semibold text-white font-notosans">Premium Phones</h1>
          <h2 className="text-lg font-medium text-white font-notosans">Starting at AED 399</h2>
        </div>
        <div
          style={{
            backgroundImage:
              "url('https://wordpress.templatetrip.com/WCM003_egudgets/wp-content/uploads/2023/08/banner-02.jpg')",
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat px-4 py-2 flex flex-col justify-center gap-3"
        >
          <div className="bg-yellow-300 px-4 py-1 rounded-xl w-fit">
            <h1>Smart Watches</h1>
          </div>
          <h1 className="text-3xl font-semibold text-white font-notosans">Galaxy Watch 7</h1>
          <h2 className="text-lg font-medium font-notosans text-white">Starting at AED 299</h2>
        </div>
        <div
          style={{
            backgroundImage:
              "url('https://wordpress.templatetrip.com/WCM003_egudgets/wp-content/uploads/2023/08/banner-03.jpg')",
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat px-4 py-2 flex flex-col justify-center gap-3"
        >
          <div className="bg-yellow-300 px-4 py-1 rounded-xl w-fit">
            <h1>Cameras</h1>
          </div>
          <h1 className="text-3xl font-semibold text-white font-notosans">Modern Camera's</h1>
          <h2 className="text-lg font-medium font-notosans text-white">Starting at AED 599</h2>
        </div>
      </div>
    </section>
  );
}
