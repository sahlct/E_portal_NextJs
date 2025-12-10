"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { CheckoutModal } from "@/components/cart/checkout-modal";

export function CartPageContent() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="md:text-4xl text-2xl font-semibold font-notosans mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some products to get started
          </p>
          <Link
            href="/products"
            className="bg-yellow-400 cursor-pointer text-primary-foreground md:px-8 px-5 md:py-3 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity flex justify-center items-center gap-2 mx-auto"
          >
            {/* <button > */}
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
            {/* </button> */}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="md:text-3xl text-2xl font-semibold md:mb-8 mb-5 font-notosans">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-lg md:p-6 p-3 border border-border"
                >
                  <div className="flex flex-wrap md:flex-row gap-4 md:gap-6">
                    {/* Image */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-semibold text-base md:text-lg hover:text-primary transition-colors mb-1">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-sm mb-2">
                        {item.category}
                      </p>
                      <p className="text-yellow-500 font-bold font-notosans">
                        AED {item.price}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex md:flex-col flex-row items-center md:items-end justify-between md:justify-start gap-3">
                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      {/* Quantity */}
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 py-1 hover:bg-secondary cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-sm border-x border-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 py-1 hover:bg-secondary cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="font-semibold text-sm md:text-lg font-notosans text-right">
                        AED {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link href="/products" className="inline-block mt-8">
              <button className="text-orange-500 cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </button>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg md:p-6 p-3 border border-border sticky top-24">
              <h2 className="md:text-2xl text-xl font-semibold mb-6 font-notosans">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">AED {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-green-500">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-semibold text-red-500">Included</span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg font-bold">
                <span className="font-notosans">Total</span>
                <span className="text-primary font-notosans">AED {total}</span>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="cursor-pointer w-full bg-yellow-500 text-primary-foreground md:py-3 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => clearCart()}
                className="cursor-pointer w-full border border-border text-foreground md:py-3 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={total}
      />
    </div>
  );
}
