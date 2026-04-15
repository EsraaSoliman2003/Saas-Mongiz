"use client";

import { useAppSelector, useAppDispatch } from "@/rtk/hooks";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import {
    addVariant,
    updateVariantAttribute,
    updateVariantQuantity,
    removeVariant,
    ProductDraft,
    Variant,
} from "@/rtk/slices/ui/ProductSlice";

type Attribute = {
    id: number;
    key: string;
    type: number;
    values: string[];
};

type Combination = Record<string, string>;

export default function VariantsTable() {
    const t = useTranslations();
    const dispatch = useAppDispatch();
    const productDraft = useAppSelector((s) => s.productDraft);

    // Get attributes that are "variant keys"
    const attributes: Attribute[] = productDraft.additionalData.filter((p) =>
        [1, 2, 3, 4, 5, 6].includes(p.type)
    );

    // Generate all combinations
    const generateCombinations = (attrs: Attribute[]): Combination[] => {
        if (!attrs.length) return [];

        return attrs.reduce<Combination[]>((acc, attr) => {
            const result: Combination[] = [];
            acc.forEach((comb) => {
                attr.values.forEach((value) => {
                    result.push({ ...comb, [attr.key]: value });
                });
            });
            return result;
        }, [{}]);
    };

    const combinations = generateCombinations(attributes);

    // Sync Redux variants with generated combinations
    useEffect(() => {
        combinations.forEach((combination, index) => {
            const existing = productDraft.variants[index];
            if (!existing) {
                // Add new variant
                dispatch(addVariant());
            }
            // Update attributes
            Object.entries(combination).forEach(([key, value]) => {
                dispatch(
                    updateVariantAttribute({
                        variantIndex: index,
                        attributeKey: key,
                        value,
                    })
                );
            });
        });

        // Remove extra variants if combinations shrank
        if (productDraft.variants.length > combinations.length) {
            for (let i = productDraft.variants.length - 1; i >= combinations.length; i--) {
                dispatch(removeVariant(i));
            }
        }
    }, [combinations, dispatch, productDraft.variants.length]);

    return (
        <section className="bg-white shadow-md p-6 lg:p-8 w-full border border-gray-200">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-main bg-clip-text text-transparent">
                    {t("Product Quantities")}
                </h3>
            </div>

            {/* Empty State */}
            {combinations.length === 0 && (
                <div className="text-center py-10 text-gray-400 border">
                    {t("No variants generated yet")}
                </div>
            )}

            {/* Variants Grid */}
            <div className="grid gap-4 max-h-150 overflow-y-auto">
                {productDraft.variants.map((variant, idx) => (
                    <div
                        key={idx}
                        className="border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition"
                    >
                        {/* Attributes */}
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(variant.attributes).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="px-3 py-1.5 bg-gray-100 text-sm text-gray-700"
                                >
                                    <span className="font-medium capitalize">{t(key)}:</span> {value}
                                </div>
                            ))}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-500">{t("Qty")}</label>
                            <input
                                type="number"
                                className="w-24 py-2 px-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
                                value={variant.quantity}
                                onChange={(e) =>
                                    dispatch(
                                        updateVariantQuantity({
                                            variantIndex: idx,
                                            quantity: Number(e.target.value),
                                        })
                                    )
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}