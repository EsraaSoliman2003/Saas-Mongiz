"use client"
import React from "react";
import SectionHeader from "../_components/SectionHeader";
import MenuStats from "./_components/MenuStats";
import SearchFilterBar from "./_components/SearchFilterBar";
import CategorySection from "./_components/MenuCategoryList";
import { useTranslations } from "next-intl";
import ProductGridWithFilters from "./_components/ProductGrid";
import { useAppSelector } from "@/rtk/hooks";

type Props = {};

export default function Page({ }: Props) {
  const t = useTranslations();
  const tenantId = useAppSelector((s) => s.settings.data?.id);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <SectionHeader
        title={t("menuManagementTitle")}
        subtitle={t("menuManagementSubtitle")}
        buttonText={t("addProduct.title")}
        link={`/${tenantId}/admin/products/addproduct`}
      />
      {/* <MenuStats /> */}
      {/* <SearchFilterBar />

      <CategorySection
        title={t("electronics")}
        itemsCount={3}
      /> */}
      <ProductGridWithFilters />
    </div>
  );
}
