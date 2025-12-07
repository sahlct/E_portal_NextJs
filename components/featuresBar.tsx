import {
  Truck,
  PiggyBank,
  Clock4,
  DollarSign,
  Percent,
} from "lucide-react";

export default function FeaturesBar() {
  const features = [
    {
      icon: <Truck className="w-10 h-10 text-orange-500" />,
      title: "Free Delivery",
      subtitle: "Free shipping on all order",
    },
    {
      icon: <PiggyBank className="w-10 h-10 text-orange-500" />,
      title: "Big Saving Shop",
      subtitle: "Save big every order",
    },
    {
      icon: <Clock4 className="w-10 h-10 text-orange-500" />,
      title: "Online Support 24/7",
      subtitle: "Support online 24 hours a day",
    },
    {
      icon: <DollarSign className="w-10 h-10 text-orange-500" />,
      title: "Money Back Return",
      subtitle: "Back guarantee under 7 days",
    },
    {
      icon: <Percent className="w-10 h-10 text-orange-500" />,
      title: "Member Discount",
      subtitle: "On every order over $120.00",
    },
  ];

  return (
    <div className="p-5">
    <div className="border overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((item, index) => (
          <div
            key={index}
            className="
              flex items-center gap-4 p-6 
              border-b sm:border-b-0 sm:border-r 
              last:border-r-0
              transition-all duration-300 group
            "
          >
            {/* ICON WITH FLIP ANIMATION ON HOVER */}
            <div className="transition-transform duration-500 group-hover:rotate-y-180">
              {item.icon}
            </div>

            {/* TEXT CONTENT */}
            <div>
              <h3 className="font-semibold text-lg group-hover:text-orange-600">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
