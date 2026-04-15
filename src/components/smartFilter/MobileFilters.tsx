"use client";

import React from "react";
import { IoIosArrowDown, IoIosClose, IoIosCheckmark } from "react-icons/io";
import { useTranslations } from "next-intl";

interface Props {
    FILTERS: Record<string, any[]>;
    selected: Record<string, any>;
    openFilter: string | null;
    toggleFilter: (key: string) => void;
    selectValue: (key: string, value: any) => void;
    clearFilter: (key: string) => void;
    closeMobile: () => void;
}

const MobileFilters = ({
    FILTERS,
    selected,
    openFilter,
    toggleFilter,
    selectValue,
    clearFilter,
    closeMobile
}: Props) => {
    const t = useTranslations();

    // معالجة اختيار قيمة فلتر
    const handleSelectValue = (key: string, value: any, e: React.MouseEvent) => {
        e.stopPropagation();
        // تحديث القيمة المختارة
        selectValue(key, value);
    };

    // معالجة مسح فلتر
    const handleClearFilter = (key: string, e: React.MouseEvent) => {
        e.stopPropagation();
        clearFilter(key);
        toggleFilter(key);
    };

    // معالجة النقر على عنوان الفلتر
    const handleHeaderClick = (key: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFilter(key);
    };

    // منع انتشار الحدث للعناصر الفرعية
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <>
            {/* طبقة التعتيم الخلفية */}
            <div 
                onClick={closeMobile} 
                className="fixed inset-0 bg-black/40 z-40 lg:hidden" 
            />

            {/* لوحة الفلاتر */}
            <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl border border-[#919EAB33] p-5 max-h-[90vh] overflow-y-auto lg:hidden animate-slideUp">
                {/* الهيدر */}
                <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold title-color text-lg">{t("Filters")}</h4>
                    <button 
                        onClick={closeMobile}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                    >
                        <IoIosClose size={34} />
                    </button>
                </div>

                {/* قائمة الفلاتر */}
                <div className="space-y-4">
                    {Object.entries(FILTERS).map(([key, options]) => {
                        const selectedValue = selected[key];
                        const isOpen = openFilter === key;
                        console.log(isOpen)

                        return (
                            <div 
                                key={key} 
                                className="rounded-2xl border border-[#919EAB33] p-4"
                                onClick={handleContentClick}
                            >
                                {/* عنوان الفلتر */}
                                <button 
                                    type="button" 
                                    onClick={(e) => handleHeaderClick(key, e)} 
                                    className="w-full flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold title-color">
                                            {t(key)}
                                        </span>
                                        {selectedValue && (
                                            <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-lg border border-green-200">
                                                {selectedValue.name}
                                            </span>
                                        )}
                                    </div>
                                    <IoIosArrowDown 
                                        className={`transition-transform duration-200 ${
                                            isOpen ? "rotate-180" : ""
                                        }`} 
                                    />
                                </button>

                                {/* محتوى الفلتر (يظهر عند الفتح) */}
                                {isOpen && (
                                    <div className="mt-4">
                                        <div className="grid grid-cols-2 gap-2">
                                            {options.map((option: any) => {
                                                const isActive = selectedValue?.id === option.id;
                                                
                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={(e) => handleSelectValue(key, option, e)}
                                                        className={`
                                                            h-11 px-3 rounded-xl border text-sm font-semibold 
                                                            transition-all duration-200 flex items-center justify-center gap-2
                                                            ${isActive 
                                                                ? "bg-green-500 text-white border-green-500" 
                                                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                                            }
                                                        `}
                                                    >
                                                        {option.name}
                                                        {isActive && <IoIosCheckmark size={16} />}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* زر مسح الفلتر */}
                                        {selectedValue && (
                                            <button
                                                type="button"
                                                onClick={(e) => handleClearFilter(key, e)}
                                                className="mt-4 w-full h-11 rounded-xl border border-red-300 bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition flex items-center justify-center gap-2"
                                            >
                                                <IoIosClose size={18} />
                                                {t("Clear")} {t(key)}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* زر الإنهاء */}
                <div className="sticky bottom-0 bg-white pt-4 mt-6 border-t">
                    <button 
                        onClick={closeMobile} 
                        className="w-full h-12 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition shadow-md"
                    >
                        {t("Done")}
                    </button>
                </div>
            </div>
        </>
    );
};

export default MobileFilters;