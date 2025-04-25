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
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
      </header>

      {children}
    </div>
  );
}
