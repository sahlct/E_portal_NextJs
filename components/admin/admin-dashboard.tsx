"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Package, Users, TrendingUp, DollarSign, Plus, Edit, Trash2 } from "lucide-react"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "users">("overview")

  const chartData = [
    { month: "Jan", sales: 4000, orders: 240 },
    { month: "Feb", sales: 3000, orders: 221 },
    { month: "Mar", sales: 2000, orders: 229 },
    { month: "Apr", sales: 2780, orders: 200 },
    { month: "May", sales: 1890, orders: 229 },
    { month: "Jun", sales: 2390, orders: 200 },
  ]

  const mockProducts = [
    { id: 1, name: "MacBook Pro 16", category: "Laptops", price: 3499, stock: 12 },
    { id: 2, name: "Dell XPS 15", category: "Laptops", price: 2299, stock: 8 },
    { id: 3, name: "Logitech MX Master", category: "Accessories", price: 99, stock: 45 },
  ]

  const mockOrders = [
    { id: "ORD-001", customer: "John Doe", total: 2499.99, status: "Delivered", date: "2025-01-15" },
    { id: "ORD-002", customer: "Jane Smith", total: 1299.99, status: "In Transit", date: "2025-01-14" },
    { id: "ORD-003", customer: "Bob Johnson", total: 599.99, status: "Processing", date: "2025-01-13" },
  ]

  const stats = [
    { label: "Total Sales", value: "$45,231", icon: DollarSign, color: "bg-blue-100 text-blue-600" },
    { label: "Total Orders", value: "1,234", icon: Package, color: "bg-green-100 text-green-600" },
    { label: "Total Users", value: "892", icon: Users, color: "bg-purple-100 text-purple-600" },
    { label: "Growth", value: "+12.5%", icon: TrendingUp, color: "bg-orange-100 text-orange-600" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-card rounded-lg p-6 border border-border">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {["overview", "products", "orders", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-6 py-3 font-semibold transition-colors capitalize ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6">Sales Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#0066cc" />
                  <Bar dataKey="orders" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Product Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Category</th>
                  <th className="px-6 py-3 text-left font-semibold">Price</th>
                  <th className="px-6 py-3 text-left font-semibold">Stock</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="px-6 py-4 font-semibold">{product.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4 font-semibold">${product.price}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.stock > 10
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="text-primary hover:opacity-80 transition-opacity">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:opacity-80 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                  <th className="px-6 py-3 text-left font-semibold">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold">Total</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="px-6 py-4 font-semibold">{order.id}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4 font-semibold">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                            : order.status === "In Transit"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-card rounded-lg p-6 border border-border text-center">
            <p className="text-muted-foreground">User management features coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
