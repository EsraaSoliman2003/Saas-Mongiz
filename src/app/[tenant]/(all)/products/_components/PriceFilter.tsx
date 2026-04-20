"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export default function PriceRangeFilter() {
  const MIN = 0;
  const MAX = 1_000_000;

  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const trackRef = useRef<HTMLDivElement>(null);
  const minSliderRef = useRef<HTMLInputElement>(null);
  const maxSliderRef = useRef<HTMLInputElement>(null);

  /* ===========================
     Initialize From URL
  =========================== */
  const initialMin = Number(searchParams.get("minPrice")) || MIN;
  const initialMax = Number(searchParams.get("maxPrice")) || MAX;

  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  /* ===========================
     Update Track UI
  =========================== */
  useEffect(() => {
    if (!trackRef.current) return;

    const minPercent = ((minValue - MIN) / (MAX - MIN)) * 100;
    const maxPercent = ((maxValue - MIN) / (MAX - MIN)) * 100;

    trackRef.current.style.background = `linear-gradient(
      ${t("dir") === "rtl" ? "to left" : "to right"},
      #f5f5f5 0%,
      #f5f5f5 ${minPercent}%,
      var(--main-color) ${minPercent}%,
      var(--main-color) ${maxPercent}%,
      #f5f5f5 ${maxPercent}%,
      #f5f5f5 100%
    )`;
  }, [minValue, maxValue, t]);

  /* ===========================
     Fix Z-Index Overlap
  =========================== */
  useEffect(() => {
    if (!minSliderRef.current || !maxSliderRef.current) return;

    const diffPercent =
      ((maxValue - minValue) / (MAX - MIN)) * 100;

    if (diffPercent < 5) {
      minSliderRef.current.style.zIndex = "20";
      maxSliderRef.current.style.zIndex = "10";
    } else {
      minSliderRef.current.style.zIndex = "10";
      maxSliderRef.current.style.zIndex = "20";
    }
  }, [minValue, maxValue]);

  /* ===========================
     Update URL
  =========================== */
  const handleFilter = (newMin: number, newMax: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("minPrice", String(newMin));
    params.set("maxPrice", String(newMax));

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="price-range-filter w-full max-w-md mx-auto p-4 pb-0">
      <h2 className="font-bold text-xl mb-4">
        {t("Price")}
      </h2>

      <div className="flex justify-between mb-2 text-sm font-medium text-gray-700">
        <span>${MIN.toLocaleString()}</span>
        <span>${MAX.toLocaleString()}</span>
      </div>

      <div className="relative w-full h-10">
        <div
          ref={trackRef}
          className="range-track absolute top-1/2 -translate-y-1/2 w-full h-2 rounded-full"
        />

        <input
          ref={minSliderRef}
          type="range"
          min={MIN}
          max={MAX}
          value={minValue}
          onChange={(e) => {
            const newMin = Math.min(
              Number(e.target.value),
              maxValue - 1
            );
            setMinValue(newMin);
            handleFilter(newMin, maxValue);
          }}
          className="range-slider min-slider"
        />

        <input
          ref={maxSliderRef}
          type="range"
          min={MIN}
          max={MAX}
          value={maxValue}
          onChange={(e) => {
            const newMax = Math.max(
              Number(e.target.value),
              minValue + 1
            );
            setMaxValue(newMax);
            handleFilter(minValue, newMax);
          }}
          className="range-slider max-slider"
        />
      </div>

      <div className="mt-2 text-center text-sm text-gray-600">
        ${minValue} - ${maxValue}
      </div>
    </div>
  );
}