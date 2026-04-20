"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { toggleUserFavourite } from "@/rtk/slices/favourite/favouriteSlice";
import { ProductApi } from "@/rtk/slices/productDetails/productDetailsSlice";

type Props = {
  product: ProductApi;
  images: string[];
};

export default function ImagesPart({ product, images }: Props) {
  const dispatch = useAppDispatch();
  const [isFav, setIsFav] = useState(product.isFavourite ?? false);
  const { token } = useAuth();
  const router = useRouter();
  const t = useTranslations();
  const [activeIndex, setActiveIndex] = useState(0);

  const isOutOfStock = (product.quantity ?? 0) <= 0;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsFav(!isFav);
    dispatch(toggleUserFavourite(product.id));
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden group shadow-sm">

        <Image
          src={images[activeIndex]}
          alt="Product main image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          priority
        />

        {/* Top Right Buttons */}
        <div className={`absolute top-2 ${t("dir") === "rtl" ? "left-2" : "right-2"} flex gap-2 z-10`}>

          {/* Favourite */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (token) {
                handleToggleFavorite(e);
              } else {
                router.push(`/${useAppSelector((s) => s.settings.data?.id)}/login`);
              }
            }}
            className={`p-1 my-2 lg:hidden rounded-full bg-white transition-all duration-300 ${isFav
                ? "text-red-500 bg-red-50"
                : "text-gray-500"
              }`}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={22}
              className={isFav ? "fill-red-500 text-red-500" : ""}
            />
          </button>

          {/* Share */}
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success(t("copySucces"));
              } catch {
                toast.error("Error copying link");
              }
            }}
            disabled={isOutOfStock}
            title={t("Share")}
            className="p-1 my-2 lg:hidden rounded-full bg-white text-gray-500"
          >
            <Share2 size={22} />
          </button>
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) =>
                t("dir") === "rtl" ? prevImage(e) : nextImage(e)
              }
              className="absolute z-10 top-1/2 -translate-y-1/2 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={22} className="text-gray-700" />
            </button>

            <button
              onClick={(e) =>
                t("dir") === "rtl" ? nextImage(e) : prevImage(e)
              }
              className="absolute z-10 top-1/2 -translate-y-1/2 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={22} className="text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-4">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveIndex(index);
              }}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeIndex === index
                  ? "border-(--main-color) ring-2 ring-(--main-color)/10"
                  : "border-transparent hover:border-gray-300"
                }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}