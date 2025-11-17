"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBlogById } from "@/lib/api/blogs";
import { CalendarDays, MapPin, Loader2 } from "lucide-react";

export default function BlogDetailsPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const res = await getBlogById(id as string);
      setBlog(res?.data);
    } catch (err) {
      console.error("Error loading blog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Blog not found.</p>
      </div>
    );
  }

  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full h-72 md:h-[420px] bg-muted overflow-hidden">
        <img
          src={blog.blog_thumbnail || "/placeholder.svg"}
          alt={blog.blog_title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end">
          <div className="max-w-6xl mx-auto px-6 py-8 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              {blog.blog_title}
            </h1>
            {blog.blog_sec_title && (
              <p className="text-lg text-gray-200 mb-3">
                {blog.blog_sec_title}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              {formattedDate && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> {formattedDate}
                </span>
              )}
              {blog.place && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {blog.place}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Text */}
          <div className="lg:col-span-2 space-y-6">
            <div className="prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
              {blog.description ? (
                <p className="whitespace-pre-line">{blog.description}</p>
              ) : (
                <p className="text-muted-foreground italic">
                  No description provided.
                </p>
              )}
            </div>

            {/* Other Images */}
            {Array.isArray(blog.other_images) && blog.other_images.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-3">
                  Additional Images
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {blog.other_images.map((img: string, i: number) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border border-border hover:shadow-md transition"
                    >
                      <img
                        src={img}
                        alt={`Blog image ${i + 1}`}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-card border border-border rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-lg mb-3 text-foreground">
                Blog Details
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Status:</span>
                  {blog.status === 1 ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </li>
                {formattedDate && (
                  <li className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {formattedDate}
                  </li>
                )}
                {blog.place && (
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {blog.place}
                  </li>
                )}
                <li className="text-xs text-gray-400">
                  Created:{" "}
                  {new Date(blog.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </li>
              </ul>
            </div>

            {/* Thumbnail Preview */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <img
                src={blog.blog_thumbnail || "/placeholder.svg"}
                alt="Thumbnail"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center text-sm text-muted-foreground">
                Thumbnail Preview
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
