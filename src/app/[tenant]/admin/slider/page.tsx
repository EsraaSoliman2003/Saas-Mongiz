"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchSlider } from "@/rtk/slices/slider/sliderSlice";
import SectionHeader from "../_components/SectionHeader";
import { useTranslations } from "next-intl";
import NoData from "@/components/noData/NoData";
import SliderCard from "./_components/SliderCard";

export default function SliderDisplayPage() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: sliders, loading } = useAppSelector((state) => state.slider);

  useEffect(() => {
    dispatch(fetchSlider());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <SectionHeader
        title={t("page_title")}
        buttonText={t("Add")}
        link={`/admin/slider/add`}
        subtitle={t("subtitle")}
      />

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {sliders.length === 0
          ? (
            <NoData />
          )
          : sliders.map((slider) => (
            <SliderCard
              key={slider.id}
              slider={slider}
            />
          ))}
      </div>
    </div>
  );
}