"use client";

import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/productCard/ProductCard";
import { ToLeft, ToRight } from "@/assets";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchProductsByCategory } from '@/rtk/slices/products/productsSliceSimple';
import NoData from "@/components/noData/NoData";
import { useSearchParams } from "next/navigation";
import ProductCardSkeleton from "@/skeleton/ProductCardSkeleton";

export default function ProductsSectionWithPagination() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const pageSize = 12;
  const [currentPage, setCurrentPage] = useState(1);

  /* ===========================
     Fetch Products
  =========================== */
  useEffect(() => {
    const sellerId = searchParams.get("seller");
    const categoryId = searchParams.get("category");
    const subCategoryId = searchParams.get("subCategory");
    const brandId = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const query = searchParams.get("query");

    dispatch(
      fetchProductsByCategory({
        userId: sellerId ? Number(sellerId) : undefined,
        categoryId: categoryId ? Number(categoryId) : 0,
        subCategoryId: subCategoryId
          ? Number(subCategoryId)
          : undefined,
        brandId: brandId ? Number(brandId) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        query: query ? query : undefined,
        page: currentPage,
        pageSize: pageSize,
      })
    );
  }, [
    currentPage,
    searchParams.get("seller"),
    searchParams.get("category"),
    searchParams.get("subCategory"),
    searchParams.get("brand"),
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
    searchParams.get("query"),
    dispatch,
  ]);

  const { data, loading } = useAppSelector(
    (s) => s.products
  );

  const productsList = Array.isArray(data) ? data : [];

  /* ===========================
     Pagination Logic
  =========================== */
  const totalPages = Math.ceil(
    (productsList.length || 0) / pageSize
  ) || 1;

  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between gap-15">
      <div className="flex-1 flex flex-col justify-between">
        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                      gap-[8px] sm:gap-[12px] md:gap-[18px] lg:gap-[25px]">
          {loading ? (
            Array.from({ length: pageSize }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : productsList.length === 0 ? (
            <div className="col-span-2 sm:col-span-3 md:col-span-4 flex justify-center items-center min-h-[300px]">
              <NoData />
            </div>
          ) : (
            productsList.map((item, index) => (
              <ProductCard key={item.id || index} product={item} />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-600  hover:bg-gray-100 transition
              ${currentPage === 1 ? "opacity-20 cursor-not-allowed" : "opacity-50 cursor-pointer hover:bg-gray-100"}
            `}
          >
            <Image
              src={t("dir") === "rtl" ? ToRight : ToLeft}
              alt="arrow"
              width={8}
              height={8}
              className="object-contain transition-transform duration-300"
            />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`flex items-center justify-center w-8 h-8 rounded-md border font-semibold cursor-pointer ${currentPage === page
                  ? "bg-main text-white border-(--main-color)"
                  : "border-gray-300 text-[#858585] hover:bg-gray-100"
                  } transition`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition mr-2
                    ${currentPage === totalPages ? "opacity-20 cursor-not-allowed" : "opacity-50 cursor-pointer hover:bg-gray-100"}
                    `}
          >
            <Image
              src={t("dir") === "rtl" ? ToLeft : ToRight}
              alt="arrow"
              width={8}
              height={8}
              className="object-contain transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </div>
  );
}