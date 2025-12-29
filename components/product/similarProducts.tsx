"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getSimilarProducts } from "@/lib/api/product";
import { slugify } from "@/lib/slugify";

interface Props {
  productId: string;
}

export default function SimilarProducts({ productId }: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL || "";

  useEffect(() => {
    if (!productId) return;

    (async () => {
      try {
        setLoading(true);
        const res = await getSimilarProducts(productId, 8);
        setProducts(res?.data || []);
      } catch (err) {
        console.error("Failed to load similar products", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  if (loading) {
    return (
      <div className="pt-12 text-center text-gray-500">
        Loading similar products...
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className="md:pt-14 pt-7">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">
        Similar Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-10">
        {products.map((p) => (
          <Link
            key={p._id}
            href={`/public/products/${slugify(p.skus[0].product_sku_name)}`}
            className="group border rounded-lg p-3 hover:shadow-md transition"
          >
            <div className="h-32 md:h-60 flex items-center justify-center bg-gray-50 rounded-md mb-3 overflow-hidden">
              {p.product_image ? (
                <img
                  src={server_url + p.product_image}
                  alt={p.product_name}
                  className="object-contain h-full w-full group-hover:scale-105 transition"
                />
              ) : (
                <span className="text-sm text-gray-400">No image</span>
              )}
            </div>

            <h3 className="text-sm font-medium line-clamp-1 text-gray-900">
              {p.product_name}
            </h3>
            {/* <p>
                {p.}
            </p> */}

            {/* {p.brand_name && (
              <p className="text-xs text-gray-500 mt-1">
                {p.brand_name}
              </p>
            )} */}
          </Link>
        ))}
      </div>
    </div>
  );
}
