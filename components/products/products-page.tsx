"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getProductSkus } from "@/lib/api/sku";
import { getCategories } from "@/lib/api/category";
import { useDebounce } from "@/hooks/debounce";
import { useCart } from "@/context/cart-context";

interface Category {
  _id: string;
  category_name: string;
}

export function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addToCart, removeFromCart, items } = useCart();
  const debouncedSearch = useDebounce(searchQuery, 500);

  // ✅ Load Categories
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

  // ✅ Load Products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProductSkus(
        page,
        20,
        debouncedSearch,
        "1",
        undefined,
        selectedCategory === "all" ? undefined : selectedCategory
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
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, debouncedSearch, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Products</h1>
          <p className="text-muted-foreground">Browse our collection of premium products</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setSelectedCategory(cat._id);
                setPage(1);
              }}
              className={`px-4 cursor-pointer py-2 rounded-full border text-sm font-medium transition-all ${
                selectedCategory === cat._id
                  ? "bg-primary text-white border-primary"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const isInCart = items.some((item) => item.id === product._id);
              const title = product.product_sku_name;
              const image = product.thumbnail_image;
              const description = product.description;
              const price = product.price;
              const originalPrice = product.mrp > price ? product.mrp : null;
              const is_new = product.is_new === true;
              const id = product._id;

              return (
                <div
                  key={id}
                  className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all group"
                >
                  <Link href={`/product/${id}`}>
                    <div className="relative h-48 overflow-hidden bg-secondary">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {is_new && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                          New
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4 flex flex-col">
                    <Link href={`/product/${id}`}>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-yellow-600 transition-colors">
                        {title}
                      </h3>
                    </Link>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{description}</p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-blue-600">₹{price}</span>
                      {originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>
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
                            Remove from Cart
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

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 border rounded-md bg-white disabled:opacity-50 hover:bg-gray-100"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-4 py-2 border rounded-md bg-white disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
