"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useRef } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated" && !hasRedirected.current) {
      hasRedirected.current = true; // Prevent loops
      signIn();
    }
  }, [status]);

  if (
    status === "loading" ||
    (status === "unauthenticated" && !hasRedirected.current)
  ) {
    return <p>Loading...</p>;
  }

  if (!session) return null;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin" className="block hover:text-gray-300">
            Dashboard
          </a>
          <a href="/admin/bookings" className="block hover:text-gray-300">
            Bookings
          </a>
          <a href="/admin/accomodations" className="block hover:text-gray-300">
            Accomodations
          </a>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
