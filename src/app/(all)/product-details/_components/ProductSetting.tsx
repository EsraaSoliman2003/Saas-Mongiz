"use client";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ProductApi } from "@/rtk/slices/productDetails/productDetailsSlice";
import { Check } from "lucide-react";

type ProductSelections = {
    color?: { id: number; name: string | null };
    size?: { id: number; name: string | null };
    volume?: { id: number; name: string | null };
    shape?: { id: number; name: string | null };
    weight?: { id: number; name: string | null };
    memory?: { id: number; name: string | null };
};

type Props = {
    product: ProductApi;
    productWillAdd: ProductSelections;
    setProductWillAdd: React.Dispatch<React.SetStateAction<ProductSelections>>;
};

// Map backend type → state field
const TYPE_FIELD_MAP: Record<number, keyof ProductSelections> = {
    1: "color",
    2: "volume",
    3: "size",
    4: "shape",
    5: "weight",
    6: "memory",
};

export default function ProductSetting({
    product,
    productWillAdd,
    setProductWillAdd,
}: Props) {
    const t = useTranslations();

    if (!product.additionalData?.length) return null;

    useEffect(() => {
        if (!product.additionalData?.length) return;

        setProductWillAdd((prev) => {
            const updated: ProductSelections = { ...prev };

            product?.additionalData?.forEach((item) => {
                const field = TYPE_FIELD_MAP[item.type];
                if (!field) return;

                // Set first value with id
                if (!updated[field] && item.values?.length) {
                    updated[field] = { id: item.id, name: item.values[0] };
                }
            });

            return updated;
        });
    }, [product.additionalData, setProductWillAdd]);

    return (
        <>
            {product.additionalData.map((item) => {
                if (!item.values || item.values.length <= 1 || !item.values?.length) return null;

                const field = TYPE_FIELD_MAP[item.type];
                if (!field) return null;

                const selectedValue = productWillAdd[field];

                return (
                    <div
                        key={item.id}
                        className="px-6 md:px-8 py-3 border-t border-gray-100" // reduced py-5 to py-3
                    >
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            {t(`select${item.key}`)}
                        </h3>

                        <div className="flex gap-1.5 flex-wrap">
                            {item.values.map((value: string) => {
                                const isSelected = selectedValue?.name === value; // compare with name

                                if (field === "color") {
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            className={`relative w-8 h-8 rounded-full border-2 transition-all ${isSelected ? "border-black scale-110" : "border-gray-300 hover:border-gray-400"
                                                }`}
                                            style={{ backgroundColor: value }}
                                            onClick={() =>
                                                setProductWillAdd((prev) => ({
                                                    ...prev,
                                                    [field]: { id: item.id, name: value }, // object with id + name
                                                }))
                                            }
                                            aria-label={`Select color ${value}`}
                                        >
                                            {isSelected && (
                                                <Check
                                                    size={14}
                                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md"
                                                    strokeWidth={3}
                                                />
                                            )}
                                        </button>
                                    );
                                }

                                // Default text options
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        className={`px-3 py-1.5 text-sm font-bold rounded-4xl transition-all ${isSelected ? "bg-black text-white border-black shadow-md" : "bg-gray-50"
                                            } focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1`}
                                        onClick={() =>
                                            setProductWillAdd((prev) => ({
                                                ...prev,
                                                [field]: { id: item.id, name: value }, // <-- wrap in object
                                            }))
                                        }
                                    >
                                        {value}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </>
    );
}