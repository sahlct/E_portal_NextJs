"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Star, Trash2, ChevronDown } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getProductSkus } from "@/lib/api/sku";
import { getCategories } from "@/lib/api/category";
import { getSubCategories } from "@/lib/api/subCategory";
import { getInnerCategories } from "@/lib/api/innerCategory";
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
import { IconBrandWhatsapp } from "@tabler/icons-react";

interface Category {
  _id: string;
  category_name: string;
}

interface SubCategory {
  _id: string;
  sub_category_name: string;
  category_id: string;
}

interface InnerCategory {
  _id: string;
  inner_category_name: string;
  sub_category_id: string;
  category_id: string;
}

interface Product {
  _id: string;
  sku: string;
  product_sku_name: string;
  thumbnail_image?: string;
  images?: string[];
  price: number;
  mrp: number;
  rating?: number;
  reviews_count?: number;
  description?: string;
  is_new?: boolean;
}

export function CategoryDetailPage() {
  const searchParams = useSearchParams();
  const categorySlugFromUrl = searchParams.get("category");
  const subCategorySlugFromUrl = searchParams.get("subCategory");
  const innerCategorySlugFromUrl = searchParams.get("innerCategory");
  const searchFromUrl = searchParams.get("search") || "";

  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [innerCategories, setInnerCategories] = useState<InnerCategory[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedInnerCategory, setSelectedInnerCategory] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    undefined
  );
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(
    null
  );

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;
  const { addToCart, removeFromCart, items } = useCart();
  const debouncedSearch = useDebounce(searchQuery, 500);

  const selectedBrandName = selectedBrand
    ? brands.find((b) => b._id === selectedBrand)?.brand_name ?? "All Brands"
    : "All Brands";

  const isProductInCart = (productId: string) => {
    return items.some((item) => item._id === productId);
  };

  // Load Categories
  const loadCategories = async () => {
    try {
      const res = await getCategories(1, 100, undefined, 1);
      if (res?.data) {
        setCategories(res.data);
      }
    } catch (err) {
      toast.error("Failed to load categories");
      console.error(err);
    }
  };

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

  // Set category from URL
  useEffect(() => {
    if (categories.length === 0) return;

    if (!categorySlugFromUrl) return;

    const decodedName = deslugify(categorySlugFromUrl);
    const matched = categories.find(
      (c) => c.category_name.toLowerCase() === decodedName
    );

    if (matched) {
      setSelectedCategory(matched._id);
      setCategory(matched);
    }
  }, [categorySlugFromUrl, categories]);

  // Load SubCategories
  useEffect(() => {
    if (!selectedCategory) {
      setSubCategories([]);
      return;
    }

    async function fetchSubCategories() {
      try {
        const res = await getSubCategories(1, 100, undefined, 1, selectedCategory);
        if (res?.data) {
          setSubCategories(res.data);
        }
      } catch (err) {
        console.error("Error loading subcategories:", err);
      }
    }

    fetchSubCategories();
  }, [selectedCategory]);

  // Set SubCategory from URL
  useEffect(() => {
    if (subCategories.length === 0) return;

    if (!subCategorySlugFromUrl) {
      setSelectedSubCategory("");
      setSelectedInnerCategory("");
      return;
    }

    const decodedName = deslugify(subCategorySlugFromUrl);
    const matched = subCategories.find(
      (s) => s.sub_category_name.toLowerCase() === decodedName
    );

    if (matched) {
      setSelectedSubCategory(matched._id);
      setExpandedSubCategory(matched._id);
    }
  }, [subCategorySlugFromUrl, subCategories]);

  // Load InnerCategories for the entire category (not just selected subcategory)
  // This allows us to show arrows for all subcategories that have inner categories
  useEffect(() => {
    if (!selectedCategory) {
      setInnerCategories([]);
      return;
    }

    async function fetchAllInnerCategories() {
      try {
        // Load ALL inner categories for this category (without filtering by subcategory)
        const res = await getInnerCategories(
          1,
          100,
          undefined,
          1,
          selectedCategory,
          undefined // Don't filter by specific subcategory - get all
        );
        if (res?.data) {
          setInnerCategories(res.data);
        }
      } catch (err) {
        console.error("Error loading inner categories:", err);
      }
    }

    fetchAllInnerCategories();
  }, [selectedCategory]);

  // Set InnerCategory from URL
  useEffect(() => {
    if (innerCategories.length === 0) return;

    if (!innerCategorySlugFromUrl) {
      setSelectedInnerCategory("");
      return;
    }

    const decodedName = deslugify(innerCategorySlugFromUrl);
    const matched = innerCategories.find(
      (i) => i.inner_category_name.toLowerCase() === decodedName
    );

    if (matched) {
      setSelectedInnerCategory(matched._id);
    }
  }, [innerCategorySlugFromUrl, innerCategories]);

  // Load Products
  const loadProducts = async () => {
    setLoading(true);
    try {
      // Only pass IDs that are actually selected and have valid length
      const subCatId = selectedSubCategory && String(selectedSubCategory).trim().length > 0 ? selectedSubCategory : undefined;
      const innerCatId = selectedInnerCategory && String(selectedInnerCategory).trim().length > 0 ? selectedInnerCategory : undefined;

      console.log("Loading products with:", {
        category: selectedCategory,
        subCategory: subCatId,
        innerCategory: innerCatId,
        brand: selectedBrand,
      });

      const res = await getProductSkus(
        page,
        20,
        debouncedSearch,
        "1",
        undefined,
        selectedCategory,
        subCatId,
        innerCatId,
        selectedBrand,
        undefined
      );

      setProducts(res?.data || []);
      const total = res?.total || 0;
      setTotalPages(Math.ceil(total / 20) || 1);
    } catch (err) {
      // Log error but don't show toast - let the "No products found" message show instead
      console.error("Failed to load products:", err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadBrands();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    loadProducts();
  }, [
    page,
    debouncedSearch,
    selectedCategory,
    selectedBrand,
    selectedSubCategory,
    selectedInnerCategory,
  ]);

  const handleSubCategoryClick = (subCatId: string, subCatName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("subCategory", slugify(subCatName));
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );
    setSelectedSubCategory(subCatId);
    setSelectedInnerCategory("");
    setPage(1);
  };

  const handleInnerCategoryClick = (
    innerCatId: string,
    innerCatName: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("innerCategory", slugify(innerCatName));
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );
    setSelectedInnerCategory(innerCatId);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedSubCategory("");
    setSelectedInnerCategory("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("subCategory");
    params.delete("innerCategory");
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );
    setPage(1);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading category...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="md:text-4xl text-3xl font-semibold mb-2 text-gray-900 font-notosans">
                {category.category_name}
              </h1>
              <p className="text-muted-foreground">
                Browse our collection of {category.category_name} products
              </p>
            </div>
            <div className="items-end md:flex hidden">
              <div className="flex items-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
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
        </div>

        {/* Search Bar */}
        <div className="mb-6">
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
            <div className="flex md:hidden items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <button
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
                        {!selectedBrand && <Check className="ml-auto h-4 w-4" />}
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

        {/* Main Layout: Sidebar + Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* SIDEBAR */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Categories
                </h3>
                {(selectedSubCategory || selectedInnerCategory) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sub Categories List */}
              <div className="space-y-1">
                {subCategories.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">
                    No subcategories available
                  </p>
                ) : (
                  subCategories.map((subCat) => {
                    // Check if this subcategory has any inner categories
                    const hasInnerCategories = innerCategories.some(
                      (ic) => ic.sub_category_id === subCat._id
                    );
                    const subCatInnerCategories = innerCategories.filter(
                      (ic) => ic.sub_category_id === subCat._id
                    );
                    const isExpanded = expandedSubCategory === subCat._id;

                    return (
                      <div key={subCat._id}>
                        {/* SubCategory Button */}
                        <button
                          onClick={() => {
                            handleSubCategoryClick(
                              subCat._id,
                              subCat.sub_category_name
                            );
                            // Only toggle expansion if there are inner categories
                            if (hasInnerCategories) {
                              setExpandedSubCategory(
                                isExpanded ? null : subCat._id
                              );
                            }
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedSubCategory === subCat._id
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="flex-1 text-left">
                            {subCat.sub_category_name}
                          </span>
                          {/* Show arrow if this subcategory has inner categories - shows even when not selected */}
                          <div className="w-6 flex justify-end">
                            {hasInnerCategories && (
                              <ChevronDown
                                size={16}
                                className={`transform transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </button>

                        {/* Inner Categories - Expandable */}
                        {isExpanded && hasInnerCategories && (
                          <div className="ml-2 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                            {subCatInnerCategories.map((innerCat) => (
                              <button
                                key={innerCat._id}
                                onClick={() =>
                                  handleInnerCategoryClick(
                                    innerCat._id,
                                    innerCat.inner_category_name
                                  )
                                }
                                className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                                  selectedInnerCategory === innerCat._id
                                    ? "bg-green-100 text-green-700"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                {innerCat.inner_category_name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 rounded-lg h-72 animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">No products found</p>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => {
                    const isInCart = isProductInCart(product._id);
                    const title = product.product_sku_name;
                    const image = product.thumbnail_image;
                    const price = product.price;
                    const originalPrice = product.mrp > price ? product.mrp : null;
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
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
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
                                    addToCart(product);
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
    </div>
  );
}
