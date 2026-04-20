"use client";

import { useState } from "react";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  DollarSign,
  Tag,
  Search
} from "lucide-react";
import CategoriesFilterMobile from "./CategoriesFilterMobile";
import BrandsFilter from "./BrandsFilter";
import PriceRangeFilter from "./PriceFilter";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import SearchSection from "@/components/navbar/_components/desktopNavbar/SearchSection";

export default function FiltersMobile() {
  const t = useTranslations();
  const router = useRouter();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  const toggleFilters = () => setIsFiltersOpen(!isFiltersOpen);
  const toggleFilterSection = (section: string) => {
    setActiveFilterSection(activeFilterSection === section ? null : section);
  };
  const applyFilters = () => {
    setIsFiltersOpen(false);
  };
  const resetFilters = () => {
    setActiveFilterSection(null);
    // Clear all query parameters from URL
    const params = new URLSearchParams();
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="md:hidden">

      {/* زر الفلاتر */}
      <div className="md:hidden mb-6 mt-6">
        <div className="flex items-center gap-3">
          <SearchSection hideButton />

          <button
            onClick={toggleFilters}
            className="bg-main fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-main to-main/90 text-white py-3 px-5 rounded-full shadow-xl flex items-center justify-center gap-2 z-40 min-w-[140px] hover:shadow-2xl hover:scale-105 transition-all duration-200 active:scale-95"
          >
            <Filter className="w-5 h-5" />
            <span className="font-semibold">{t("Filters")}</span>
          </button>

        </div>
      </div>

      {/* طبقة التعتيم */}
      {isFiltersOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsFiltersOpen(false)}
        />
      )}

      {/* نافذة الفلاتر المنزلقة */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl
           transform transition-transform duration-300 z-50 max-h-[90vh] flex flex-col ${isFiltersOpen ? "translate-y-0" : "translate-y-full"
          }`}
      >
        {/* شريط السحب */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* الهيدر */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-main" />
            <h2 className="text-xl font-bold text-gray-800">{t("SearchFilters")}</h2>
          </div>
          <button
            onClick={toggleFilters}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* محتوى الفلاتر */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* قسم الفئات */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <CategoriesFilterMobile activeFilterSection={activeFilterSection} toggleFilterSection={toggleFilterSection} />
          </div>

          {/* قسم الماركات */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleFilterSection('brands')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-800">{t("Brand")}</span>
              </div>
              {activeFilterSection === 'brands' ?
                <ChevronUp className="w-5 h-5 text-gray-500" /> :
                <ChevronDown className="w-5 h-5 text-gray-500" />
              }
            </button>

            {activeFilterSection === 'brands' && (
              <div className="p-3 border-t border-gray-200">
                <BrandsFilter />
              </div>
            )}
          </div>

          {/* قسم السعر */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleFilterSection('price')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-800">{t("Price")}</span>
              </div>
              {activeFilterSection === 'price' ?
                <ChevronUp className="w-5 h-5 text-gray-500" /> :
                <ChevronDown className="w-5 h-5 text-gray-500" />
              }
            </button>

            {activeFilterSection === 'price' && (
              <div className="p-4 border-t border-gray-200">
                <PriceRangeFilter />
              </div>
            )}
          </div>

        </div>

        {/* أزرار التطبيق والمسح */}
        <div className="border-t border-gray-200 p-5 bg-gray-50">
          <div className="flex gap-4">
            <button
              onClick={resetFilters}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-100 active:scale-95 transition duration-200 shadow-sm flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              {t("ClearAll")}
            </button>

            <button
              onClick={applyFilters}
              className="flex-1 py-3 bg-main text-white rounded-2xl font-semibold hover:brightness-105 active:scale-95 transition duration-200 shadow-md flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              {t("ApplyFilters")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
