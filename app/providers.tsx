"use client";

import { BodyOverflowProvider } from "@/contexts/BodyOverflowContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <BodyOverflowProvider>{children}</BodyOverflowProvider>
    </SessionProvider>
  );
}
