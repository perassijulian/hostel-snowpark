"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-black shadow-md transition backdrop-blur cursor-pointer"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}
