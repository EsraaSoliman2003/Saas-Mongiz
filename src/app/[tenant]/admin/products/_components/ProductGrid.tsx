"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import AdminGridLayout from "@/components/adminGridLayout/AdminGridLayout";
import AdminProductCard from "./AdminProductCard";
import ProductFilterBar from "@/components/smartFilter/Filter";
import LoadingSpinner from "../../_components/LoadingSpinner";

import { useProducts } from "@/hooks/useProducts";

const ProductGridWithFilters = () => {
  const t = useTranslations();
  const router = useRouter();
  const sp = useSearchParams();

  const {
    products,
    byCategoryPageCount,
    currentPageNum,
    byCategoryLoading,
  } = useProducts();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", newPage.toString());
    router.replace(`?${params.toString()}`);
  };

  return (
    <>
      <ProductFilterBar isFullExist />

      <div className="relative mt-6">
        {!byCategoryLoading && products.length > 0 && (
          <>
            <AdminGridLayout isEmpty={products.length === 0}>
              {products.map((product) => (
                <AdminProductCard
                  key={product.id}
                  id={String(product.id)}
                  name={product.name}
                  price={product.price}
                  image={product?.mainImage}
                />
              ))}
            </AdminGridLayout>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => handlePageChange(currentPageNum - 1)}
                disabled={currentPageNum === 1}
                className="px-4 py-2 rounded border hover:bg-gray-100 transition disabled:opacity-50"
              >
                {t("Previous")}
              </button>

              <span className="px-2 py-2">
                {currentPageNum} / {byCategoryPageCount}
              </span>

              <button
                onClick={() => handlePageChange(currentPageNum + 1)}
                disabled={currentPageNum === byCategoryPageCount}
                className="px-4 py-2 rounded border hover:bg-gray-100 transition disabled:opacity-50"
              >
                {t("Next")}
              </button>
            </div>
          </>
        )}

        {byCategoryLoading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white/60">
            <LoadingSpinner />
          </div>
        )}

        {!byCategoryLoading && products.length === 0 && (
          <div className="py-10 text-center text-gray-500 font-semibold">
            {t("No products found")}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductGridWithFilters;
