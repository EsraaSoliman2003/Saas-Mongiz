"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ImagePickerGrid({
  images,
  fallbackSrc,
  onPickImage,
  onRemoveImage,
  max = 4,
}: {
  images: string[];
  fallbackSrc: any; // StaticImport | string (حسب assets عندك)
  onPickImage: (idx: number, file: File | null) => void;
  onRemoveImage: (idx: number) => void;
  max?: number;
}) {
  const t = useTranslations();
  const arr = Array.from({ length: max }, (_, i) => i);

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold title-color">{t("Images")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {arr.map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-3">
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-[#F4F6F8]">
              <Image
                src={images[i] || fallbackSrc}
                alt={`about image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 220px, 100vw"
              />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickImage(i, e.target.files?.[0] ?? null)}
                />
                <span className="block text-center cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold bg-main text-white hover:opacity-90 transition">
                  {t("Upload")}
                </span>
              </label>

              {/* <button
                type="button"
                onClick={() => onRemoveImage(i)}
                className="rounded-lg px-3 py-2 text-sm font-semibold border b-c bg-white hover:bg-[#F4F6F8] transition"
              >
                {t("Remove")}
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
