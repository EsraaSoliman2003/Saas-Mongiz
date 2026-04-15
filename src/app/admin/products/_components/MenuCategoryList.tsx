"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductItem from "./ProductItem";
import { useTranslations } from "next-intl";

type CategorySectionProps = {
  title: string;
  itemsCount: number;
};

export default function CategorySection({ title, itemsCount }: CategorySectionProps) {
  const t = useTranslations();

  return (
    <div className="space-y-4 bg-white rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
          <p className="text-sm text-gray-500">
            {itemsCount} {t("items")}
          </p>
        </div>

        <button className="flex items-center text-sm text-gray-500 hover:text-(--main-color) transition-colors group cursor-pointer">
          <span>{t("viewAll")}</span>
          {
            t("dir") === "rtl"
              ? <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              : <ChevronRight className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
          }
        </button>
      </div>

      {/* Products */}
      <div className="space-y-3">
        <ProductItem
          name={t("powerBank")}
          description={t("highQualityDescription")}
          price="EGP 599"
        />
        <ProductItem
          name={t("powerBank")}
          description={t("highQualityDescription")}
          price="EGP 599"
        />
        <ProductItem
          name={t("powerBank")}
          description={t("highQualityDescription")}
          price="EGP 599"
        />
      </div>
    </div>
  );
}
