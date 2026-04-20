"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { Plus, X } from "lucide-react";
import {
  addAdditionalData,
  updateAdditionalData,
  removeAdditionalData,
} from "@/rtk/slices/ui/ProductSlice";
import { RootState } from "@/rtk/store";

export default function AdditionalData() {
  const t = useTranslations("addProduct");
  const dispatch = useDispatch();

  const additionalData = useSelector(
    (state: RootState) => state.productDraft.additionalData
  );


  const customItems = additionalData
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => item.type === 7);

  const addKeyHandler = () => {
    dispatch(addAdditionalData());
  };

  const updateKeyName = (originalIndex: number, value: string) => {
    dispatch(updateAdditionalData({ index: originalIndex, field: "key", value }));
  };

  const saveValue = (originalIndex: number, value: string) => {
    dispatch(
      updateAdditionalData({
        index: originalIndex,
        field: "values",
        value: value ? [value] : [],
      })
    );
  };

  const removeKey = (originalIndex: number) => {
    dispatch(removeAdditionalData(originalIndex));
  };

  return (
    <section className="bg-white shadow-md p-6 lg:p-8 w-full border border-gray-200">
      {/* Header unchanged */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-main bg-clip-text text-transparent">
          {t('settings.title')}
        </h3>
      </div>

      <div className="space-y-6">
        {customItems.map(({ item, originalIndex }) => (
          <div
            key={originalIndex}
            className="flex gap-3"
          >
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => removeKey(originalIndex)}
                className="p-2 rounded-full text-red-500 hover:bg-red-50 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Key */}
            <input
              type="text"
              value={item.key}
              onChange={(e) => updateKeyName(originalIndex, e.target.value)}
              placeholder={t("Age")}
              className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
            />

            {/* Value */}
            <input
              type="text"
              value={item.values[0] || ""}
              onChange={(e) => saveValue(originalIndex, e.target.value)}
              placeholder={t("From 6 to 10")}
              className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
            />
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={addKeyHandler}
            className="py-2 px-6 font-semibold text-white bg-main transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={16} /> {t("additionalData.add")}
          </button>
        </div>
      </div>
    </section>
  );
}