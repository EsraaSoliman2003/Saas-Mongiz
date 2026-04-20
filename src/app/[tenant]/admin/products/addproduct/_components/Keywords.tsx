"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { Plus, X } from "lucide-react";
import { addKeyword, removeKeyword } from "@/rtk/slices/ui/ProductSlice";
import { RootState } from "@/rtk/store";

export default function Keywords() {
  const t = useTranslations("addProduct");
  const dispatch = useDispatch();
  const keywords = useSelector((state: RootState) => state.productDraft.keywords);
  const [keywordInput, setKeywordInput] = useState("");

  const addKeywordHandler = () => {
    const trimmed = keywordInput.trim();
    if (trimmed) {
      dispatch(addKeyword(trimmed));
      setKeywordInput("");
    }
  };

  const removeKeywordHandler = (keyword: string) =>
    dispatch(removeKeyword(keyword));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeywordHandler();
    }
  };

  return (
    <section className="bg-white shadow-md p-6 lg:p-8 w-full border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-main bg-clip-text text-transparent">
          {t("settings.keywords")}
        </h3>
      </div>

      {/* Keywords tags */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {keywords.map((keyword, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-gray-50 text-sm text-gray-700"
            >
              {keyword}

              <button
                type="button"
                onClick={() => removeKeywordHandler(keyword)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input + Button (Responsive) */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("settings.keywordsPlaceholder")}
          className="flex-1 py-2 px-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
        />

        <button
          type="button"
          onClick={addKeywordHandler}
          disabled={!keywordInput.trim()}
          className="w-full sm:w-auto py-2 px-6 font-semibold text-white bg-main transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("settings.addKeyword") || "Add"}
        </button>
      </div>
    </section>
  );
}