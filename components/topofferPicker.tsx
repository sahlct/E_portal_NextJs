"use client";

export default function TopOfferTicker() {
  const messages = [
    "Support online 24 hours - Special discount's on all products",
    "Fast shipping on all order - Save big every order",
    "RMA Support - Return Material Authorization guarantee",
  ];

  return (
    <>
      <style jsx>{`
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        .ticker-track {
          display: flex;
          width: max-content;
          min-width: max-content;
          animation: ticker 25s linear infinite;
          will-change: transform;
        }

        .ticker-wrap:hover .ticker-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full bg-[#22415a] text-white overflow-hidden py-2 my-10 ticker-wrap">
        <div className="ticker-track">
          {[...messages, ...messages].map((msg, i) => (
            <div
              key={i}
              className="flex items-center whitespace-nowrap text-sm md:text-base mx-0 md:mx-12"
            >
              {msg}
              <span className="mx-5 md:mx-12 h-4 w-px bg-white/40" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
