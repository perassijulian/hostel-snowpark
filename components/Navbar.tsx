'use client';

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">🏂 HostelSnowpark</div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 text-gray-600 font-medium">
          <li className="hover:text-black cursor-pointer">Home</li>
          <li className="hover:text-black cursor-pointer">About</li>
          <li className="hover:text-black cursor-pointer">Volunteer</li>
          <li className="hover:text-black cursor-pointer">Contact</li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <ul className="md:hidden mt-4 space-y-2 text-gray-600 font-medium text-center">
          <li className="hover:text-black cursor-pointer">Home</li>
          <li className="hover:text-black cursor-pointer">About</li>
          <li className="hover:text-black cursor-pointer">Volunteer</li>
          <li className="hover:text-black cursor-pointer">Contact</li>
        </ul>
      )}
    </nav>
  );
}

