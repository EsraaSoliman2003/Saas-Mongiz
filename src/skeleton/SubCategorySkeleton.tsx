// src/skeleton/SubCategorySkeleton.tsx
"use client";

const SubCategorySkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="flex gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-24 h-8 bg-gray-200 rounded-md animate-pulse"
        />
      ))}
    </div>
  );
};

export default SubCategorySkeleton;
