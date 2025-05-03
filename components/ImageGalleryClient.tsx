"use client";

import dynamic from "next/dynamic";
import { PictureForm } from "@/types/accommodation";

// Dynamically import the gallery with ssr: false for client-side rendering
const LightboxGallery = dynamic(() => import("@/components/LightboxGallery"), {
  ssr: false,
});

type Props = {
  images: PictureForm[];
};

export default function ImageGalleryClient({ images }: Props) {
  return <LightboxGallery images={images} />;
}
