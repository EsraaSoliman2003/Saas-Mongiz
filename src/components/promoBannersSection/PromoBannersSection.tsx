"use client";

import { useAppSelector } from "@/rtk/hooks";
import MainButton from "../MainButton/MainButton";
import Link from "next/link";
import SafeImage from "../safeImage/SafeImage";

const PromoBannersSection = () => {
  const { data } = useAppSelector((s) => s.banner);

  return (
    <section className="container py-10 px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map((index) => (
          <Link
            href={data[0]?.links?.[index] || "/"}
            key={index}
            className="group relative overflow-hidden rounded-xl h-[220px] flex items-center"
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 z-0" />

            {/* Image */}
            <SafeImage
              src={data[0]?.images?.[index]}
              alt={data[0]?.titles?.[index] || `banner-${index}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw" // ✅ correct sizes
              className="absolute left-0 top-0 h-full w-full object-cover z-[-1]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PromoBannersSection;