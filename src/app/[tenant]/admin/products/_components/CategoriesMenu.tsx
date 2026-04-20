"use client";

import useClickOutside from "@/hooks/useClickOutside";
import { useRef, useState } from "react";
import { bottomArrow } from "@/assets";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/rtk/hooks";
import NoData from "@/components/noData/NoData";
import CategoryMenuSkeleton from "@/skeleton/CategoryMenuSkeleton";

const CategoriesMenu = () => {
  const t = useTranslations();

  const [openCategories, setOpenCategories] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: containerRef,
    handler: () => setOpenCategories(false),
  });

  const { data: categoriesData, loading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );

  return (
    <div
      ref={containerRef}
      className="
        px-4 py-3 text-sm
        bg-white text-[#555555]
        flex items-center justify-between
        cursor-pointer relative rounded-xl
        transition-all duration-200 ease-in-out
        min-w-23
      "
      onTouchStart={() => setOpenCategories((prev) => !prev)}
      onMouseEnter={() => setOpenCategories(true)}
      onMouseLeave={() => setOpenCategories(false)}
    >
      <span className="font-medium">{t("Categories")}</span>

      {/* Arrow icon with fixed container and fill */}
      <div className="w-[10px] h-[10px] relative">
        <Image
          src={bottomArrow}
          alt="arrow"
          fill
          className={`
            object-contain transition-transform duration-200
            ${openCategories ? "rotate-180" : ""}
          `}
        />
      </div>

      {/* Dropdown */}
      {openCategories && (
        <div className="absolute top-full right-0 w-56 bg-white shadow-lg rounded-md z-50">
          <ul className="flex flex-col text-sm text-[#333] max-h-64 overflow-y-auto">
            {categoriesLoading ? (
              <CategoryMenuSkeleton />
            ) : categoriesData?.length > 0 ? (
              categoriesData.map((category) => (
                <li
                  key={category.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {category.name}
                </li>
              ))
            ) : (
              <NoData />
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoriesMenu;