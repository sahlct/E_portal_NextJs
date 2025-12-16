"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ShoppingCart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { getProductSkuById } from "@/lib/api/sku";
import { getProductById, getVariations } from "@/lib/api/product";
import { useCart } from "@/context/cart-context";

// -----------------------------------------------------
// Types
// -----------------------------------------------------
type VariationMapItem = {
  product_sku_id: string;
  product_sku_name: string;
  sku: string;
  variations: Array<{
    conf_id: string;
    variation_id: string;
    variation_name: string;
    variation_option_id: string;
    variation_option_name: string;
    status: number;
  }>;
};

// -----------------------------------------------------
// Component
// -----------------------------------------------------
export default function SingleProductPage() {
  const params = useParams();
  const skuIdFromUrl = params?.id ?? "";
  const router = useRouter();
  const { addToCart, removeFromCart, items } = useCart();

  const [currentSku, setCurrentSku] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [variationsData, setVariationsData] = useState<VariationMapItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [mainImage, setMainImage] = useState<string | null>(null);

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

  // variation selections { variationId : optionId }
  const [selectedByVariation, setSelectedByVariation] = useState<
    Record<string, string>
  >({});

  // ------------------------------------------
  // Load SKU
  // ------------------------------------------
  const loadSkuById = async (id: string) => {
    try {
      const res = await getProductSkuById(id);
      const s = res?.data ?? null;
      setCurrentSku(s);
      setMainImage(s?.sku_image?.[0] ?? null);
      return s;
    } catch (err) {
      console.error("Failed to load SKU:", err);
      return null;
    }
  };

  // ------------------------------------------
  // Load product + variations
  // ------------------------------------------
  const loadProductAndVariations = async (productId: string) => {
    try {
      const pRes = await getProductById(productId);
      setProduct(pRes?.data ?? null);

      const vRes = await getVariations(productId);
      setVariationsData(vRes?.data ?? []);
    } catch (err) {
      console.error("Failed to load product/variations:", err);
    }
  };

  // ------------------------------------------
  // Initial Load
  // ------------------------------------------
  useEffect(() => {
    if (!skuIdFromUrl) return;

    let mounted = true;

    (async () => {
      setLoading(true);

      const sku = await loadSkuById(skuIdFromUrl);
      if (!sku) {
        setLoading(false);
        return;
      }

      if (sku.product_id?._id) {
        await loadProductAndVariations(sku.product_id._id);
      }

      // Preselect variation options for loaded SKU
      if (sku?.variation_configurations?.length) {
        const sel: Record<string, string> = {};
        for (const vc of sku.variation_configurations) {
          if (vc.variation && vc.option) {
            sel[String(vc.variation._id)] = String(vc.option._id);
          }
        }
        if (mounted) setSelectedByVariation(sel);
      }

      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [skuIdFromUrl]);

  // ------------------------------------------
  // Build SKU option sets for quick availability checking
  // ------------------------------------------
  const skuOptionSetMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const item of variationsData) {
      const set = new Set<string>();
      for (const v of item.variations ?? []) {
        set.add(v.variation_option_id);
      }
      map.set(item.product_sku_id, set);
    }
    return map;
  }, [variationsData]);

  // ------------------------------------------
  // Find matching SKU for selected options
  // ------------------------------------------
  const findMatchingSkuId = (selectedMap: Record<string, string>) => {
    const selectedOptionIds = Object.values(selectedMap).filter(Boolean);

    for (const item of variationsData) {
      const set = skuOptionSetMap.get(item.product_sku_id);
      if (!set) continue;

      let match = true;
      for (const opt of selectedOptionIds) {
        if (!set.has(opt)) {
          match = false;
          break;
        }
      }
      if (match) return item.product_sku_id;
    }
    return null;
  };

  // ------------------------------------------
  // Check whether option is clickable
  // ------------------------------------------
  const isOptionAvailable = (variationId: string, optionId: string) => {
    const sel = { ...selectedByVariation };
    sel[variationId] = optionId;

    const required = Object.values(sel).filter(Boolean);

    for (const item of variationsData) {
      const set = skuOptionSetMap.get(item.product_sku_id);
      if (!set) continue;

      let ok = true;
      for (const r of required) {
        if (!set.has(r)) {
          ok = false;
          break;
        }
      }
      if (ok) return true;
    }
    return false;
  };

  // ------------------------------------------
  // React to selection changes -> update SKU
  // ------------------------------------------
  useEffect(() => {
    if (!currentSku) return;
    const id = findMatchingSkuId(selectedByVariation);
    if (id && id !== currentSku._id) {
      loadSkuById(id);
      router.replace(`/public/products/${id}`);
    }
  }, [selectedByVariation]);

  // ------------------------------------------
  // Variation click handler
  // ------------------------------------------
  const handleSelectOption = (variationId: string, optionId: string) => {
    setSelectedByVariation((prev) => {
      const updated = { ...prev };
      if (updated[variationId] === optionId) {
        delete updated[variationId];
      } else {
        updated[variationId] = optionId;
      }
      return updated;
    });
  };

  // ------------------------------------------
  // Cart Logic
  // ------------------------------------------
  const isInCart = currentSku
    ? items.some((item) => item.id === currentSku._id)
    : false;

  const handleAddOrRemove = () => {
    console.log("currentSKU", currentSku);
    if (!currentSku) return;
    if (isInCart) {
      removeFromCart(currentSku._id);
    } else {
      addToCart({
        id: currentSku._id,
        title: currentSku.product_sku_name,
        price: Number(currentSku.price || 0),
        image: currentSku.thumbnail_image || currentSku.sku_image?.[0] || null,
        category: currentSku.product_id?.category_id ?? null,
      });
    }
  };

  const handleBuyNow = () => {
    if (!currentSku) return;
    if (!isInCart) {
      addToCart({
        id: currentSku._id,
        title: currentSku.product_sku_name,
        price: Number(currentSku.price || 0),
        image: currentSku.thumbnail_image || currentSku.sku_image?.[0] || null,
        category: currentSku.product_id?.category_id ?? null,
      });
    }
    router.push("/public/cart");
  };

  // ------------------------------------------
  // UI Loading
  // ------------------------------------------
  if (loading || !currentSku) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  const thumbnails = currentSku.sku_image ?? [];

  // -----------------------------------------------------
  // UI Layout
  // -----------------------------------------------------
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 lg:px-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 cursor-pointer mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 md:gap-10 gap-6">
          {/* ---------------- LEFT (FIXED) ---------------- */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 h-fit">
            {/* <div className="bg-gray-50 border rounded-xl p-4"> */}
            <div className="w-full h-80 md:h-96 flex items-center justify-center bg-white border rounded-lg overflow-hidden">
              {mainImage ? (
                <img
                  src={server_url + mainImage}
                  alt="Product"
                  className="object-contain max-h-full max-w-full"
                />
              ) : (
                <div>No image</div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 justify-around p-0.5 overflow-x-auto hide-scrollbar">
              {thumbnails.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`sm:w-20 sm:h-20 h-16 w-16 border rounded-md overflow-hidden cursor-pointer ${
                    img === mainImage ? "ring-2 ring-cyan-600" : ""
                  }`}
                >
                  <img
                    src={server_url + img}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </button>
              ))}
            </div>
            {/* </div> */}
          </div>

          {/* ---------------- RIGHT ---------------- */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1 font-notosans">
              {currentSku.product_sku_name}
            </h1>
            <p className="text-gray-500 mb-3">
              {currentSku.product_id?.product_name}
            </p>

            {/* Price */}
            <div className="flex items-end gap-3 mb-2 md:mb-4">
              <div className="md:text-3xl text-2xl font-bold text-cyan-700 font-notosans">
                AED {Number(currentSku.price).toLocaleString()}
              </div>
              {currentSku.mrp ? (
                <div className="line-through text-gray-400">
                  AED {Number(currentSku.mrp).toLocaleString()}
                </div>
              ) : null}
            </div>

            {/* Description */}
            <p className="text-gray-700">{currentSku.description}</p>

            <div className="flex gap-3">
              <div className="bg-pink-100 px-4 py-1 rounded-full text-black">Brand : {currentSku.product_id?.brand_id?.brand_name}</div>

              {/* Stock */}
              <div className="flex gap-3 items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentSku.is_out_of_stock
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {currentSku.is_out_of_stock ? "Out of Stock" : "In Stock"}
                </span>

                {/* <span className="text-gray-500 text-sm">
                Max per order: {currentSku.single_order_limit}
              </span> */}
              </div>
            </div>

            {/* Variations */}
            {product?.variations?.length > 0 && (
              <div className="pt-3 space-y-4">
                {product.variations.map((v: any) => (
                  <div key={v._id}>
                    <h3 className="font-medium mb-2">{v.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {v.options.map((opt: any) => {
                        const selected = selectedByVariation[v._id] === opt._id;
                        const disabled = !isOptionAvailable(v._id, opt._id);

                        return (
                          <button
                            key={opt._id}
                            disabled={disabled}
                            onClick={() =>
                              !disabled && handleSelectOption(v._id, opt._id)
                            }
                            className={`px-4 py-2 rounded-lg border text-sm cursor-pointer transition ${
                              selected
                                ? "bg-cyan-700 text-white border-cyan-700"
                                : "bg-white text-gray-700 border-gray-300"
                            } ${
                              disabled
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:scale-[1.02]"
                            }`}
                          >
                            {opt.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddOrRemove}
                className={`flex-1 flex items-center justify-center gap-2 md:py-3 py-2 rounded-lg font-medium cursor-pointer transition ${
                  isInCart
                    ? "bg-gradient-to-r from-red-500 to-red-900 text-white hover:opacity-90"
                    : "bg-gradient-to-r from-yellow-500 to-orange-400 text-white hover:opacity-95"
                }`}
              >
                {isInCart ? (
                  <>
                    <Trash2 className="w-4 h-4" /> Remove from cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 md:py-3 py-2 rounded-lg font-medium border border-cyan-700 text-cyan-700 hover:bg-cyan-50 cursor-pointer"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
