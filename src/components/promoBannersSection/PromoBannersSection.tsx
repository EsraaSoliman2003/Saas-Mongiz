"use client";

import { useAppSelector } from "@/rtk/hooks";
import Link from "next/link";
import SafeImage from "../safeImage/SafeImage";

const PromoBannersSection = () => {
  const { data } = useAppSelector((s) => s.banner);
  const tenantId = useAppSelector((s) => s.settings.data?.id);

  const banner = data?.[0];

  return (
    <section className="container py-10 px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map((index) => (
          <Link
            key={index}
            href={banner?.links?.[index] || `/${tenantId}`}
            className="group relative overflow-hidden rounded-xl h-[220px] flex items-center"
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 z-0" />

            <SafeImage
              src={banner?.images?.[index]}
              alt={banner?.titles?.[index] || `banner-${index}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="absolute left-0 top-0 h-full w-full object-cover z-[-1]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PromoBannersSection;