"use client";

import Image, { ImageProps, StaticImageData } from "next/image";
import { useState, useEffect } from "react";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | StaticImageData | null;
  fallback?: string;
  isHero?: boolean; // for banners / hero images
}

/**
 * SafeImage:
 * - Handles invalid URLs
 * - Auto fallback
 * - Auto sizes for fill images
 * - Eager loading for LCP / hero images
 */
export default function SafeImage({
  src,
  fallback = "/placeholder.png",
  alt = "image",
  fill,
  sizes,
  isHero = false,
  priority,
  style,
  ...rest
}: SafeImageProps) {
  const cleanSrc = (url?: string | StaticImageData | null) => {
    if (!url || url === "null" || url === "undefined") return fallback;
    if (typeof url !== "string") return url;
    return url.replace(/\s+/g, "");
  };

  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(
    cleanSrc(src)
  );

  useEffect(() => {
    setImgSrc(cleanSrc(src));
  }, [src]);

  // Auto-calc sizes for fill images if not provided
  const autoSizes = fill
    ? sizes || "(max-width: 768px) 100vw, 50vw"
    : undefined;

  // Auto-eager loading if likely above fold (fill images or hero)
  const isAboveFold = fill || isHero;

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={autoSizes}
      priority={priority !== undefined ? priority : isAboveFold}
      loading={priority !== undefined ? (priority ? "eager" : "lazy") : isAboveFold ? "eager" : "lazy"}
      style={!fill ? { width: "auto", height: "auto", ...style } : style}
      onError={() => setImgSrc(fallback)}
      {...rest}
    />
  );
}