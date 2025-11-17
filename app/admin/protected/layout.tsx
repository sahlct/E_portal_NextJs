"use client";

import { useState, useEffect, useRef, memo } from "react";
import ProtectedRoute from "@/components/admin/protectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Award,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Settings,
  LogOut,
  Fan,
  ShoppingCart,
  Newspaper,
} from "lucide-react";


// Example sidebar menu items (adjust as per your project routes)
const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/protected/dashboard",
  },
  {
    name: "Carousel",
    icon: Fan,
    path: "/admin/protected/carousel",
    // children: [
    //   { name: "Users", path: "/admin/protected/users" },
    //   { name: "Roles", path: "/admin/protected/roles" },
    // ],
  },
  {
    name: "Products",
    icon:   ShoppingCart,
    children: [
      { name: "Categories", path: "/admin/protected/category" },
      { name: "Products", path: "/admin/protected/product" },
      { name: "Product SKUs", path: "/admin/protected/sku" },
      { name: "Latest Products", path: "/admin/protected/latest-product" },
    ],
  },
  {
    name: "Brands",
    icon: Award,
    path: "/admin/protected/brand",
  },
  {
    name: "Blogs",
    icon: Newspaper,
    path: "/admin/protected/blog",
  },
  {
    name: "Logout",
    icon: LogOut,
    path: "/admin/logout",
  },
];

// Sidebar Component
const Sidebar = memo(
  ({
    pathname,
    isCollapsed,
    toggleSidebar,
    mobileOpen,
    setMobileOpen,
  }: {
    pathname: string;
    isCollapsed: boolean;
    toggleSidebar: () => void;
    mobileOpen: boolean;
    setMobileOpen: (v: boolean) => void;
  }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const lastPathRef = useRef(pathname);

    useEffect(() => {
      if (lastPathRef.current === pathname) return;
      lastPathRef.current = pathname;
      const activeParent = menuItems.find((item) =>
        item.children?.some((child) => pathname.startsWith(child.path))
      );
      if (activeParent) setOpenDropdown(activeParent.name);
    }, [pathname]);

    const toggleDropdown = (name: string) => {
      setOpenDropdown((prev) => (prev === name ? null : name));
    };

    return (
      <>
        <aside
          className={`fixed lg:static top-0 left-0 z-40 bg-cyan-800 text-white transition-all duration-300 flex flex-col 
            ${isCollapsed ? "w-20" : "w-64"} 
            ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0`}
          style={{ height: "100vh" }}
        >
          {/* Logo Section */}
          <div className="flex items-center justify-between p-4 border-b border-cyan-700 shrink-0">
            <div className="flex justify-center items-center">
              <img
                src="/logo_only.png"
                alt="Logo"
                className={`ms-3 pe-2 ${isCollapsed ? "h-8" : "h-12"}`}
              />
              <h1 className={`text-white ${isCollapsed ? "hidden" : "block"} text-2xl font-bold text-yellow-500`}>EA Portal</h1>
            </div>

            <button
              onClick={toggleSidebar}
              className="hidden lg:block text-cyan-200 hover:text-white"
            >
              {isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>

          {/* Menu Section */}
          <nav className="mt-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
            {menuItems.map((item) => {
              const isActiveParent =
                item.path === pathname ||
                item.children?.some((child) => pathname.startsWith(child.path));

              return item.children ? (
                <div key={item.name}>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition 
                      ${isActiveParent ? "bg-cyan-700" : "hover:bg-cyan-700"}`}
                  >
                    <div className="flex items-center">
                      <item.icon size={20} className="mr-3" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <span>
                        {openDropdown === item.name ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </span>
                    )}
                  </button>

                  <div
                    className={`ml-8 mt-1 space-y-1 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                      openDropdown === item.name && !isCollapsed
                        ? "max-h-60 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        href={child.path}
                        key={child.name}
                        className={`block px-3 py-2 rounded-s-lg text-sm transition ${
                          pathname === child.path
                            ? "bg-cyan-600 text-white"
                            : "hover:bg-cyan-700"
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition 
                    ${
                      pathname === item.path
                        ? "bg-cyan-600"
                        : "hover:bg-cyan-700"
                    }`}
                >
                  <item.icon size={20} className="mr-3" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </>
    );
  }
);

Sidebar.displayName = "Sidebar";

// Protected Layout Component
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden p-3 fixed top-4 left-4 z-50 bg-cyan-600 text-white rounded-md"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <Sidebar
        pathname={pathname}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Page Content */}
      <main className="flex-1 overflow-y-auto p-6 mt-16 lg:mt-0 lg:ml-0">
        <ProtectedRoute>{children}</ProtectedRoute>
      </main>
    </div>
  );
}
