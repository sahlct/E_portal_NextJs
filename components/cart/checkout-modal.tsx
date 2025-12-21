"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { useCart } from "@/context/cart-context"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
}

export function CheckoutModal({ isOpen, onClose, total }: CheckoutModalProps) {
  const { items, clearCart } = useCart()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    town: "",
    pincode: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const orderDetails = items
      .map((item) => `${item.title} x${item.quantity} - AED ${(item.price * item.quantity).toFixed(2)}`)
      .join("\n")

    const message = `
*New Order EA Portel*

*Customer Details:*
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}
Town: ${formData.town}
Pincode: ${formData.pincode}

*Order Items:*
${orderDetails}

*Total Amount:* AED ${total.toFixed(2)}
    `.trim()

    const whatsappNumber = "+971589216757" 
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    // Open WhatsApp
    window.open(whatsappUrl, "_blank")

    // Clear cart and close modal
    clearCart()
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      town: "",
      pincode: "",
    })
    onClose()
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg md:max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between md:p-6 p-4 border-b border-border sticky top-0 bg-card">
          <h2 className="text-2xl font-semibold font-notosans">Checkout</h2>
          <button onClick={onClose} className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="md:p-6 p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full placeholder:text-gray-400 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="placeholder:text-gray-400 w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full placeholder:text-gray-400 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-2">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full placeholder:text-gray-400 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="123 Main Street"
            />
          </div>

          {/* Town */}
          <div>
            <label className="block text-sm font-semibold mb-2">Town/City *</label>
            <input
              type="text"
              name="town"
              value={formData.town}
              onChange={handleChange}
              required
              className="w-full placeholder:text-gray-400 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="New York"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-semibold mb-2">Pincode/ZIP *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="w-full placeholder:text-gray-400 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="10001"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-secondary rounded-lg p-4 mt-6">
            <h3 className="font-medium font-notosans mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm mb-3 pb-3 border-b border-border">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.title} x{item.quantity}
                  </span>
                  <span>AED {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span className="font-notosans">Total:</span>
              <span className="text-primary font-notosans">AED {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-yellow-500 text-primary-foreground md:py-3 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 md:mt-6 mt-3"
          >
            {isSubmitting ? "Processing..." : "Proceed to Order"}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            You will be redirected to WhatsApp to complete your order
          </p>
        </form>
      </div>
    </div>
  )
}
