"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Headphones, MapPin, Mail } from "lucide-react";
import { IconBrandWhatsapp } from '@tabler/icons-react';

export function Footer() {
  return (
    <footer className="bg-[#2d3a48] text-gray-200 pt-12">
      {/* Top Newsletter + Social + App Download */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/10 pb-10">

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <IconBrandWhatsapp className="w-5 h-5" /> Connect with our Team
            </h3>
            <p className="text-sm mt-2 opacity-80">
              Give your inbox some love with new products, tips & more.
            </p>

            <div className="mt-4 flex">
              <input
                type="email"
                placeholder="Enter your email here"
                className="flex-1 px-4 py-2 rounded-l-lg bg-white text-gray-800 outline-none"
              />
              <button className="px-5 cursor-pointer bg-yellow-500 text-gray-900 font-semibold rounded-r-lg hover:bg-yellow-400">
                Connect
              </button>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-bold text-lg">Follow Us</h3>
            <p className="text-sm mt-2 opacity-80">
              Make consolidating, marketing & tracking your social media easy.
            </p>

            <div className="flex gap-3 mt-4">
              {[
                { Icon: Facebook, color: "bg-blue-600", href:"" },
                { Icon: Twitter, color: "bg-sky-500" },
                { Icon: Instagram, color: "bg-red-500" },
                { Icon: Linkedin, color: "bg-sky-700" },
              ].map(({ Icon, color }, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${color} hover:opacity-80 cursor-pointer`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ))}
            </div>
          </div>

          {/* Download App */}
          <div>
            <h3 className="font-bold text-lg">Download App</h3>
            <p className="text-sm mt-2 opacity-80">
              App is now available on App Store & Google Play.
            </p>

            <div className="flex gap-3 mt-4">
              <img
                src="/download_google.png"
                className="h-10 cursor-pointer"
                alt="Google Play"
              />
              <img
                src="/download_apple.png"
                className="h-10 cursor-pointer"
                alt="App Store"
              />
            </div>
          </div>
        </div>

        {/* Middle Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-12">
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Information</h4>

            <div className="flex items-start gap-3 mb-4">
              <Headphones className="w-8 h-8 text-orange-500" />
              <div>
                <p className="font-semibold">Call On Order? Call us 24/7</p>
                <p className="text-orange-400 font-bold">(+971) 58 921 6757</p>
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
            <h4 className="font-semibold text-lg mb-4">Quick view</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/service" className="hover:text-white">Products</Link></li>
              <li><Link href="/store" className="hover:text-white">Blogs</Link></li>
              <li><Link href="/faqs" className="hover:text-white">About Us</Link></li>
              <li><Link href="/about" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Information</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/wishlist" className="hover:text-white">Wishlist</Link></li>
              <li><Link href="/account" className="hover:text-white">My account</Link></li>
              <li><Link href="/checkout" className="hover:text-white">Checkout</Link></li>
              <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
            </ul>
          </div>

          {/* Popular Tags */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Popular tag</h4>
            <div className="flex flex-wrap gap-3">
              {[
                "ElectraWave",
                "EnergoTech",
                "NexusElectronics",
                "SparkFlare",
                "QuantumElectro",
                "PulseTech",
                "CircuitMasters",
                "TechNova",
                "AmpereFusion",
                "VoltVibe",
              ].map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-[#3a4756] rounded-md cursor-pointer hover:bg-[#505d6c]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t border-white/10 text-sm opacity-80">
          <p>Copyright 2026, All Rights Reserved.</p>

          {/* <div className="flex gap-3 mt-4 md:mt-0">
            <img src="/images/payment/amex.png" className="h-6" />
            <img src="/images/payment/applepay.png" className="h-6" />
            <img src="/images/payment/gpay.png" className="h-6" />
            <img src="/images/payment/master.png" className="h-6" />
            <img src="/images/payment/visa.png" className="h-6" />
          </div> */}
        </div>
      </div>
    </footer>
  );
}
