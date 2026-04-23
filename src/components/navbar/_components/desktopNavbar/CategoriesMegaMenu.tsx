"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, ToLeft, ToRight, bottomArrow } from "@/assets";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/rtk/hooks";
import Link from "next/link";

export default function CategoriesDrawer() {
    const [open, setOpen] = useState(false);
    const t = useTranslations();
    const { data, loading } = useAppSelector((s) => s.categoriesMenu);
    const tenantId = useAppSelector((s) => s.settings.data?.id);

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {/* Trigger */}
            <div className="flex items-center gap-2 cursor-pointer select-none px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-200">
                <Image
                    src={Menu}
                    alt="menu"
                    width={20}
                    height={20}
                    className="transition-transform duration-200 group-hover:scale-110"
                />
                <span className="font-medium text-gray-700 group-hover:text-(--main-color) transition-colors duration-200">
                    {t("Categories")}
                </span>
                <Image
                    src={bottomArrow}
                    alt="arrow"
                    width={12}
                    height={12}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </div>

            {/* Dropdown */}
            {open && !loading && (
                <div
                    className={`absolute top-[100%] ${t("dir") === "rtl" ? "right-0" : "left-0"
                        } rounded-lg z-50 animate-fadeIn shadow-xl`}
                >
                    <div className="w-64 lg:w-80 bg-white rounded-lg overflow-hidden border border-gray-100">
                        <div className="max-h-[70vh] overflow-y-auto py-2">
                            <ul className="space-y-0.5">
                                {data?.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/${tenantId}/products?category=${cat.id}`}
                                        onClick={() => setOpen(false)}
                                        className="px-4 py-2.5 cursor-pointer flex justify-between items-center transition-all duration-200 hover:bg-(--main-color)/10 group"
                                    >
                                        <span className="text-gray-700 group-hover:text-(--main-color) font-medium text-sm">
                                            {cat.name}
                                        </span>
                                        <Image
                                            src={t("dir") === "rtl" ? ToLeft : ToRight}
                                            alt="arrow"
                                            width={6}
                                            height={6}
                                            className="opacity-40 group-hover:opacity-100 transition-opacity"
                                        />
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}