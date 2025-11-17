"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getCategories } from "@/lib/api/category"

interface Category {
  _id: string
  category_name: string
  category_image: string
  status: number
}

export function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ Fetch categories from backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories(1, 100, undefined, 1) // /api/categories?page=1&limit=100&status=1
        if (res?.data) setCategories(res.data)
      } catch (err) {
        console.error("❌ Failed to load categories:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // ✅ Show skeleton while loading
  if (loading) {
    return (
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-14 py-10">
        <h2 className="text-3xl font-semibold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </section>
    )
  }

  // ✅ No categories case
  if (categories.length === 0) {
    return (
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-14 py-10">
        <h2 className="text-3xl font-semibold mb-8">Shop by Category</h2>
        <p className="text-gray-600 text-center">No categories available</p>
      </section>
    )
  }

  // ✅ Render real category data
  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-10">
      <h2 className="text-3xl font-semibold mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/products?category=${category._id}`}
            className="block"
          >
            <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={category.category_image || "/placeholder.svg"}
                alt={category.category_name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center text-center px-2">
                <h3 className="text-white font-bold text-lg truncate">
                  {category.category_name}
                </h3>
                <p className="text-white/80 text-sm">Explore items</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
