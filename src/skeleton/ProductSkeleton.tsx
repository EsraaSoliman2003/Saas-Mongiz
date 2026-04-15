// src/components/skeletons/ProductSkeleton.tsx
"use client";

import React from "react";

interface ProductSkeletonProps {
  count?: number;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="animate-pulse flex flex-col gap-2">
          <div className="w-full h-40 bg-gray-200 rounded-md" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
