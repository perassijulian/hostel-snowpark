"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex h-[calc(100vh-64px)] bg-gray-100">
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 space-y-6 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin" className="block hover:text-gray-300">
            Dashboard
          </a>
          <a href="/admin/bookings" className="block hover:text-gray-300">
            Bookings
          </a>
          <a href="/admin/accommodations" className="block hover:text-gray-300">
            Accommodations
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block mt-2 text-left w-full hover:text-red-400 cursor-pointer text-red-600"
          >
            Log Out
          </button>
        </nav>
      </aside>

      {/* Toggle tab (mobile only) */}
      <button
        className="fixed z-50 top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-r md:hidden"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Menu size={20} />
      </button>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
