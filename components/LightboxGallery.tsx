"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type Image = {
  src: string;
  alt: string;
};

type Props = {
  images: Image[];
};

export default function LightboxGallery({ images }: Props) {
  if (images.length === 0) return null;

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const [primary, ...thumbnails] = images;

  return (
    <div className="space-y-4 mt-2">
      {/* Primary Image */}
      <div
        onClick={() => {
          setOpen(true);
          setIndex(0);
        }}
      >
        <div className="w-full">
          <img
            src={primary.src}
            alt={primary.alt}
            className="w-full h-[400px] object-cover rounded-xl shadow cursor-pointer transition-transform hover:scale-105"
          />
        </div>
      </div>
      {/* Thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {thumbnails.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt}
            className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
            onClick={() => {
              setOpen(true);
              setIndex(index + 1); // +1 to match original index
            }}
          />
        ))}
      </div>
      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images}
        plugins={[Thumbnails]}
      />
    </div>
  );
}
