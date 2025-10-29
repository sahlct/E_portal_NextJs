import { useQuery } from "@tanstack/react-query"
import { products } from "@/lib/dummy-data"

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))
      if (category && category !== "all") {
        return products.filter((p) => p.category === category)
      }
      return products
    },
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return products.find((p) => p.id === id)
    },
  })
}
