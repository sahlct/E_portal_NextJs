"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBlogById, getBlogs } from "@/lib/api/blogs";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

export default function BlogDetailsPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

  // Load Single Blog
  const loadBlog = async () => {
    try {
      const res = await getBlogById(id as string);
      setBlog(res?.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Load Latest Blogs (for Right Sidebar)
  const loadRecentBlogs = async () => {
    try {
      const res = await getBlogs(1, 3); // 3 latest blogs
      setRecent(res?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      Promise.all([loadBlog(), loadRecentBlogs()]).finally(() =>
        setLoading(false)
      );
    }
  }, [id]);

  if (loading || !blog) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading...
      </div>
    );
  }

  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/public/home" className="hover:underline">Home</Link> /{" "}
          <Link href="/public/blogs" className="hover:underline">Blog</Link> /{" "}
          <span className="text-gray-700">{blog.blog_title}</span>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3 font-notosans ">
              {blog.blog_title}
            </h1>

            {/* Author + Date */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
              <CalendarDays className="w-4 h-4" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span className="capitalize">{blog.author || "Admin"}</span>
            </div>

            {/* Main Image */}
            <div className="w-full rounded-xl overflow-hidden mb-6">
              <img
                src={server_url + blog.blog_thumbnail}
                alt={blog.blog_title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Description */}
            <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {blog.description}
            </div>

          </div>

          {/* RIGHT SIDEBAR – RECENT BLOGS */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Blogs</h3>

            {recent.map((item) => {
              const date = item.date
                ? new Date(item.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "";

              return (
                <Link
                  href={`/public/blog/${item._id}`}
                  key={item._id}
                  className="flex gap-4 items-start group"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={server_url + item.blog_thumbnail}
                      alt={item.blog_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">{date}</p>
                    <p className="font-medium text-gray-800 group-hover:text-blue-600 font-notosans">
                      {item.blog_title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
