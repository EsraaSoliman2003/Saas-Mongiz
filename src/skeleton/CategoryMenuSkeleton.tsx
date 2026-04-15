// src/skeleton/CategoryMenuSkeleton.tsx
"use client";

const CategoryMenuSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full h-5 bg-gray-200 rounded animate-pulse"
        />
      ))}
    </div>
  );
};

export default CategoryMenuSkeleton;
