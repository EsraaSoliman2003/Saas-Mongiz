"use client";

import { useTranslations } from "next-intl";
import Search from "./Search";
import DesktopFilters from "./DesktopFilters";
import MobileFilters from "./MobileFilters";
import Image from "next/image";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchCategories } from "@/rtk/slices/category/categoriesSlice";
import { fetchBrands } from "@/rtk/slices/brands/brandsSlice";
import { fetchSubCategories } from "@/rtk/slices/subCategories/subCategoriesSliceHome1";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

interface Props {
    isFullExist?: boolean;
}

const ProductFilterBar = ({ isFullExist }: Props) => {
    const t = useTranslations();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [selected, setSelected] = useState<Record<string, any>>({});
    const [desktopOpenFilter, setDesktopOpenFilter] = useState<string | null>(null);
    const [mobileOpenFilter, setMobileOpenFilter] = useState<string | null>(null);
    const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const { data: categories, loading: loadCat } = useAppSelector((s) => s.categories);
    const { items: brands, loading: loadBrand } = useAppSelector((s) => s.brands);
    const { data: subCategories } = useAppSelector((s) => s.subCategoriesHome1);

    const getSubCategoriesForSelectedCategory = useCallback(() => {
        const selectedCategory = selected["Category"];
        if (!selectedCategory?.id) return [];

        return subCategories.filter(sub => sub.categoryId === selectedCategory.id);
    }, [selected, subCategories]);

    const FILTERS = useMemo(() => {
        const subCategoryOptions = getSubCategoriesForSelectedCategory().map((sub: any) => ({
            id: sub.id,
            name: sub.name || sub.nameEN || sub.nameAR
        }));

        return {
            Category: [
                ...(categories?.map((cat: any) => ({ id: cat.id, name: cat.name })) || []),
            ],
            SubCategory: subCategoryOptions,
            Brand: [
                ...(brands?.map((b: any) => ({ id: b.id, name: b.name })) || []),
            ],
            Rating: [
                { id: 1, name: "0-1", min: 0, max: 1 },
                { id: 2, name: "1-2", min: 1, max: 2 },
                { id: 3, name: "2-3", min: 2, max: 3 },
                { id: 4, name: "3-4", min: 3, max: 4 },
                { id: 5, name: "4-5", min: 4, max: 5 },
            ],
            Price: [
                { id: 1, name: "0 - 500", min: 0, max: 500 },
                { id: 2, name: "500 - 1000", min: 500, max: 1000 },
                { id: 3, name: "1000+", min: 1000, max: 1000000 },
            ],
        };
    }, [categories, brands, getSubCategoriesForSelectedCategory]);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchBrands());
    }, [dispatch]);

    useEffect(() => {
        const selectedCategory = selected["Category"];
        if (selectedCategory?.id) {
            dispatch(fetchSubCategories(selectedCategory.id));
        }
    }, [selected, dispatch]);

    useEffect(() => {
        const sub = selected["SubCategory"];
        if (!sub?.id || sub.name) return;
        if (!subCategories.length) return;

        const match = subCategories.find(c => c.id === sub.id);
        if (match) {
            setSelected(prev => ({
                ...prev,
                SubCategory: { id: match.id, name: match.name }
            }));
        }
    }, [subCategories, selected]);


    useEffect(() => {
        if (loadCat || loadBrand || isInitialized) return;

        const newSelected: Record<string, any> = {};

        const categoryId = searchParams.get("category");
        const subCategoryId = searchParams.get("subCategory");
        const brandId = searchParams.get("brand");
        const priceName = searchParams.get("price");
        const ratingName = searchParams.get("rating");

        if (categoryId) {
            const cat = categories.find((c: any) => c.id === +categoryId);
            if (cat) {
                newSelected["Category"] = { id: cat.id, name: cat.name };
            }
        }
        if (subCategoryId) {
            newSelected["SubCategory"] = { id: +subCategoryId, name: "" };
        }

        if (brandId) {
            const brand = brands.find((b: any) => b.id === +brandId);
            if (brand) {
                newSelected["Brand"] = { id: brand.id, name: brand.name };
            }
        }

        if (ratingName) {
            const rateObj = FILTERS.Rating.find((r) => r.name === ratingName);
            if (rateObj) {
                newSelected["Rating"] = rateObj;
            }
        }

        if (priceName) {
            const priceObj = FILTERS.Price.find((p) => p.name === priceName);
            if (priceObj) {
                newSelected["Price"] = priceObj;
            }
        }

        setSelected(newSelected);
        setIsInitialized(true);
    }, [categories, brands, searchParams, FILTERS, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;

        const params = new URLSearchParams();

        if (selected["Category"]?.id) {
            params.set("category", selected["Category"].id.toString());
        }
        if (selected["SubCategory"]?.id) {
            params.set("subCategory", selected["SubCategory"].id.toString());
        }
        if (selected["Brand"]?.id) {
            params.set("brand", selected["Brand"].id.toString());
        }
        if (selected["Price"]?.name) {
            params.set("price", selected["Price"].name);
        }
        if (selected["Rating"]?.name) {
            params.set("rating", selected["Rating"].name);
        }

        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

        const timeoutId = setTimeout(() => {
            router.replace(newUrl, { scroll: false });
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [selected, pathname, router, isInitialized]);


    const selectDesktopValue = useCallback((key: string, value: any) => {
        setSelected(prev => {
            const newSelected = { ...prev };

            if (value) {
                newSelected[key] = value;

                if (key === "Category") {
                    delete newSelected["SubCategory"];
                }
            } else {
                delete newSelected[key];
            }

            return newSelected;
        });

        setDesktopOpenFilter(null);
    }, []);

    const toggleDesktopFilter = useCallback((key: string) => {
        setDesktopOpenFilter(prev => prev === key ? null : key);
    }, []);


    const selectMobileValue = useCallback((key: string, value: any) => {
        setSelected(prev => {
            const newSelected = { ...prev };

            if (value) {
                newSelected[key] = value;

                if (key === "Category") {
                    delete newSelected["SubCategory"];
                }
            } else {
                delete newSelected[key];
            }

            return newSelected;
        });

        setMobileOpenFilter(prev => prev === key ? null : key);
    }, []);

    const toggleMobileFilter = useCallback((key: string) => {
        setMobileOpenFilter(prev => prev === key ? null : key);
    }, []);


    const clearFilter = useCallback((key: string) => {
        setSelected(prev => {
            const newSelected = { ...prev };
            delete newSelected[key];

            if (key === "Category") {
                delete newSelected["SubCategory"];
            }

            return newSelected;
        });

        setDesktopOpenFilter(null);
        setMobileOpenFilter(null);
    }, []);

    const clearAll = useCallback(() => {
        setSelected({});
        setDesktopOpenFilter(null);
        setMobileOpenFilter(null);
        setIsInitialized(true);
    }, []);

    const openMobilePanel = useCallback(() => {
        setMobilePanelOpen(true);
        setMobileOpenFilter(null);
    }, []);

    const closeMobilePanel = useCallback(() => {
        setMobilePanelOpen(false);
        setMobileOpenFilter(null);
    }, []);

    return (
        <div className="AdminContainer mt-6 md:mt-[30px] flex flex-col gap-4">
            <div className="flex items-center gap-5 justify-between md:justify-start flex-wrap">
                <h3 className="font-semibold md:text-xl">{t("Filter Option")}</h3>
                {Object.keys(selected).length > 0 && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="font-semibold text-xs md:text-sm text-main underline hover:text-red-600 transition"
                    >
                        {t("Clear All")}
                    </button>
                )}
            </div>
            <div className="mt-4 md:mt-5 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                <div className="w-full lg:flex-1 min-w-0">
                    <div className="flex items-center gap-3 w-full">
                        <div className="flex-1 min-w-0">
                            <Search />
                        </div>

                        <button
                            type="button"
                            onClick={openMobilePanel}
                            className="w-11 h-11 flex justify-center items-center lg:hidden bg-[#E8F3E6] rounded-xl hover:bg-[#d4e8d1] transition shrink-0"
                        >
                            <div className="w-6 h-6 relative">
                                <SearchIcon />
                            </div>
                        </button>
                    </div>
                </div>

                <DesktopFilters
                    FILTERS={FILTERS}
                    selected={selected}
                    openFilter={desktopOpenFilter}
                    toggleFilter={toggleDesktopFilter}
                    selectValue={selectDesktopValue}
                    clearFilter={clearFilter}
                    closeDesktop={() => setDesktopOpenFilter(null)}
                />
            </div>


            {mobilePanelOpen && (
                <MobileFilters
                    FILTERS={FILTERS}
                    selected={selected}
                    openFilter={mobileOpenFilter}
                    toggleFilter={toggleMobileFilter}
                    selectValue={selectMobileValue}
                    clearFilter={clearFilter}
                    closeMobile={closeMobilePanel}
                />
            )}

        </div>
    );
};

export default ProductFilterBar;