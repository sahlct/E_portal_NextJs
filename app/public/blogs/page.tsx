"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { getBlogs } from "@/lib/api/blogs";

type Blog = {
  _id: string;
  blog_title: string;
  blog_sec_title?: string;
  blog_thumbnail?: string;
  description?: string;
  date?: string; // ISO
  place?: string;
  status: number;
  created_at?: string;
  updated_at?: string;
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const res = await getBlogs(1, 10, undefined, 1);
      setBlogs(res?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-16 py-8">
        {/* Header */}
        <section className="mb-10">
          <div
            style={{
              backgroundImage:
                "url('https://wordpress.templatetrip.com/WCM003_egudgets/wp-content/uploads/2023/08/banner-04.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className="md:rounded-2xl overflow-hidden shadow-sm md:h-[300px] h-52"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
              <div>
                <h1 className="md:text-4xl text-2xl lg:text-5xl font-medium text-primary-foreground mb-3 font-notosans">
                  Latest from Our Blog
                </h1>
                <p className="text-primary-foreground/90 text-base md:text-lg">
                  Insights, launches, and behind-the-scenes stories from our
                  team. Explore curated reads to stay up to date.
                </p>
              </div>
              {/* <div className="bg-primary-foreground/10 rounded-xl h-56 md:h-64 flex items-center justify-center">
                <img
                  src="https://img.freepik.com/free-vector/electronics-store-twitter-header_23-2151173093.jpg?semt=ais_hybrid&w=740&q=80"
                  alt="Blog Hero"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div> */}
            </div>
          </div>
        </section>

        {/* Blogs Grid */}
        <section>
          <h2 className="text-3xl font-medium mb-6 font-notosans">Featured Articles</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-12 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="h-44 bg-muted animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                    <div className="h-10 w-full bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 border border-dashed rounded-2xl">
              <p className="text-muted-foreground">
                No blogs available right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-12 gap-6">
              {blogs.map((b) => (
                <BlogCard key={b._id} blog={b} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ---------------- Blog Card ---------------- */
function BlogCard({ blog }: { blog: Blog }) {
  const server_url = process.env.NEXT_PUBLIC_SERVER_URL || "";
  const dateStr = blog.date
    ? new Date(blog.date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-52 bg-secondary">
        <img
          src={server_url + blog.blog_thumbnail || "/placeholder.svg"}
          alt={blog.blog_title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Status chip if needed */}
        {/* {blog.status === 1 && (
          <span className="absolute top-3 left-3 text-xs bg-green-600/90 text-white px-2 py-1 rounded-md">
            Published
          </span>
        )} */}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2 mb-1 font-notosans">
          {blog.blog_title}
        </h3>
        {blog.blog_sec_title ? (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {blog.blog_sec_title}
          </p>
        ) : null}

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          {dateStr && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {dateStr}
            </span>
          )}
          {blog.place && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {blog.place}
            </span>
          )}
        </div>

        {blog.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {blog.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {/* If you have a blog details page, wire this link accordingly */}
          <Link
            href={`/public/blogs/${blog._id}`}
            className="text-primary hover:opacity-80 font-medium text-sm"
          >
            Read more →
          </Link>

          {/* Optional: open thumbnail */}
          {/* {blog.blog_thumbnail ? (
            <a
              href={blog.blog_thumbnail}
              target="_blank"
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Open image
            </a>
          ) : null} */}
        </div>
      </div>
    </article>
  );
}
