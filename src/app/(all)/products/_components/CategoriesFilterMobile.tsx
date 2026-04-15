"use client";
import React, { useEffect, useState } from "react";
import { Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchMenu } from "@/rtk/slices/categoriesMenu/categoriesMenuSlice";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
    activeFilterSection: string | null;
    toggleFilterSection: (value: string) => void;
}

export default function CategoriesFilterMobile({ activeFilterSection, toggleFilterSection }: Props) {
    const t = useTranslations();
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchMenu());
    }, [dispatch]);

    const { data: categories = [], loading } = useAppSelector((s) => s.categoriesMenu);

    const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const toggleCategory = (index: number) => {
        setOpenCategoryIndex(openCategoryIndex === index ? null : index);
    };

    const handleCategoryChange = (categoryId: string | number) => {
        // Update URL query parameters for category
        const params = new URLSearchParams(window.location.search);
        params.set("category", String(categoryId));
        params.delete("subCategory"); // reset subcategory when switching category
        router.replace(`?${params.toString()}`);

    }

    const handleSelectSubCategory = (categoryName: string, subName: string, categoryId: string | number, subId: string | number) => {
        setActiveCategory(subName);
        setOpenCategoryIndex(null);

        const params = new URLSearchParams(window.location.search);
        params.set("category", String(categoryId));
        params.set("subCategory", String(subId));
        router.replace(`?${params.toString()}`);
    };

    return (
        <>
            <button
                onClick={() => toggleFilterSection("categories")}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-800">{t("Categories")}</span>
                    {activeCategory && (
                        <span className="text-xs bg-main/10 text-main px-2 py-1 rounded-full">
                            {t("Selected")}
                        </span>
                    )}
                </div>
                {activeFilterSection === "categories" ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
            </button>

            {activeFilterSection === "categories" && (
                <div className="p-3 border-t border-gray-200">
                    <div className="space-y-2">
                        {categories.map((category, index) => (
                            <div key={category.id || index} className="border-b last:border-b-0 border-gray-200">
                                <button
                                    onClick={() => {
                                        toggleCategory(index)
                                        handleCategoryChange(category.id)
                                    }}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${activeCategory === category.name ? "bg-main/10 text-main" : "hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">{category.name}</span>
                                    </div>
                                    {openCategoryIndex === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>

                                {openCategoryIndex === index && category.subCategories?.length > 0 && (
                                    <div className="pr-4 pb-2 space-y-1">
                                        {category.subCategories.map((sub, i) => (
                                            <button
                                                key={sub.id || i}
                                                onClick={() => handleSelectSubCategory(category.name, sub.name, category.id, sub.id)}
                                                className={`w-full flex items-center gap-3 p-2 text-sm rounded-md transition-colors ${activeCategory === sub.name ? "bg-main text-white font-medium" : "text-gray-600 hover:bg-gray-100"
                                                    }`}
                                            >
                                                <span>{sub.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}