import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-white shadow-md">
      <Link href="/">
        <span className="text-xl font-bold text-blue-600">HostelSnowpark</span>
      </Link>
      <ul className="flex gap-4 text-gray-700 font-medium">
        <li><Link href="/about">About</Link></li>
        <li><Link href="/booking">Booking</Link></li>
        <li><Link href="/volunteer">Volunteer</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}