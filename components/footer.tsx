"use client";

import Link from "next/link";
import { Headphones, MapPin, Mail } from "lucide-react";
import {
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/category";

export function Footer() {
  const [categories, setCategories] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const WHATSAPP_NUMBER = "971589216757";

  // -------------------------
  // Fetch categories
  // -------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories(1, 10, undefined, 1);
        setCategories(res?.data || []);
      } catch (err) {
        console.error("Category fetch error", err);
      }
    };

    fetchCategories();
  }, []);

  // -------------------------
  // WhatsApp connect
  // -------------------------
  const handleWhatsappConnect = () => {
    if (!message.trim()) return;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <footer className="bg-[#2d3a48] text-gray-200 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-white/10 pb-10">

          {/* Connect With Team */}
          <div>
            <h3 className="font-medium font-notosans text-lg flex items-center gap-2">
              <IconBrandWhatsapp className="w-5 h-5" /> Connect with our Team
            </h3>

            <p className="text-sm mt-2 opacity-80">
              Send us your enquiry directly on WhatsApp.
            </p>

            <div className="mt-4 flex md:w-[75%]">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                className="flex-1 px-4 py-2 rounded-l-lg bg-white text-gray-800 outline-none"
              />

              <button
                onClick={handleWhatsappConnect}
                disabled={!message.trim()}
                className="px-5 bg-yellow-500 text-gray-900 font-semibold rounded-r-lg cursor-pointer disabled:cursor-not-allowed"
              >
                Connect
              </button>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-medium font-notosans text-lg">Follow Us</h3>
            <p className="text-sm mt-2 opacity-80">
              Reach us instantly through your preferred channel.
            </p>

            <div className="flex gap-3 mt-4">
              <a
                href="mailto:sales@eaportel.com"
                className="w-10 h-10 rounded-md flex items-center justify-center bg-blue-600 hover:opacity-80"
              >
                <IconMail />
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                className="w-10 h-10 rounded-md flex items-center justify-center bg-green-500 hover:opacity-80"
              >
                <IconBrandWhatsapp />
              </a>

              <a
                href="https://www.instagram.com/eaportel_?igsh=MWwxbWNiaG03dHZtbg=="
                target="_blank"
                className="w-10 h-10 rounded-md flex items-center justify-center bg-red-500 hover:opacity-80"
              >
                <IconBrandInstagram />
              </a>

              <a
                href="tel:+971589216757"
                className="w-10 h-10 rounded-md flex items-center justify-center bg-sky-700 hover:opacity-80"
              >
                <IconPhone />
              </a>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-12">

          {/* Contact Info */}
          <div>
            <h4 className="font-medium font-notosans text-lg mb-4">
              Contact Information
            </h4>

            <div className="flex items-start gap-3 mb-4">
              <Headphones className="w-8 h-8 text-orange-500" />
              <div>
                <p className="font-semibold">Call us 24/7</p>
                <p className="text-orange-400 font-bold">
                  (+971) 58 921 6757
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-2">
              <MapPin className="w-5 h-5" />
              <p>Bin Jarsh Building, Naif-Deira, Dubai, UAE</p>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5" />
              <p>sales@eaportel.com</p>
            </div>
          </div>

          {/* Quick View */}
          <div>
            <h4 className="font-medium text-lg mb-4 font-notosans">
              Quick View
            </h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/public/home">Home</Link></li>
              <li><Link href="/public/products">Products</Link></li>
              <li><Link href="/public/blogs">Blogs</Link></li>
              <li><Link href="/public/about">About Us</Link></li>
              <li><Link href="/public/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-medium font-notosans text-lg mb-4">
              Popular Categories
            </h4>

            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/public/products?category=${cat._id}`}
                  className="px-3 py-1 text-sm bg-[#3a4756] rounded-md hover:bg-[#505d6c]"
                >
                  {cat.category_name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 text-sm opacity-80 text-center">
          Copyright 2026, All Rights Reserved © EAPortel
        </div>
      </div>
    </footer>
  );
}
