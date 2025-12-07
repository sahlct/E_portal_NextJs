"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { IconHeadset } from "@tabler/icons-react";

import { useCart } from "@/context/cart-context";
import { Input } from "@/components/ui/input";

import { getCategories } from "@/lib/api/category";
import { getProducts } from "@/lib/api/product";

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

  const navLinks = [
    { label: "Home", href: "/public/home" },
    { label: "Products", href: "/public/products" },
    { label: "Blogs", href: "/public/blogs" },
    { label: "About", href: "/public/about" },
    { label: "Contact", href: "/public/contact" },
  ];

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

  const goCategory = (id: string) => {
    setCategoryOpen(false);
    router.push(`/public/products?category=${id}`);
  };

  const goSearchItem = (name: string) => {
    setSearchTerm("");
    setSearchResults([]);
    router.push(`/public/products?search=${encodeURIComponent(name)}`);
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

    getProducts(1, 100, debouncedSearch, 1)
      .then((res) => setSearchResults(res?.data || []))
      .catch(console.error);
  }, [debouncedSearch]);

  /* ---------------- search grid rules ---------------- */
  const results = searchResults.slice(0, 15);

  let gridCols = "grid-cols-1";
  if (results.length >= 10) gridCols = "grid-cols-3";
  else if (results.length >= 5) gridCols = "grid-cols-2";

  /* ---------------- close sidebar on route change ---------------- */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* ---------------- MOBILE TOP BAR ---------------- */}
      <div className="bg-[#ffcc00] px-4 py-3 flex items-center justify-between lg:hidden">
        <button onClick={() => setMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>

        <Link href="/public/home" className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-lg">
            <img src="/logo_only.png" className="h-8" />
          </div>
          <span className="font-semibold text-2xl font-notosans">
            EA Portal
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
              EA Portal
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
                      onClick={() => goCategory(cat._id)}
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
            <div className="flex items-center gap-2 rounded-md bg-white px-3 ring-1 ring-border focus-within:ring-2 focus-within:ring-orange-500">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="border-hidden shadow-none p-0 h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {!!results.length && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg p-3">
                <div className={`grid ${gridCols} gap-2`}>
                  {results.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => goSearchItem(p.product_name)}
                      className="flex cursor-pointer items-center border rounded-md p-2 hover:bg-orange-50 text-xs"
                    >
                      {/* {p.product_image && (
                        <img
                          src={p.product_image}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )} */}
                      <span className="line-clamp-1 text-start">
                        {p.product_name}
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
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute left-0 top-0 h-full w-72 bg-white p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <X />
              </button>
            </div>

            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md ${
                  isActive(l.href)
                    ? "bg-orange-50 text-orange-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div className="border-t mt-4 pt-4">
              <a href="tel:+971589216757" className="block">
                +971 58 921 6757
              </a>
              <a href="mailto:sales@eaportel.com" className="block text-sm">
                sales@eaportel.com
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
