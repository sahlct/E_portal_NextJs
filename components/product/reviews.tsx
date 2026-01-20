"use client";

import React, { useState } from "react";
import { Star, ChevronDown } from "lucide-react";

// Types for Reviews
interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

// Dummy Reviews Data
const DUMMY_REVIEWS: Review[] = [
  {
    id: 1,
    author: "Ahmed Hassan",
    rating: 5,
    date: "2025-01-15",
    title: "Excellent Product Quality",
    content:
      "Outstanding build quality with secure packaging. Delivery was quick and product is perfect. Highly recommended!",
    verified: true,
  },
  {
    id: 2,
    author: "Sarah Mohammed",
    rating: 5,
    date: "2025-01-12",
    title: "Great Value and Performance",
    content:
      "Works exactly as described. Smooth performance and great customer service. Will purchase again!",
    verified: true,
  },
  {
    id: 3,
    author: "Fatima Al-Mansouri",
    rating: 4,
    date: "2025-01-10",
    title: "Good Quality, Fast Delivery",
    content:
      "Well-made and functions perfectly. Faster delivery than expected. Solid purchase at this price point.",
    verified: true,
  },
  {
    id: 4,
    author: "Omar Ibrahim",
    rating: 5,
    date: "2025-01-08",
    title: "Best Purchase This Month",
    content:
      "Premium quality with excellent packaging. Exactly what I was looking for. Definitely worth the investment!",
    verified: true,
  },
  {
    id: 5,
    author: "Layla Ahmed",
    rating: 5,
    date: "2025-01-05",
    title: "Highly Recommended",
    content:
      "Exceptional quality and flawless performance. Seller was responsive. Highly recommended!",
    verified: true,
  },
  {
    id: 6,
    author: "Hassan Al-Mazrouei",
    rating: 4,
    date: "2025-01-02",
    title: "Reliable and Durable",
    content:
      "Reliable and built to last. Sleek design, arrived in excellent condition. Product is superb!",
    verified: true,
  },
  {
    id: 7,
    author: "Maryam Khalid",
    rating: 5,
    date: "2024-12-30",
    title: "Perfect Quality and Service",
    content:
      "Top-notch quality and exceptional service. Positive experience from ordering to delivery. Will order again!",
    verified: true,
  },
  {
    id: 8,
    author: "Ali Rashid",
    rating: 4,
    date: "2024-12-28",
    title: "Solid Product",
    content:
      "Well-engineered and practical. Good value for money, arrived safely and quickly. Recommended!",
    verified: true,
  },
  {
    id: 9,
    author: "Noor Al-Shehhi",
    rating: 5,
    date: "2024-12-25",
    title: "Exceeded Expectations",
    content:
      "Truly exceptional with remarkable details. Premium feel and flawless performance. Professional delivery. Highly satisfied!",
    verified: true,
  },
//   {
//     id: 10,
//     author: "Karim Youssef",
//     rating: 5,
//     date: "2024-12-22",
//     title: "Outstanding in Every Way",
//     content:
//       "Outstanding product from start to finish. The quality is impeccable, the delivery was fast, and the customer support team is very helpful. I'm using this product daily and it continues to perform perfectly. Definitely one of my best purchases. Strongly recommended!",
//     verified: true,
//   },
];

export default function ProductReviews() {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const displayedReviews = showAllReviews
    ? DUMMY_REVIEWS.slice(0, 5)
    : DUMMY_REVIEWS.slice(0, 1);

  const averageRating =
    (DUMMY_REVIEWS.reduce((sum, review) => sum + review.rating, 0) /
      DUMMY_REVIEWS.length) *
    100;
  const ratingPercentage = Math.round(averageRating) / 100;

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const ReviewCard = ({ review }: { review: Review }) => (
    <div className="border border-gray-200 rounded-lg p-4 md:p-5 hover:shadow-md transition-shadow duration-200 h-full">
      {/* Review Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base font-notosans">
            {review.author}
          </h3>
          {review.verified && (
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
              ✓ Verified
            </span>
          )}
        </div>
        <span className="text-xs md:text-sm text-gray-500">
          {new Date(review.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Stars and Title */}
      <div className="mb-3">
        <StarRating rating={review.rating} />
        {/* <h4 className="font-semibold text-gray-900 mt-2 text-sm md:text-base">
          {review.title}
        </h4> */}
      </div>

      {/* Review Content */}
      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
        {review.content}
      </p>
    </div>
  );

  return (
    <div className="w-full bg-white py-6 md:py-8 px-0">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 font-notosans">
          Customer Reviews
        </h2>
      </div>

      {/* First Row: Rating Chart + First Review */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Left Side - Rating Summary */}
        <div className="lg:row-span-1">
          <div className="flex items-center justify-center md:gap-10 gap-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 md:p-8">
            <div className="flex flex-col items-center gap-2 mb-2">
              <span className="text-3xl md:text-4xl font-bold text-gray-900 font-notosans">
                {ratingPercentage.toFixed(1)}
              </span>
              <div className="text-sm text-gray-600">out of 5</div>
              <StarRating rating={5} />
              <p className="text-xs text-gray-600 mt-1 font-notosans font-light text-nowrap">
                Based on {DUMMY_REVIEWS.length} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="w-full space-y-3 flex flex-col">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = DUMMY_REVIEWS.filter(
                  (r) => r.rating === stars,
                ).length;
                const percentage = (count / DUMMY_REVIEWS.length) * 100;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-6">
                      {stars} <Star className="w-3 h-3 inline-block mb-0.5 text-yellow-400" />
                    </span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - First Review */}
        {displayedReviews.length > 0 && (
          <ReviewCard review={displayedReviews[0]} />
        )}
      </div>

      {/* Remaining Reviews in 2-Column Grid */}
      {displayedReviews.length > 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {displayedReviews.slice(1).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* View All / Show Less Button */}
      <div className="mt-8 md:mt-12 flex justify-center">
        {!showAllReviews ? (
          <button
            onClick={() => setShowAllReviews(true)}
            className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 border border-gray-500 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
          >
            View All Reviews
            <ChevronDown className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowAllReviews(false)}
            className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            Show Less
            <ChevronDown className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>
    </div>
  );
}
