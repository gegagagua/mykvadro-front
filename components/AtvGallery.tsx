"use client";

import { useState } from "react";

type Img = { url: string; alt_text?: string | null };

export function AtvGallery({ images, name }: { images: Img[]; name: string }) {
  const safe = images.length ? images : [{ url: "/seed/atvs/placeholder.svg", alt_text: name }];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-atv-gray border border-border animate-fade-in">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={safe[active].url}
          src={safe[active].url}
          alt={safe[active].alt_text || name}
          className="w-full h-full object-cover animate-fade-in"
        />
      </div>
      {safe.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {safe.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                i === active ? "border-atv-orange scale-[1.02]" : "border-transparent hover:border-border"
              }`}
              aria-label={`სურათი ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt_text || `${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
