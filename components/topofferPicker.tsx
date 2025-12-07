"use client";

export default function TopOfferTicker() {
  const messages = [
    "FREE Delivery over ₹499. Fulfilled by Amazon.",
    "Flat $10 Instant Cashback on Wallet & UPI Transaction",
    "Mega offers now on Amazon Fresh | Up to 40% Off",
  ];

  return (
    <>
      {/* Inline CSS for animation */}
      <style jsx>{`
        @keyframes scrollTicker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-ticker {
          animation: scrollTicker 25s linear infinite;
          white-space: nowrap;
        }

        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full bg-[#22415a] text-white overflow-hidden py-2 my-10">
        <div className="flex items-center animate-ticker">
          {[...messages, ...messages].map((msg, i) => (
            <div key={i} className="mx-10 flex items-center text-sm md:text-base">
              {msg}
              <span className="mx-10 h-4 w-px bg-white/40" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
