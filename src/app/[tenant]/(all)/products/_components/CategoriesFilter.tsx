"use client";

import React, { useEffect, useState } from "react";
import { bottomArrow, upArrow } from "@/assets";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchMenu } from "@/rtk/slices/categoriesMenu/categoriesMenuSlice";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoriesFilter() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data = [], loading } = useAppSelector(
    (s) => s.categoriesMenu
  );

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeSubIndex, setActiveSubIndex] = useState<number | null>(null);

  /* ===========================
     Fetch Menu
  =========================== */
  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  /* ===========================
     Restore State From URL
  =========================== */
  useEffect(() => {
    if (!data.length) return;

    const categoryParam = searchParams.get("category");
    const subParam = searchParams.get("subCategory");

    if (!categoryParam) return;

    const categoryIndex = data.findIndex(
      (cat) => String(cat.id) === categoryParam
    );

    if (categoryIndex !== -1) {
      setOpenIndex(categoryIndex);

      if (subParam) {
        const subIndex = data[categoryIndex].subCategories.findIndex(
          (sub) => String(sub.id) === subParam
        );

        if (subIndex !== -1) {
          setActiveSubIndex(subIndex);
        }
      }
    }
  }, [data, searchParams]);

  /* ===========================
     Toggle Category
  =========================== */
  const handleToggle = (
    index: number,
    categoryId: string | number
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (openIndex === index) {
      setOpenIndex(null);
      setActiveSubIndex(null);
      params.delete("category");
      params.delete("subCategory");
    } else {
      setOpenIndex(index);
      setActiveSubIndex(null);
      params.set("category", String(categoryId));
      params.delete("subCategory");
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  /* ===========================
     Select SubCategory
  =========================== */
  const handleChangeSubCategory = (
    categoryId: string | number,
    subCategoryId: string | number,
    subIndex: number
  ) => {
    setActiveSubIndex(subIndex);

    const params = new URLSearchParams(searchParams.toString());
    params.set("category", String(categoryId));
    params.set("subCategory", String(subCategoryId));

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <h2 className="font-bold text-xl mb-3">
        {t("Categories")}
      </h2>

      {data.map((category, index) => {
        const isCategoryOpen = openIndex === index;

        return (
          <div key={category.id}>
            {/* Category */}
            <button
              onClick={() =>
                handleToggle(index, category.id)
              }
              className={`w-full flex items-center justify-between
              p-3 hover:bg-gray-100 rounded-md transition-colors
              ${
                isCategoryOpen
                  ? "border border-(--main-color)"
                  : ""
              }`}
            >
              <span className="text-[#161727] text-sm">
                {category.name}
              </span>

              <Image
                src={isCategoryOpen ? upArrow : bottomArrow}
                alt="arrow"
                width={10}
                height={10}
                className="object-contain transition-transform duration-300"
              />
            </button>

            {/* Sub Categories */}
            {isCategoryOpen && (
              <div className="pl-6 pb-2 space-y-1">
                {category.subCategories.map((sub, i) => {
                  const isActiveSub =
                    activeSubIndex === i;

                  return (
                    <div
                      key={sub.id}
                      onClick={() =>
                        handleChangeSubCategory(
                          category.id,
                          sub.id,
                          i
                        )
                      }
                      className={`text-sm p-3 rounded-md cursor-pointer transition-colors
                        ${
                          isActiveSub
                            ? "bg-main text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-black"
                        }`}
                    >
                      {sub.name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}