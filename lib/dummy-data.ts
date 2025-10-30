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
    title: 'MacBook Pro 16 M3 Max',
    price: 3499,
    originalPrice: 3999,
    image: "https://image.made-in-china.com/202f0j00dbpcYwmqLRou/10-1-Inch-PC-Notebook-Octa-Core-4-64GB-Front-2MP-2in1computer-Laptop.webp",
    category: "laptops",
    rating: 4.8,
    reviews: 324,
    description: "Discover the latest technology from top brands. Quality products at competitive prices.",
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
    image: "https://img.freepik.com/free-photo/still-life-books-versus-technology_23-2150062920.jpg",
    category: "laptops",
    rating: 4.6,
    reviews: 256,
    description: "Discover the latest technology from top brands. Quality products at competitive prices.",
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
    description: "Discover the latest technology from top brands. Quality products at competitive prices.",
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
    description: "Discover the latest technology from top brands. Quality products at competitive prices.",
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
    description: "Discover the latest technology from top brands. Quality products at competitive prices.",
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
    description: "Discover the latest technology from top brands. Quality products at competitive prices.",
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
    description: "Discover the latest technology from top brands. Quality products at competitive prices.",
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
    description: "Discover the latest technology from top brands. Quality products at competitive prices.",
    inStock: true,
  },
  {
    id: "prod-9",
    title: "Dell XPS 15 Plus",
    price: 2299,
    originalPrice: 2599,
    image: "https://image.made-in-china.com/202f0j00GkSgcQyKhEuj/15-6-Inch-Innovative-Product-Dual-Core-Laptop-for-Home-and-Student.webp",
    category: "laptops",
    rating: 4.6,
    reviews: 256,
    description: "Discover the latest technology from top brands. Quality products at competitive prices.",
    specs: {
      processor: "Intel Core i7",
      ram: "32GB",
      storage: "1TB SSD",
      display: '15.6" OLED',
    },
    inStock: true,
  },
  {
    id: "prod-10",
    title: 'MacBook Pro Max',
    price: 3499,
    originalPrice: 3999,
    image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/dell-premium/da16250/media-gallery/laptop-dell-da16250t-gy-gallery-3.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=1015&qlt=100,1&resMode=sharp2&size=1015,804&chrss=full",
    category: "laptops",
    rating: 4.8,
    reviews: 324,
    description: "Discover the latest technology from top brands. Quality products at competitive prices.",
    specs: {
      processor: "Apple M3 Max",
      ram: "36GB",
      storage: "1TB SSD",
      display: '16" Liquid Retina XDR',
    },
    inStock: true,
  },
  {
    id: "prod-11",
    title: "Hikvision Router",
    price: 449,
    image: "https://img.freepik.com/premium-photo/closeup-wireless-router-man-using-smartphone-living-room-home-office_36051-278.jpg?semt=ais_hybrid&w=740&q=80",
    category: "cctv",
    rating: 4.4,
    reviews: 98,
    description: "Discover the latest technology from top brands. Quality products at competitive prices.",
    inStock: true,
  },
  {
    id: "prod-12",
    title: "TP-Link CCTV",
    price: 199,
    image: "https://img.freepik.com/premium-photo/mini-cctv-security-camera-operating-nearby-backyard-house-blur-background_860136-2492.jpg?semt=ais_hybrid&w=740&q=80",
    category: "wifi",
    rating: 4.5,
    reviews: 421,
    description: "Discover the latest technology from top brands. Quality products at competitive prices.",
    inStock: true,
  },
]

export const brands: Brand[] = [
  {id: "arubaa", name:"Aruba", logo:"/aruba_logo.png"},
  {id: "cisco", name:"Cisco", logo:"/cisco_logo.png"},
  {id: "dahua", name:"Dahua", logo:"/dahua_logo.png"},
  {id: "dell", name:"Dell", logo:"/dell-logo.png"},
  {id: "dinstar", name:"Dinstar", logo:"/dinstar_logo.png"},
  {id: "dlink", name:"D-Link", logo:"/D-link_logo.png"},
  {id: "engenius", name:"Engenius", logo:"/engenius_logo.png"},
  {id: "eaton", name:"Eaton", logo:"/Eaton-Logo.png"},
  {id: "draytek", name:"DrayTek", logo:"/draytek_logo.png"},
  {id: "huawei", name:"Huawei", logo:"/Huawei-Logo.png"},
  {id: "hp", name:"HP", logo:"/hp_logo.png"},
  {id: "grandstream", name:"GrandStream", logo:"/grandstram_logo.png"},
  {id: "hykvision", name:"HikeVision", logo:"/hikvision_logo.png"},
  {id: "fanvil", name:"Fanvil", logo:"/fanvil_logo.png"},
  {id: "linksys", name:"Linksys", logo:"/Linksys_Logo.png"},
  {id: "lenovo", name:"Lenovo", logo:"/lenovo_logo.png"},
  {id: "yealink", name:"YeaLink", logo:"/yealink_logo.png"},
  {id: "westerdigital", name:"WesterDigital", logo:"/westerdigital_logo.png"},
  {id: "ipcom", name:"Ipcom", logo:"/ipcom_logo.png"},
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
