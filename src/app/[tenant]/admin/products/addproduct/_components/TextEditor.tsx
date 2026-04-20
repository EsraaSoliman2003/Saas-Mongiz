"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/rtk/store";
import { setField } from "@/rtk/slices/ui/ProductSlice";

export default function Description() {
    const t = useTranslations("addProduct");
    const dispatch = useDispatch();
    const description = useSelector(
        (state: RootState) => state.productDraft.description
    );

    return (
        <section className="bg-white p-6 lg:p-8 w-full border border-gray-200">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-main">
                    {t("description.title") || "Description"}{" "}
                    <span className="text-red-600">*</span>
                </h3>
            </div>

            {/* Textarea بدل Editor */}
            <textarea
                value={description || ""}
                onChange={(e) =>
                    dispatch(
                        setField({
                            key: "description",
                            value: e.target.value.replace(/(\r\n|\n|\r)/gm, " "),
                        })
                    )
                }
                onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                }}
                placeholder={t("description.title")}
                className="w-full border border-gray-300 p-4 focus:outline-none resize-none"
                style={{ height: "200px" }}
            />
        </section>
    );
}