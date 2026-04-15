"use client";

const CategorySkeleton = () => {
  return (
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="
            h-[150px] min-w-[140px]
            flex flex-col items-center justify-center gap-4
            rounded-md border border-gray-200
            bg-white
          "
        >
          {/* icon skeleton */}
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />

          {/* text skeleton */}
          <div className="w-20 h-3 rounded bg-gray-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export default CategorySkeleton;
