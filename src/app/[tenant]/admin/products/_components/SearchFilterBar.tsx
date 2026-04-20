"use client";
import React, { useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchCategories } from "@/rtk/slices/category/categoriesSlice";
import CategoriesMenu from "./CategoriesMenu";

export default function SearchFilterBar() {
  const t = useTranslations();
    const { data, loading } = useAppSelector((s) => s.categories);
    const dispatch = useAppDispatch();
  
    // Fetch categories on mount
    useEffect(() => {
      dispatch(fetchCategories());
    }, [dispatch]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      
      {/* Dropdown */}
      <CategoriesMenu />

      {/* Search Input */}
      <div className="flex-1 relative">
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={t("searchMenuPlaceholder")}
          className="w-full rounded-xl py-3 pr-10 pl-4 text-sm bg-white focus:border-(--main-color) focus:outline-none focus:ring-2 focus:ring-(--main-color)/10 transition-all"
        />
      </div>
    </div>
  );
}
