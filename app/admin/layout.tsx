"use client";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-6">
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
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
