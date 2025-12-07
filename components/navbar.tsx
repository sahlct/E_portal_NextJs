"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { IconHeadset } from "@tabler/icons-react";

export function Navbar() {
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [hoverMenu, setHoverMenu] = useState("");

  const navLinks = [
    { label: "Home", href: "/public/home" },
    {
      label: "Products",
      children: [
        { label: "Simple Product", href: "#" },
        { label: "Variable Product", href: "#" },
        { label: "Group Product", href: "#" },
      ],
    },
    { label: "Blogs", href: "/public/blogs" },
    { label: "About", href: "/public/about" },
    { label: "Contact", href: "/public/contact" },
  ];

  return (
    <div className="sticky top-0 z-50">
      {/* ---------------- TOP YELLOW BAR ---------------- */}
      <div className="bg-[#ffcc00] px-6 lg:px-12 py-4 flex justify-around items-center">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className=" p-1 bg-white rounded-xl">
              <img src="/logo_only.png" className="h-10" alt="" />
            </div>
            <span className="text-3xl font-semibold text-white font-notosans">
              EA Portal
            </span>
          </div>

          {/* Category Select */}
          <div className="flex gap-2">
            <div className="w-40">
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="laptops">Laptops</SelectItem>
                  <SelectItem value="mobiles">Mobiles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Box */}
            <div className="hidden lg:flex items-center bg-white rounded-md px-3 w-[320px]">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search for products..."
                className="border-none shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-20">
          {/* Support */}
          <div className="hidden lg:flex text-right gap-2 items-center">
            <div>
              <IconHeadset className="w-10 h-10" stroke={1} />
            </div>
            <div>
              <div className="font-semibold">+971 58 921 6757</div>
              <div className="text-sm">sales@eaportel.com</div>
            </div>
          </div>

          {/* Cart */}
          <Link href="/public/cart" className="relative">
            <ShoppingCart className="w-6 h-6 cursor-pointer" />
            {items.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </div>
            )}
          </Link>

          {/* Mobile menu button */}
          <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ---------------- BOTTOM WHITE NAV ---------------- */}
      <div className="hidden lg:flex justify-center bg-white border-b px-12 py-3 gap-20">
        {navLinks.map((link) =>
          link.children ? (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => setHoverMenu(link.label)}
              onMouseLeave={() => setHoverMenu("")}
            >
              <span className="cursor-pointer font-medium hover:text-orange-500">
                {link.label}
              </span>

              {/* Dropdown */}
              {hoverMenu === link.label && (
                <div className="absolute left-0 top-10 bg-white shadow-lg border rounded-md w-48 p-3 z-50">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block py-1 text-sm hover:text-orange-500"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className="font-medium hover:text-orange-500"
            >
              {link.label}
            </Link>
          )
        )}
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      {isOpen && (
        <div className="lg:hidden bg-white px-6 py-4 space-y-2 border-b">
          {navLinks.map((link) =>
            !link.children ? (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 border-b text-sm"
              >
                {link.label}
              </Link>
            ) : (
              <details key={link.label} className="border-b py-2 text-sm">
                <summary>{link.label}</summary>
                <div className="ml-4 mt-1 space-y-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block text-gray-600"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </details>
            )
          )}
        </div>
      )}
    </div>
  );
}
