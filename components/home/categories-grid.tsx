"use client"

import Link from "next/link"
import { categories } from "@/lib/dummy-data"

export function CategoriesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/products?category=${category.id}`}>
            <div className="relative h-40 rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center">
                <h3 className="text-white font-bold text-lg text-center">{category.name}</h3>
                <p className="text-white/80 text-sm">{category.productCount} items</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
