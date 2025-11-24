"use client";

import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F3F8FF] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-10 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* LEFT SIDE: CONTACT INFO */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <p className="text-gray-600 mb-4 flex items-center gap-2">
                <IconMapPin  size={18} /> Bin Jarsh Building, Naif-Deira, Dubai, UAE
              </p>

              <h2 className="text-xl font-semibold mb-3">Phone</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                <a href="tel:+971589216757" className="flex items-center gap-2"><IconPhone size={18} /> +971 58 921 6757</a>
                <a href="tel:+971502474482" className="flex items-center gap-2"><IconPhone size={18} /> +971 50 247 4482</a>
                <a href="tel:+971544708620" className="flex items-center gap-2"><IconPhone size={18} /> +971 54 470 8620</a>
              </p>

              <h2 className="text-xl font-semibold mb-3">Email</h2>
              <p className="text-gray-700 mb-6 flex items-center gap-2"><IconMail size={18} /> <a href="mailto:sales@eaportel.com">sales@eaportel.com</a></p>

              <h2 className="text-xl font-semibold mb-3">Follow</h2>
              <div className="flex gap-3">
                <a href="#" className="bg-[#4267B2] text-white p-2 rounded-md">
                  <Facebook size={18} />
                </a>
                <a href="#" className="bg-[#E1306C] text-white p-2 rounded-md">
                  <Instagram size={18} />
                </a>
                <a href="#" className="bg-[#1DA1F2] text-white p-2 rounded-md">
                  <Twitter size={18} />
                </a>
                <a href="#" className="bg-[#FF0000] text-white p-2 rounded-md">
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Enquiry Form</h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* MAP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* LEFT INFO */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4">Find us on the map</h2>
            <p className="text-gray-700 mb-4">
              Bin Jarsh Building, Naif-Deira,<br /> Dubai, UAE
            </p>
            <a
              href="#"
              className="text-blue-600 font-medium hover:underline"
            >
              Get Direction
            </a>
          </div>

          {/* GOOGLE MAP */}
          <div className="rounded-2xl overflow-hidden shadow-md md:col-span-2">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.924526905232!2d55.308123699999996!3d25.273124199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43a2dd66e46b%3A0xbbe81ef8a18db661!2sEA%20PORTEL%20COMPUTERS%20TRADING%20CO.%20L.L.C!5e0!3m2!1sen!2sin!4v1763888977522!5m2!1sen!2sin" className="w-full" height="350"  loading="lazy"></iframe>
          </div>

        </div>

      </div>
    </div>
  );
}
