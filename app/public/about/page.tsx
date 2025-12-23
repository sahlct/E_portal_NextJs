"use client";

import BrandsPage from "@/components/home/branspage";
import { HeroSection } from "@/components/home/hero-section";
import {
  IconBadges,
  IconBrandDatabricks,
  IconCarambola,
  IconSettingsCheck,
} from "@tabler/icons-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background  px-4 sm:px-6 lg:px-8 py-8">
      <HeroSection />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="md:text-4xl text-3xl font-semibold mb-4 font-notosans">
          About EA Portel
        </h1>
        <p className="text-muted-foreground mb-8">
          Your trusted source for premium electronics and gadgets
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-6 border border-border relative overflow-hidden">
            <h3 className="text-xl font-semibold mb-5 font-notosans flex gap-3">
              {" "}
              <IconBrandDatabricks className="text-orange-400" />{" "}
              <span>Our Mission</span>
            </h3>
            <p className="text-muted-foreground z-2 relative">
              To provide customers with the latest technology products at
              competitive prices with exceptional service. To provide customers
              with the latest technology products at competitive prices with
              exceptional service.
            </p>
            <div className="absolute w-32 h-32 bg-yellow-300 rounded-full bottom-0 left-0 blur-[150px] z-1"></div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border relative overflow-hidden">
            <h3 className="text-xl font-semibold mb-5 font-notosans flex gap-3">
              {" "}
              <IconSettingsCheck className="text-orange-400" />
              Quality Assurance
            </h3>
            <p className="text-muted-foreground relative z-2">
              All products are carefully selected and tested to ensure they meet
              our high quality standards. All products are carefully selected
              and tested to ensure they meet our high quality standards.
            </p>
            <div className="absolute w-32 h-32 bg-yellow-300 rounded-full bottom-0 right-1/2 blur-[150px] z-1"></div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border relative overflow-hidden">
            <h3 className="text-xl font-semibold mb-5 font-notosans flex gap-3">
              {" "}
              <IconCarambola className="text-orange-400" />
              Customer Support
            </h3>
            <p className="text-muted-foreground relative z-2">
              Our dedicated support team is available 24/7 to help you with any
              questions or concerns. Our dedicated support team is available
              24/7 to help you with any questions or concerns.
            </p>
            <div className="absolute w-32 h-32 bg-yellow-300 rounded-full bottom-0 right-0 blur-[150px] z-1"></div>
          </div>
        </div>
      </div>

      <BrandsPage />
    </div>
  );
}
