"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/pagination";

import ProductCard from "@/components/productCard/ProductCard";
import { categories } from "./data";
import ProductsSection from "../productsSection/ProductsSection";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchCategories } from "@/rtk/slices/category/categoriesSlice";
import CategorySkeleton from "@/skeleton/CategorySkeleton";
import ProductSkeleton from "@/skeleton/ProductSkeleton";
import NoDataIcon from "../noData/NoData";
import SafeImage from "../safeImage/SafeImage";
import { fetchProductsByCategory } from '@/rtk/slices/products/productsSliceSimple';
const EMPTY_ARRAY: any[] = [];

/* =========================
   Component
========================= */
const CategoriesSection = () => {
  const t = useTranslations();
  const [activeId, setActiveId] = useState(0);

  const handleChangeCategory = (id: number) => {
    setActiveId(id);
    dispatch(fetchProductsByCategory({ categoryId: id }));
  };

  const { data: categoriesData, loading: categoriesLoading } = useAppSelector((state) => state.categories);
  const { data, loading } = useAppSelector((s) => s.products);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (activeId !== null) {
      dispatch(fetchProductsByCategory({ categoryId: activeId }));
    }
  }, [activeId]);

  const categoriesWithAll = [
    { id: 0, name: t("All"), image: "/all.webp" }, // أو أي icon
    ...(categoriesData || []),
  ];

  return (
    <section className="container py-10 px-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">{t("ShopbyCategory")}</h2>

        <div className="flex items-center gap-3">
          <Link href={`/${useAppSelector((s) => s.settings.data?.id)}/products`}
            className="text-sm text-main px-2 py-1 rounded-md transition-all duration-200
                       hover:bg-(--main-color)/10 hover:text-(--main-color) active:scale-95"
          >
            {t("ViewAll")}
          </Link>

          {/* Navigation */}
          <div className="flex gap-2">
            <button
              className="
                categories-prev
                w-8 h-8 rounded-full
                flex items-center justify-center
                transition
                text-gray-900
                disabled:text-gray-400
                disabled:cursor-not-allowed
                disabled:opacity-60 cursor-pointer
                hover:bg-gray-300
              "
            >
              {t("dir") === "rtl" ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <button
              className="
                categories-next
                w-8 h-8 rounded-full
                flex items-center justify-center
                transition
                text-gray-900
                disabled:text-gray-400
                disabled:cursor-not-allowed
                disabled:opacity-60 cursor-pointer
                hover:bg-gray-300
              "
            >
              {t("dir") === "rtl" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Swiper */}
      {
        categoriesLoading ? (
          <CategorySkeleton />
        ) : (
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".categories-next",
              prevEl: ".categories-prev",
              disabledClass: "disabled",
            }}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 6 },
            }}
          >
              {categoriesWithAll?.map((cat) => {
              const Icon = cat.image;
              const isActive = activeId === cat.id;

              return (
                <SwiperSlide key={cat.id}>
                  <div
                    onClick={() => handleChangeCategory(cat.id)}
                    className={`
                        relative h-[150px]
                        flex flex-col items-center justify-center gap-3
                        rounded-md border cursor-pointer transition
                        ${isActive
                        ? "border-(--main-color) bg-(--main-color)/10"
                        : "border-gray-200 hover:border-(--main-color)"
                      }
                `}
                  >
                    <div className="relative w-15 h-15">
                      <SafeImage
                        src={cat.image}
                        alt={cat.name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <span className="font-medium">{cat.name}</span>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )
      }

      {/* Products Slider */}
      {
        loading ? (
          <ProductSkeleton count={5} />
        ) :
          data.length === 0 ? <NoDataIcon /> :
            (
              <ProductsSection products={data} />
            )
      }
    </section>
  );
};

export default CategoriesSection;
