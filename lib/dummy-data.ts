export interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  description: string
  specs?: Record<string, string>
  inStock: boolean
}

export interface Category {
  id: string
  name: string
  image: string
  productCount: number
}

export interface Brand {
  id: string
  name: string
  logo: string
}

export const categories: Category[] = [
  {
    id: "laptops",
    name: "Laptops",
    image: "/modern-laptop-workspace.png",
    productCount: 45,
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/mouse-keyboard.jpg",
    productCount: 120,
  },
  {
    id: "monitors",
    name: "Monitors",
    image: "/monitor-display.png",
    productCount: 32,
  },
  {
    id: "servers",
    name: "Servers",
    image: "/server-rack.png",
    productCount: 18,
  },
  {
    id: "printers",
    name: "Printers",
    image: "/office-printer.png",
    productCount: 25,
  },
  {
    id: "cctv",
    name: "CCTV Cameras",
    image: "/outdoor-security-camera.png",
    productCount: 40,
  },
  {
    id: "wifi",
    name: "Wi-Fi Devices",
    image: "/wifi-router.jpg",
    productCount: 35,
  },
  {
    id: "desktops",
    name: "Desktops",
    image: "/modern-desktop-setup.png",
    productCount: 28,
  },
]

export const products: Product[] = [
  {
    id: "prod-1",
    title: 'MacBook Pro 16" M3 Max',
    price: 3499,
    originalPrice: 3999,
    image: "/macbook-pro-laptop.png",
    category: "laptops",
    rating: 4.8,
    reviews: 324,
    description: "Powerful laptop for professionals",
    specs: {
      processor: "Apple M3 Max",
      ram: "36GB",
      storage: "1TB SSD",
      display: '16" Liquid Retina XDR',
    },
    inStock: true,
  },
  {
    id: "prod-2",
    title: "Dell XPS 15 Plus",
    price: 2299,
    originalPrice: 2599,
    image: "/dell-xps-laptop.png",
    category: "laptops",
    rating: 4.6,
    reviews: 256,
    description: "Premium Windows laptop",
    specs: {
      processor: "Intel Core i7",
      ram: "32GB",
      storage: "1TB SSD",
      display: '15.6" OLED',
    },
    inStock: true,
  },
  {
    id: "prod-3",
    title: "Logitech MX Master 3S",
    price: 99,
    image: "/wireless-computer-mouse.png",
    category: "accessories",
    rating: 4.7,
    reviews: 512,
    description: "Advanced wireless mouse",
    inStock: true,
  },
  {
    id: "prod-4",
    title: "Mechanical Keyboard RGB",
    price: 149,
    originalPrice: 199,
    image: "/mechanical-keyboard.png",
    category: "accessories",
    rating: 4.5,
    reviews: 189,
    description: "Premium mechanical keyboard",
    inStock: true,
  },
  {
    id: "prod-5",
    title: 'LG UltraWide 34"',
    price: 799,
    image: "/lg-ultrawide-monitor.jpg",
    category: "monitors",
    rating: 4.7,
    reviews: 143,
    description: "Curved ultrawide monitor",
    inStock: true,
  },
  {
    id: "prod-6",
    title: '4K Gaming Monitor 27"',
    price: 599,
    originalPrice: 699,
    image: "/4k-gaming-monitor.jpg",
    category: "monitors",
    rating: 4.6,
    reviews: 267,
    description: "144Hz 4K gaming monitor",
    inStock: true,
  },
  {
    id: "prod-7",
    title: "Hikvision CCTV System",
    price: 449,
    image: "/hikvision-cctv-camera.jpg",
    category: "cctv",
    rating: 4.4,
    reviews: 98,
    description: "4-camera CCTV system",
    inStock: true,
  },
  {
    id: "prod-8",
    title: "TP-Link WiFi 6 Router",
    price: 199,
    image: "/tp-link-wifi-router.jpg",
    category: "wifi",
    rating: 4.5,
    reviews: 421,
    description: "High-speed WiFi 6 router",
    inStock: true,
  },
]

export const brands: Brand[] = [
  { id: "apple", name: "Apple", logo: "/apple-logo-minimalist.png" },
  { id: "dell", name: "Dell", logo: "/dell-logo.png" },
  { id: "hp", name: "HP", logo: "/generic-tech-logo.png" },
  { id: "lenovo", name: "Lenovo", logo: "/lenovo-logo.png" },
  { id: "asus", name: "ASUS", logo: "/asus-logo.png" },
  { id: "lg", name: "LG", logo: "/lg-logo-abstract.png" },
  { id: "samsung", name: "Samsung", logo: "/samsung-logo.png" },
  { id: "sony", name: "Sony", logo: "/sony-logo.png" },
  { id: "acer", name: "Acer", logo: "/generic-tech-logo.png" },
  { id: "msi", name: "MSI", logo: "/generic-tech-logo.png" },
  { id: "corsair", name: "Corsair", logo: "/generic-tech-logo.png" },
  { id: "razer", name: "Razer", logo: "/generic-tech-logo.png" },
  { id: "nvidia", name: "NVIDIA", logo: "/generic-tech-logo.png" },
  { id: "intel", name: "Intel", logo: "/generic-tech-logo.png" },
  { id: "amd", name: "AMD", logo: "/generic-tech-logo.png" },
  { id: "logitech", name: "Logitech", logo: "/generic-tech-logo.png" },
]

export const bannerAds = [
  {
    id: "banner-1",
    title: "Latest Tech Deals",
    subtitle: "Up to 40% off on selected items",
    image: "/electronics-tech-deals-banner-with-laptops-and-gad.jpg",
    cta: "Shop Now",
  },
  {
    id: "banner-2",
    title: "New Arrivals",
    subtitle: "Check out the latest gadgets and accessories",
    image: "/new-tech-arrivals-modern-electronics-showcase.jpg",
    cta: "Explore",
  },
  {
    id: "banner-3",
    title: "Premium Laptops",
    subtitle: "Professional grade performance for your work",
    image: "/premium-laptops-professional-workspace-setup.jpg",
    cta: "View Collection",
  },
  {
    id: "banner-4",
    title: "Gaming Monitors",
    subtitle: "Experience ultra-fast 144Hz displays",
    image: "/gaming-monitors-high-refresh-rate-display.jpg",
    cta: "Shop Gaming",
  },
]
