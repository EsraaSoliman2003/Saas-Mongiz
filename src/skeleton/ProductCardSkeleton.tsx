"use client";

import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="rounded-lg p-3 space-y-3 animate-pulse">
      {/* Image */}
      <div className="w-full h-40 bg-gray-200 rounded-md" />

      {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-3/4" />

      {/* Subtitle */}
      <div className="h-3 bg-gray-200 rounded w-1/2" />

      {/* Price */}
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  );
}