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
      icon: <Truck className="md:w-10 md:h-10 h-7 w-7 text-orange-500" />,
      title: "Fast Delivery",
      subtitle: "Fast shipping on all order",
    },
    {
      icon: <PiggyBank className="md:w-10 md:h-10 h-8 w-8 text-orange-500" />,
      title: "Big Saving Shop",
      subtitle: "Save big every order",
    },
    {
      icon: <Clock4 className="md:w-10 md:h-10 h-8 w-8 text-orange-500" />,
      title: "Online Support",
      subtitle: "Support online 24 hours",
    },
    {
      icon: <DollarSign className="md:w-10 md:h-10 h-8 w-8 text-orange-500" />,
      title: "RMA Support",
      subtitle: "Return Authorization",
    },
    {
      icon: <Percent className="md:w-10 md:h-10 h-8 w-8 text-orange-500" />,
      title: "Special Discount's",
      subtitle: "discount's on all products",
    },
  ];

  return (
    <div className="p-5">
    <div className="border overflow-hidden">
      <div className="grid grid-cols-2 lg:grid-cols-5">
        {features.map((item, index) => (
          <div
            key={index}
            className="
              flex flex-col lg:flex-row items-center lg:gap-4 gap-2 lg:p-6 p-2 
              border-b sm:border-b-0 border-r 
              last:border-r-0
              transition-all duration-300 group last:col-span-2 lg:last:col-span-1
            "
          >
            {/* ICON WITH FLIP ANIMATION ON HOVER */}
            <div className="transition-transform duration-500 group-hover:rotate-y-180">
              {item.icon}
            </div>

            {/* TEXT CONTENT */}
            <div>
              <h3 className="font-semibold md:text-lg text-md group-hover:text-orange-600">
                {item.title}
              </h3>
              <p className="text-gray-500 lg:text-sm text-xs">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
