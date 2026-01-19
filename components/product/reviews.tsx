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
      "This product exceeded my expectations. The build quality is outstanding and it arrived in perfect condition. The packaging was secure and the delivery was quick. I'm very satisfied with my purchase and would highly recommend this to anyone looking for reliability and value for money.",
    verified: true,
  },
  {
    id: 2,
    author: "Sarah Mohammed",
    rating: 5,
    date: "2025-01-12",
    title: "Great Value and Performance",
    content:
      "Amazing product! It works exactly as described. The performance is smooth and efficient. I've been using it for a couple of weeks now and it hasn't disappointed me once. Great customer service too. Will definitely purchase again.",
    verified: true,
  },
  {
    id: 3,
    author: "Fatima Al-Mansouri",
    rating: 4,
    date: "2025-01-10",
    title: "Good Quality, Fast Delivery",
    content:
      "Very pleased with this purchase. The item is well-made and functions perfectly. Delivery was faster than expected. Minor note: the product could come with more accessories, but overall it's a solid purchase at this price point.",
    verified: true,
  },
  {
    id: 4,
    author: "Omar Ibrahim",
    rating: 5,
    date: "2025-01-08",
    title: "Best Purchase This Month",
    content:
      "Absolutely fantastic! The quality is premium and it arrived promptly. The product is exactly what I was looking for. Very impressed with the attention to detail in the packaging and product design. Definitely worth the investment.",
    verified: true,
  },
  {
    id: 5,
    author: "Layla Ahmed",
    rating: 5,
    date: "2025-01-05",
    title: "Highly Recommended",
    content:
      "Outstanding product! I was initially skeptical but after receiving and using it, I'm completely satisfied. The quality is exceptional and it performs flawlessly. The seller was also very responsive to my questions. Highly recommended for anyone considering this product.",
    verified: true,
  },
  {
    id: 6,
    author: "Hassan Al-Mazrouei",
    rating: 4,
    date: "2025-01-02",
    title: "Reliable and Durable",
    content:
      "Great product overall. Very reliable and built to last. The design is sleek and modern. It arrived in excellent condition. The only reason I'm giving 4 stars instead of 5 is that the manual could be more detailed, but the product itself is superb.",
    verified: true,
  },
  {
    id: 7,
    author: "Maryam Khalid",
    rating: 5,
    date: "2024-12-30",
    title: "Perfect Quality and Service",
    content:
      "I couldn't ask for better. The product quality is top-notch and the customer service was exceptional. Every aspect of my experience was positive, from ordering to delivery. This company clearly cares about customer satisfaction. Will be ordering again!",
    verified: true,
  },
  {
    id: 8,
    author: "Ali Rashid",
    rating: 4,
    date: "2024-12-28",
    title: "Solid Product",
    content:
      "This is a solid, well-engineered product. It does exactly what it's supposed to do without any issues. The design is practical and user-friendly. Good value for the money. Arrived safely and quickly. Would recommend to friends and family.",
    verified: true,
  },
  {
    id: 9,
    author: "Noor Al-Shehhi",
    rating: 5,
    date: "2024-12-25",
    title: "Exceeded Expectations",
    content:
      "I was expecting a decent product but this is truly exceptional. The attention to detail is remarkable. It feels premium and works flawlessly. The delivery team was professional and helpful. This is exactly what quality looks like. Highly satisfied!",
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
    ? DUMMY_REVIEWS
    : DUMMY_REVIEWS.slice(0, 3);

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
