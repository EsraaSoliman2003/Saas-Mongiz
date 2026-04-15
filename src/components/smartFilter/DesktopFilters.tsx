"use client";

import { useTranslations, useLocale } from "next-intl";
import React, { useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";

interface Props {
    FILTERS: Record<string, any[]>;
    selected: Record<string, any>;
    openFilter: string | null;
    toggleFilter: (key: string) => void;
    selectValue: (key: string, value: any) => void;
    clearFilter: (key: string) => void;
    closeDesktop?: () => void;
}

const DesktopFilters = ({
    FILTERS,
    selected,
    openFilter,
    toggleFilter,
    selectValue,
    clearFilter,
    closeDesktop
}: Props) => {
    const t = useTranslations();
    const locale = useLocale();
    const isRTL = locale === "ar";

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                if (openFilter && closeDesktop) {
                    closeDesktop();
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openFilter, closeDesktop]);

    return (
        <div ref={containerRef} className="hidden lg:flex items-center gap-6 relative flex-wrap">
            {Object.entries(FILTERS).map(([key, options]) => {
                const value = selected[key]?.name;
                const isOpen = openFilter === key;

                return (
                    <div key={key} className="relative">
                        <button
                            type="button"
                            onClick={() => toggleFilter(key)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            <span>{value ? value : t(key)}</span>
                            <IoIosArrowDown className={`transition ${isOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isOpen && (
                            <div
                                className={`absolute top-full mt-2 w-[280px] rounded-2xl border border-gray-200 bg-white shadow-lg p-4 z-50
                                ${!isRTL ? "right-0" : "left-0"}`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <p className="font-bold text-gray-800">{t(key)}</p>
                                    <button 
                                        type="button" 
                                        onClick={() => toggleFilter(key)} 
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <IoIosClose size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2 max-h-[300px] overflow-auto">
                                    {options.map((opt: any) => {
                                        const active = selected[key]?.id === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => selectValue(key, opt)}
                                                className={`
                                                    h-10 px-3 py-2 w-full rounded-xl border text-sm font-semibold transition
                                                    ${active 
                                                        ? "bg-green-500 text-white border-green-500" 
                                                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                                    }
                                                `}
                                            >
                                                {opt.name}
                                            </button>
                                        );
                                    })}
                                </div>

                                {value && (
                                    <button
                                        type="button"
                                        onClick={() => clearFilter(key)}
                                        className="mt-3 w-full h-10 rounded-xl border border-red-300 bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition"
                                    >
                                        {t("Clear")} {t(key)}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DesktopFilters;