"use client"
import { products } from "@/lib/dummy-data"
import { ProductCard } from "@/components/products/product-card"

export default function DealsPage() {
  const dealsProducts = products.filter((p) => p.originalPrice)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Offer Poster */}
        <div className="mb-12 bg-gradient-to-r from-primary to-primary/80 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Deals of the Day</h1>
              <p className="text-lg text-primary-foreground/90 mb-6">
                Get amazing discounts on premium electronics and gadgets. Limited time offers!
              </p>
              <div className="flex gap-4">
                <div className="bg-primary-foreground/20 rounded-lg p-4">
                  <p className="text-sm text-primary-foreground/80">Up to</p>
                  <p className="text-3xl font-bold text-primary-foreground">40% OFF</p>
                </div>
                <div className="bg-primary-foreground/20 rounded-lg p-4">
                  <p className="text-sm text-primary-foreground/80">Free</p>
                  <p className="text-3xl font-bold text-primary-foreground">Shipping</p>
                </div>
              </div>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg h-64 flex items-center justify-center">
              <img
                src="/electronics-deals-banner.jpg"
                alt="Deals Banner"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Deals Products */}
        <div>
          <h2 className="text-3xl font-bold mb-8">Featured Deals</h2>
          {dealsProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No deals available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dealsProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
