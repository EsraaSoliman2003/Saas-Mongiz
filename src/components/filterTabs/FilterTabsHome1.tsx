"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";

import ProductsSection from "../productsSection/ProductsSection";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import NoData from "../noData/NoData";
import ProductSkeleton from "@/skeleton/ProductSkeleton";
import SubCategorySkeleton from "@/skeleton/SubCategorySkeleton";
import {
  fetchCategoryByIdHome1,
  fetchProductsByCategoryHome1,
  fetchSubCategoriesHome1,
} from "@/rtk/slices/home/homeSlice1";

const categoryId = 2;

const FilterTabs = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const {
    category,
    subCategories,
    products,
    loadingCategory,
    loadingProducts,
    loadingSubCategories,
  } = useAppSelector((s) => s.home1);

  useEffect(() => {
    dispatch(fetchProductsByCategoryHome1({ categoryId }));
    dispatch(fetchSubCategoriesHome1(categoryId));
    dispatch(fetchCategoryByIdHome1(categoryId));
  }, [dispatch]);

  const handleChangeSubCategory = (subCategoryId: number) => {
    dispatch(fetchProductsByCategoryHome1({ categoryId, subCategoryId }));
  };

  return (
    <div className="w-full my-5 overflow-hidden">
      <div className="container flex flex-wrap md:flex-nowrap items-center py-4">
        <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap w-full md:w-2/5 mb-2 md:mb-0 text-center md:text-start">
          {loadingCategory ? (
            <div className="h-5 w-32 bg-gray-300 animate-pulse rounded-md" />
          ) : (
            category?.name
          )}
        </h2>

        <div className="flex items-center gap-2 w-full md:w-3/5 justify-end">
          {loadingSubCategories ? (
            <SubCategorySkeleton />
          ) : (
            <>
              {/* Swiper Tabs */}
              <Swiper
                modules={[Navigation]}
                observer
                observeParents
                navigation={{
                  prevEl: ".filter-prev",
                  nextEl: ".filter-next",
                  disabledClass: "disabled",
                }}
                spaceBetween={16}
                slidesPerView="auto"
                className="flex-1 overflow-hidden"
              >
                {subCategories?.map((item) => (
                  <SwiperSlide key={item.id} className="!w-auto flex-shrink-0">
                    <button
                      onClick={() => handleChangeSubCategory(item.id)}
                      className="relative pb-2 px-3 text-md text-gray-500 transition whitespace-nowrap hover:text-(--main-color)"
                    >
                      {item.name}
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Buttons */}
              <button
                className="filter-prev w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200"
              >
                {t("dir") === "rtl" ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronLeft size={16} />
                )}
              </button>

              <button
                className="filter-next w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200"
              >
                {t("dir") === "rtl" ? (
                  <ChevronLeft size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Products Section */}
      {loadingProducts ? (
        <div className="container">
          <ProductSkeleton count={5} />
        </div>
      ) : products.length > 0 ? (
        <ProductsSection products={products} className="container" />
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default FilterTabs;