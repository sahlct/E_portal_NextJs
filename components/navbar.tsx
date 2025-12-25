"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { IconHeadset } from "@tabler/icons-react";
import { Home, Info, Boxes, Briefcase, BookOpen, Phone } from "lucide-react";
import gsap from "gsap";

import { useCart } from "@/context/cart-context";
import { Input } from "@/components/ui/input";

import { getCategories } from "@/lib/api/category";
import { getProductSkus } from "@/lib/api/sku";
import { slugify } from "@/lib/slugify";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { items } = useCart();
  const categoryRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: "Home", href: "/public/home", icon: Home },
    { label: "Products", href: "/public/products", icon: Boxes },
    { label: "Blogs", href: "/public/blogs", icon: BookOpen },
    { label: "About", href: "/public/about", icon: Info },
    { label: "Contact", href: "/public/contact", icon: Phone },
  ];

  useEffect(() => {
    if (!mobileOpen) return;

    gsap.set(sidebarRef.current, { x: "-100%" });

    gsap.to(sidebarRef.current, {
      x: "0%",
      duration: 0.4,
      ease: "power3.out",
    });
  }, [mobileOpen]);

  const closeMobile = () => {
    gsap.to(sidebarRef.current, {
      x: "-100%",
      duration: 0.35,
      ease: "power3.in",
      onComplete: () => setMobileOpen(false),
    });
  };

  const handleSearchSubmit = () => {
    const value = searchTerm.trim();
    if (!value) return;

    setSearchResults([]);
    setSearchTerm("");

    router.push(`/public/products?search=${encodeURIComponent(value)}`);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setCategoryOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- helpers ---------------- */
  const isActive = (href: string) =>
    href === "/public/products"
      ? pathname.startsWith("/public/products")
      : pathname === href;

  const goCategory = (category_name: string) => {
    setCategoryOpen(false);
    router.push(`/public/products?category=${slugify(category_name)}`);
  };

  const goSearchItem = (name: string) => {
    setSearchTerm("");
    setSearchResults([]);
    router.push(`/public/products/${slugify(name)}`);
  };

  /* ---------------- fetch categories ---------------- */
  useEffect(() => {
    getCategories(1, 100, undefined, 1)
      .then((res) => setCategories(res?.data || []))
      .catch(console.error);
  }, []);

  /* ---------------- debounce ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  /* ---------------- product search ---------------- */
  useEffect(() => {
    if (!debouncedSearch) {
      setSearchResults([]);
      return;
    }

    getProductSkus(1, 100, debouncedSearch, 1)
      .then((res) => setSearchResults(res?.data || []))
      .catch(console.error);
  }, [debouncedSearch]);

  /* ---------------- search grid rules ---------------- */
  const results = searchResults.slice(0, 15);
  console.log("results", results);

  let gridCols = "grid-cols-1";
  if (results.length >= 10) gridCols = "grid-cols-3";
  else if (results.length >= 5) gridCols = "grid-cols-2";

  /* ---------------- close sidebar on route change ---------------- */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-[#ffcc00]">
      {/* ---------------- MOBILE TOP BAR ---------------- */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between lg:hidden">
        <button onClick={() => setMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>

        <Link href="/public/home" className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-lg">
            <img src="/logo_only.png" className="h-6" />
          </div>
          <span className="font-semibold text-2xl font-notosans relative">
            EA Portel
          </span>
        </Link>

        <Link href="/public/cart" className="relative">
          <ShoppingCart />
          {!!items.length && (
            <span className="absolute -top-1 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {items.length}
            </span>
          )}
        </Link>
      </div>

      {/* ---------------- DESKTOP TOP BAR ---------------- */}
      <div className="hidden lg:flex items-center justify-between bg-[#ffcc00] px-20 py-4">
        <div className="flex items-center gap-5">
          <Link href="/public/home" className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-xl">
              <img src="/logo_only.png" className="h-10" />
            </div>
            <span className="text-3xl font-semibold font-notosans">
              EA Portel
            </span>
          </Link>

          {/* Category */}
          <div ref={categoryRef} className="relative ms-16">
            <button
              onClick={() => {
                setCategoryOpen((v) => !v);
                setSearchResults([]);
              }}
              className="flex cursor-pointer items-center justify-between w-48 bg-white px-3 py-2 rounded-md text-sm font-medium shadow-sm ring-1 ring-border hover:ring-orange-400 transition"
            >
              <span>All Categories</span>
              <span className="text-xs text-muted-foreground">
                {categories.length}+
              </span>
            </button>

            {categoryOpen && (
              <div className="absolute mt-2 w-[520px] bg-white border rounded-lg shadow-lg p-4 z-50">
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => goCategory(cat.category_name)}
                      className="border cursor-pointer rounded-md py-2 px-3 hover:bg-orange-50 hover:border-orange-500 text-sm font-medium transition"
                    >
                      <span className="line-clamp-1 text-start">
                        {cat.category_name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div ref={searchRef} className="relative w-[320px]">
            <div className="flex items-center gap-2 rounded-md bg-white px-3 pe-0.5 ring-1 ring-border focus-within:ring-2 focus-within:ring-orange-500">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                placeholder="Search products..."
                className="border-hidden shadow-none p-0 h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              <button
                type="button"
                onClick={handleSearchSubmit}
                disabled={!searchTerm.trim()}
                className={`h-full p-2 rounded-md transition cursor-pointer
    ${
      searchTerm.trim()
        ? "bg-gray-300 hover:bg-gray-400"
        : "bg-transparent cursor-not-allowed"
    }
  `}
              >
                <Search className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {!!results.length && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg p-3">
                <div className={`grid ${gridCols} gap-2`}>
                  {results.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => goSearchItem(p.sku)}
                      className="flex cursor-pointer items-center border rounded-md p-2 hover:bg-orange-50 text-xs"
                    >
                      {/* {p.product_image && (
                        <img
                          src={p.product_image}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )} */}
                      <span className="line-clamp-1 text-start">
                        {p.product_sku_name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Support + Cart */}
        <div className="flex items-center gap-20">
          <div className="flex items-center gap-2">
            <IconHeadset />
            <div>
              <a href="tel:+971589216757" className="block font-semibold">
                +971 58 921 6757
              </a>
              <a href="mailto:sales@eaportel.com" className="text-sm">
                sales@eaportel.com
              </a>
            </div>
          </div>

          <Link href="/public/cart" className="relative">
            <ShoppingCart />
            {!!items.length && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ---------------- DESKTOP NAV ---------------- */}
      <nav className="hidden lg:flex justify-center gap-10 bg-white border-b py-3">
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`font-medium ${
              isActive(l.href) ? "text-orange-500" : "hover:text-orange-500"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* ---------------- MOBILE SIDEBAR ---------------- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay (BEHIND sidebar) */}
          <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />

          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className="absolute left-0 top-0 h-full w-72 bg-white px-4 py-5 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={closeMobile}>
                <X />
              </button>
            </div>

            {/* Menu */}
            <div className="space-y-2">
              {navLinks.map((l) => {
                const Icon = l.icon;
                const active = isActive(l.href);

                return (
                  <button
                    key={l.href}
                    onClick={() => {
                      router.push(l.href);
                      closeMobile();
                    }}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-md transition
                ${
                  active
                    ? "bg-yellow-500 text-white"
                    : "text-gray-700 hover:text-yellow-500"
                }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{l.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Contact */}
            <div className="border-t mt-6 pt-4 text-sm">
              <a href="tel:+971589216757" className="block font-medium">
                +971 58 921 6757
              </a>
              <a
                href="mailto:sales@eaportel.com"
                className="block text-gray-600"
              >
                sales@eaportel.com
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
