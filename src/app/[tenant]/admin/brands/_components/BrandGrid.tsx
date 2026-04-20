"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import AdminBrandCard from "./AdminBrandCard";
import AdminGridLayout from "@/components/adminGridLayout/AdminGridLayout";
import AdminSectionHeader from "@/components/adminSectionHeader/AdminSectionHeader";
import LoadingSpinner from "../../_components/LoadingSpinner";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchBrands } from "@/rtk/slices/brands/brandsSlice";

const BrandGrid = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const { items, loading } = useAppSelector((s) => s.brands);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  return (
    <>
      <AdminSectionHeader title={t("Brands")} addHref="/admin/brands/create" />

      <div className="relative">
        <AdminGridLayout isEmpty={!loading && items.length === 0}>

          {items && items.length > 0 &&
            items.map((b: any) => (
              <AdminBrandCard key={b.id} id={String(b.id)} name={b.name} />
            ))}
        </AdminGridLayout>

        {loading && (
          <LoadingSpinner />
        )}
      </div>

    </>
  );
};

export default BrandGrid;
