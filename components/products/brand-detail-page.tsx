"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Star, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getProductSkus } from "@/lib/api/sku";
import { getBrands } from "@/lib/api/brands";
import { useDebounce } from "@/hooks/debounce";
import { useCart } from "@/context/cart-context";
import { deslugify, slugify } from "@/lib/slugify";

interface Brand {
  _id: string;
  brand_name: string;
  brand_image?: string;
}

interface Product {
  _id: string;
  product_sku_name: string;
  sku: string;
  price: number;
  mrp?: number;
  thumbnail_image?: string;
  rating?: number;
  reviews_count?: number;
  is_new?: boolean;
}

export function BrandDetailPage() {
  const searchParams = useSearchParams();
  const brandSlugFromUrl = searchParams.get("brand");
  const searchFromUrl = searchParams.get("search") || "";

  const [brand, setBrand] = useState<Brand | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;
  const { addToCart, removeFromCart, items } = useCart();
  const debouncedSearch = useDebounce(searchQuery, 500);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const isProductInCart = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  // Load all brands
  const loadBrands = async () => {
    try {
      const res = await getBrands(1, 100, undefined, 1);
      if (res?.data) {
        setBrands(res.data);
      }
    } catch (err) {
      console.error("Error loading brands:", err);
    }
  };

  // Set brand from URL
  useEffect(() => {
    if (brands.length === 0) return;

    if (!brandSlugFromUrl) return;

    const decodedName = deslugify(brandSlugFromUrl);
    const matched = brands.find((b) => b.brand_name.toLowerCase() === decodedName);

    if (matched) {
      setSelectedBrand(matched._id);
      setBrand(matched);
    }
  }, [brandSlugFromUrl, brands]);

  // Load Products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProductSkus(
        page,
        20,
        debouncedSearch,
        "1",
        undefined, // product_id
        undefined, // category_id
        undefined, // sub_category_id
        undefined, // inner_category_id
        selectedBrand || undefined, // brand_id
        undefined // is_new
      );

      setProducts(res?.data || []);
      const total = res?.total || 0;
      setTotalPages(Math.ceil(total / 20) || 1);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Scroll logic for brands sidebar
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setShowLeft(el.scrollLeft > 5);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    if (brands.length) {
      setTimeout(checkScroll, 50);
    }
  }, [brands]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    if (!selectedBrand) return;
    loadProducts();
  }, [page, debouncedSearch, selectedBrand]);

  const handleBrandClick = (brandId: string, brandName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("brand", slugify(brandName));
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );
    setSelectedBrand(brandId);
    setBrand(brands.find((b) => b._id === brandId) || null);
    setPage(1);
  };

  if (!brand) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading brand...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="md:text-4xl text-3xl font-semibold mb-2 text-gray-900 font-notosans">
            {brand.brand_name}
          </h1>
          <p className="text-muted-foreground">
            Browse {brand.brand_name} products
          </p>
        </div>

        {/* Search Bar */}
        {/* <div className="mb-8">
          <div className="relative flex gap-2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="flex-1 pl-12 pr-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div> */}

        {/* BRANDS CAROUSEL SLIDER */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            SELECT BRAND
          </h3>

          <div className="relative">
            {/* LEFT ARROW */}
            {showLeft && (
              <button
                onClick={() => scroll("left")}
                className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-md"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* BRANDS CAROUSEL */}
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-2 touch-pan-x justify-start sm:justify-start"
            >
              {brands.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No brands available</p>
              ) : (
                brands.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => handleBrandClick(b._id, b.brand_name)}
                    className="shrink-0 flex flex-col items-center gap-3 cursor-pointer group"
                  >
                    {/* Brand Card */}
                    <div
                      className={`
                        w-20 h-20 sm:w-24 sm:h-24
                        rounded-lg overflow-hidden
                        border-2 transition-all
                        flex items-center justify-center p-2
                        ${
                          selectedBrand === b._id
                            ? "border-blue-600 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-gray-50 hover:shadow-md"
                        }
                      `}
                    >
                      {b.brand_image ? (
                        <img
                          src={server_url + b.brand_image}
                          alt={b.brand_name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-400">
                          {b.brand_name[0]}
                        </span>
                      )}
                    </div>

                    {/* Brand Name */}
                    <span className="text-xs sm:text-sm font-medium text-gray-700 text-center max-w-20 sm:max-w-24 line-clamp-2">
                      {b.brand_name}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* RIGHT ARROW */}
            {showRight && (
              <button
                onClick={() => scroll("right")}
                className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-md"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-lg h-72 animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => {
                const isInCart = isProductInCart(product._id);
                const title = product.product_sku_name;
                const image = product.thumbnail_image;
                const price = product.price;
                const originalPrice = product.mrp && product.mrp > price ? product.mrp : null;
                const discountPercent = originalPrice
                  ? Math.round(((originalPrice - price) / originalPrice) * 100)
                  : 0;

                return (
                  <Link
                    key={product._id}
                    href={`/public/products/${slugify(product.sku)}`}
                    className="contents"
                  >
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                      {/* Image Container */}
                      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden p-2">
                        {image ? (
                          <img
                            src={server_url + image}
                            alt={title}
                            className="w-full h-full object-contain hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                        {product.is_new && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            New
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                          {title}
                        </h3>

                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  fill={
                                    i < Math.round(product.rating!)
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {product.reviews_count || 0} reviews
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{price}
                            </span>
                            {originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{originalPrice}
                              </span>
                            )}
                          </div>
                          {discountPercent > 0 && (
                            <div className="text-xs text-green-600 font-semibold mt-1">
                              {discountPercent}% off
                            </div>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <div className="mt-auto flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (isInCart) {
                                removeFromCart(product._id);
                                toast.success("Removed from cart");
                              } else {
                                addToCart({
                                  id: product._id,
                                  title: product.product_sku_name,
                                  image: product.thumbnail_image || "",
                                  category: "",
                                  price: product.price,
                                });
                                toast.success("Added to cart");
                              }
                            }}
                            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                              isInCart
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {isInCart ? (
                              <div className="flex items-center justify-center gap-2">
                                <Trash2 size={14} />
                                Remove
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                <ShoppingCart size={14} />
                                Add
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isVisible =
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1);

                    if (!isVisible && i > 0 && i < totalPages - 1) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          page === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
