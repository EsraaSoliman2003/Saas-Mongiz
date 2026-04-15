"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import AdminGridLayout from "@/components/adminGridLayout/AdminGridLayout";
import AdminBannerCard from "./_components/AdminBannerCard";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import AdminSectionHeader from "../_components/AdminSectionHeader";
import { fetchBanners } from "@/rtk/slices/banner/bannerSlice";
import LoadingSpinner from "../_components/LoadingSpinner";
import SectionHeader from "../_components/SectionHeader";

const HomePage = () => {
  const t = useTranslations();
  const { data, loading } = useAppSelector((s) => s.banner);
  const banners = data[0];
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchBanners())
  }, [dispatch]);

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <section className="p-4 lg:p-10">
      <SectionHeader
        title={t("Banners")}
        subtitle={t("ManageBanners")}
        buttonText={t("EditBanners")}
        link="/admin/banner/edit"
      />

      <div className="relative w-full max-w-6xl">
        <AdminGridLayout
          isEmpty={!loading && (!banners || banners.images.length === 0)}
          className="grid grid-cols-1 gap-6"
        >
          {banners?.images?.map((img, index) => (
            <AdminBannerCard
              key={index}
              id={`banner-${index}`}
              image={img}
              link={banners.links?.[index] || ""}
              text={banners.titles?.[index] || ""}
            />
          ))}
        </AdminGridLayout>

      </div>
    </section>
  );
};

export default HomePage;
