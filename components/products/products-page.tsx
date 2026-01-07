"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getProductSkus } from "@/lib/api/sku";
import { getCategories } from "@/lib/api/category";
import { useDebounce } from "@/hooks/debounce";
import { useCart } from "@/context/cart-context";
import { getBrands } from "@/lib/api/brands";
import { deslugify, slugify } from "@/lib/slugify";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

interface Category {
  _id: string;
  category_name: string;
}

export function ProductsPage() {
  const searchParams = useSearchParams();
  const categorySlugFromUrl = searchParams.get("category");
  const searchFromUrl = searchParams.get("search") || "";
  const [categoryReady, setCategoryReady] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<any[]>([]);
  const categoryRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    undefined
  );

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

  const { addToCart, removeFromCart, items } = useCart();
  const debouncedSearch = useDebounce(searchQuery, 500);

  const selectedBrandName = selectedBrand
    ? brands.find((b) => b._id === selectedBrand)?.brand_name ?? "All Brands"
    : "All Brands";

  //  Load Categories
  const loadCategories = async () => {
    try {
      const res = await getCategories(1, 100, undefined, 1);
      if (res?.data) {
        setCategories([{ _id: "all", category_name: "All" }, ...res.data]);
      }
    } catch (err) {
      toast.error("Failed to load categories");
      console.error(err);
    }
  };

  useEffect(() => {
    if (categories.length === 0) return;

    if (!categorySlugFromUrl || categorySlugFromUrl === "all") {
      setSelectedCategory("all");
      setCategoryReady(true);
      return;
    }

    const decodedName = deslugify(categorySlugFromUrl);

    const matched = categories.find(
      (c) => c.category_name.toLowerCase() === decodedName
    );

    if (matched) {
      setSelectedCategory(matched._id);
    } else {
      setSelectedCategory("all");
    }

    setCategoryReady(true);
  }, [categorySlugFromUrl, categories]);

  // Load Brands
  const loadBrands = async () => {
    try {
      const res = await getBrands(1, 100, undefined, 1);
      setBrands(res?.data || []);
    } catch (err) {
      toast.error("Failed to load brands");
      console.error(err);
    }
  };

  //  Load Products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProductSkus(
        page,
        20,
        debouncedSearch,
        "1",
        undefined,
        selectedCategory === "all" ? undefined : selectedCategory,
        selectedBrand
      );

      setProducts(res?.data || []);
      const total = res?.total || 0;
      setTotalPages(Math.ceil(total / 20) || 1);
    } catch (err) {
      toast.error("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCategory) return;

    const el = categoryRefs.current[selectedCategory];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedCategory]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  }, [debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [selectedBrand]);

  useEffect(() => {
    loadCategories();
    loadBrands();
  }, []);

  useEffect(() => {
    if (!categoryReady) return;
    loadProducts();
  }, [page, debouncedSearch, selectedCategory, selectedBrand, categoryReady]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="md:mb-8 mb-4 flex justify-between">
          <div>
            <h1 className="md:text-4xl text-3xl font-semibold mb-2 text-gray-900 font-notosans">
              Products
            </h1>
            <p className="text-muted-foreground">
              Browse our collection of premium products
            </p>
          </div>
          <div className="items-end md:flex hidden">
            <div className="flex items-end">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    // variant="outline"
                    role="combobox"
                    className="w-[200px] cursor-pointer flex border rounded-md md:px-3 py-2 justify-between items-center border-yellow-500"
                  >
                    {selectedBrandName}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-[200px] p-0 border-yellow-500 bg-white">
                  <Command>
                    <CommandInput placeholder="Search brand..." />
                    <CommandEmpty>No brand found.</CommandEmpty>

                    <CommandGroup>
                      <CommandItem
                        onSelect={() => setSelectedBrand(undefined)}
                        className="cursor-pointer"
                      >
                        All Brands
                        {!selectedBrand && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>

                      {brands.map((brand) => (
                        <CommandItem
                          key={brand._id}
                          onSelect={() => setSelectedBrand(brand._id)}
                          className="cursor-pointer"
                        >
                          {brand.brand_name}
                          {selectedBrand === brand._id && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Search + Categories (Responsive Layout) */}
        <div className="md:mb-6 mb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search (1/3 on desktop) */}
            <div className="relative md:w-1/3 flex gap-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 md:py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <div className="flex md:hidden items-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      // variant="outline"
                      role="combobox"
                      className="w-[140px] cursor-pointer flex border rounded-md px-3 py-2 justify-between items-center border-yellow-500"
                    >
                      {selectedBrandName}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[150px] p-0 border-yellow-500 bg-white">
                    <Command>
                      <CommandInput placeholder="Search brand..." />
                      <CommandEmpty>No brand found.</CommandEmpty>

                      <CommandGroup>
                        <CommandItem
                          onSelect={() => setSelectedBrand(undefined)}
                          className="cursor-pointer"
                        >
                          All Brands
                          {!selectedBrand && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>

                        {brands.map((brand) => (
                          <CommandItem
                            key={brand._id}
                            onSelect={() => setSelectedBrand(brand._id)}
                            className="cursor-pointer"
                          >
                            {brand.brand_name}
                            {selectedBrand === brand._id && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Categories (scrollable like YouTube) */}
            <div
              className="
        md:w-2/3 flex gap-2 overflow-x-auto 
        no-scrollbar whitespace-nowrap
      "
            >
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  ref={(el) => {
                    categoryRefs.current[cat._id] = el;
                  }}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());

                    if (cat._id === "all") {
                      params.delete("category");
                      setSelectedCategory("all");
                    } else {
                      params.set("category", slugify(cat.category_name));
                      setSelectedCategory(cat._id);
                    }

                    window.history.replaceState(
                      null,
                      "",
                      `${window.location.pathname}?${params.toString()}`
                    );

                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full border text-sm font-medium shrink-0 transition-all cursor-pointer ${
                    selectedCategory === cat._id
                      ? "bg-primary text-white border-primary"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {cat.category_name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            Loading...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-x-16 md:gap-y-10 gap-x-7">
            {products.map((product) => {
              const isInCart = items.some((item) => item.id === product._id);
              const title = product.product_sku_name;
              const image = product.thumbnail_image;
              const description = product.description;
              const price = product.price;
              const originalPrice = product.mrp > price ? product.mrp : null;
              const is_new = product.is_new === true;
              const id = product._id;
              const sku = product.sku;

              return (
                <div
                  key={id}
                  className="rounded-lg overflow-hidden transition-all group"
                >
                  <Link href={`/public/products/${slugify(sku)}`}>
                    <div className="relative md:h-56 h-36 overflow-hidden rounded-lg bg-[#f5f5f9] p-2">
                      <img
                        src={server_url + image || "/placeholder.svg"}
                        alt={title}
                        className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105  "
                      />
                      {is_new && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                          New
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="py-4 flex flex-col">
                    <Link href={`/public/products/${slugify(sku)}`}>
                      <h3 className="font-semibold text-md mb-2 md:line-clamp-2 hover:text-yellow-600 transition-colors font-notosans line-clamp-1">
                        {title}
                      </h3>
                    </Link>

                    {/* star rating  */}
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 fill-current ${
                            star <= product.rating
                              ? "text-yellow-500"
                              : "text-yellow-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs ms-3">
                        {product?.rating || "4.5/5"}
                      </span>
                    </div>

                    {/* <p className="text-xs text-gray-600 line-clamp-2 sm:mb-3 mb-2">
                      {description}
                    </p> */}

                    {/* Price */}
                    <div className="flex flex-col-reverse sm:flex-row md:items-center items-start sm:gap-2 hap-1 sm:mb-4 mb-3">
                      <span className="md:text-lg text-md font-bold text-blue-600 font-notosans">
                        AED {price}
                      </span>
                      {originalPrice && (
                        <span className="sm:text-sm text-xs text-muted-foreground line-through">
                          AED {originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex w-full">
                      <button
                        onClick={() => {
                          if (isInCart) {
                            removeFromCart(id);
                          } else {
                            addToCart({
                              id,
                              title,
                              price,
                              image,
                              category: product.product_id?.category_id || "",
                            });
                          }
                        }}
                        className={`flex-1 cursor-pointer py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                          isInCart
                            ? "bg-gradient-to-r from-red-900 to-red-500 text-white hover:opacity-90"
                            : "bg-gradient-to-r from-yellow-500 to-orange-400 text-white hover:opacity-90"
                        }`}
                      >
                        {isInCart ? (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Remove
                            <span className="hidden sm:inline px-0 mx-0">
                              from
                            </span>
                            Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </>
                        )}
                      </button>

                      {/* <Link href={`/product/${id}`} className="flex-1">
                        <button className="w-full border border-yellow-600 text-yellow-600 py-1.5 rounded-lg text-sm font-semibold hover:bg-yellow-500/10 transition-colors">
                          Details
                        </button>
                      </Link> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className={`px-4 py-2 border rounded-md bg-white hover:bg-gray-100 
        ${page === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              Prev
            </button>

            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className={`px-4 py-2 border rounded-md bg-white hover:bg-gray-100 
        ${
          page === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
