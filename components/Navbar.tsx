"use client";

import { useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useBodyOverflow } from "@/contexts/BodyOverflowContext";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { setOverflow } = useBodyOverflow();

  // Toggle menu and scroll lock
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Close menu & re-enable scroll on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Sync scroll lock with menu state
  useEffect(() => {
    setOverflow(isOpen);
  }, [isOpen, setOverflow]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/volunteer", label: "Volunteer" },
    { href: "/booking", label: "Booking" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          🏂 HostelSnowpark
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 text-gray-600 font-medium">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-black">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-50 md:hidden">
          <ul className="flex flex-col items-center space-y-4 py-4 text-gray-600 font-medium text-center">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-black">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
