"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandApi, fetchBrands } from "@/rtk/slices/brands/brandsSlice";

export default function BrandsFilter() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { items } = useAppSelector((s) => s.brands);

  const [activeBrand, setActiveBrand] = useState<BrandApi | null>(null);

  // 🚀 prevents first replace
  const isInitialized = useRef(false);

  /* ===========================
     Fetch Brands
  =========================== */
  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  /* ===========================
     Read Brand From URL
  =========================== */
  useEffect(() => {
    if (!items.length) return;

    const brandParam = searchParams.get("brand");

    if (brandParam) {
      const brandId = Number(brandParam);
      const found = items.find((b) => b.id === brandId);
      if (found) setActiveBrand(found);
    }

    isInitialized.current = true;
  }, [items]);

  /* ===========================
     Update URL When Brand Changes
  =========================== */
  useEffect(() => {
    if (!isInitialized.current) return;

    const params = new URLSearchParams(searchParams.toString());

    if (activeBrand) {
      params.set("brand", activeBrand.id.toString());
    } else {
      params.delete("brand");
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [activeBrand]);

  const toggleBrand = (brand: BrandApi) => {
    setActiveBrand((prev) =>
      prev?.id === brand.id ? null : brand
    );
  };

  return (
    <div>
      <h2 className="font-bold text-xl mb-3">{t("Brand")}</h2>

      <div className="grid grid-cols-3 gap-3">
        {items.map((brand) => {
          const isActive = activeBrand?.id === brand.id;

          return (
            <button
              key={brand.id}
              onClick={() => toggleBrand(brand)}
              className={`px-4 py-2 rounded-full text-sm transition-all font-semibold
                ${isActive
                  ? "bg-main text-white shadow-md"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
            >
              {brand.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}