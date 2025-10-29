"use client"

import Link from "next/link"
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { CheckoutModal } from "@/components/cart/checkout-modal"

export function CartPageContent() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some products to get started</p>
          <Link href="/products">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-card rounded-lg p-6 flex gap-6 border border-border">
                  {/* Image */}
                  <div className="w-24 h-24 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors mb-2">{item.title}</h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-4">{item.category}</p>
                    <p className="text-lg font-bold text-primary">${item.price}</p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col items-end gap-4">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-secondary transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1 border-l border-r border-border">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-secondary transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link href="/products" className="inline-block mt-8">
              <button className="text-primary hover:opacity-80 transition-opacity flex items-center gap-2 font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </button>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 border border-border sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${(total * 1.1).toFixed(2)}</span>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => clearCart()}
                className="w-full border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} total={total * 1.1} />
    </div>
  )
}
