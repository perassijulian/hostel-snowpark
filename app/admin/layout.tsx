"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  BedDouble,
  CalendarCog,
  ChartArea,
  DoorOpen,
  Menu,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const linkClass = (href: string) =>
    `flex flex-col items-center gap-2 py-2 rounded-md transition hover:bg-gray-700 ${
      pathname === href ? "bg-gray-700 text-white" : "text-gray-300"
    }`;

  return (
    <div className="relative flex h-[calc(100vh-64px)] bg-gray-100">
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-50 bg-gray-800 text-white p-6 space-y-6 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin" className={linkClass("/admin")}>
            <ChartArea /> <p>Dashboard</p>
          </a>
          <a href="/admin/bookings" className={linkClass("/admin/bookings")}>
            <CalendarCog /> Bookings
          </a>
          <a
            href="/admin/accommodations"
            className={linkClass("/admin/accommodations")}
          >
            <BedDouble /> Accommodations
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex flex-col items-center gap-2 w-full hover:bg-gray-700 cursor-pointer text-red-600 py-2 rounded-md transition"
          >
            <DoorOpen /> Log Out
          </button>
        </nav>
      </aside>

      {/* Toggle tab (mobile only) */}
      <button
        className="fixed z-50 top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-r md:hidden"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Menu size={20} className="transition-transform duration-300" />
      </button>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
