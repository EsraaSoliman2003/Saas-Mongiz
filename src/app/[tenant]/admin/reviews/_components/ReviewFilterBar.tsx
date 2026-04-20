"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

const tabsKeys = ["all", "approved", "pendingReview"];

export default function ReviewFilterBar() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col lg:flex-row justify-between gap-4">
      
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-sm font-medium justify-center lg:justify-start">
        {tabsKeys.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer
              ${
                activeTab === tab
                  ? "bg-main text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full lg:w-80 flex-1">
        <Search
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder={t("searchByName")}
          className="
            w-full bg-gray-50 rounded-xl py-2 pr-12 pl-4 text-sm text-gray-700 outline-none
            border border-gray-200
            focus:border-main focus:ring-2 focus:ring-(--main-color)/10
            transition-all duration-300
          "
        />
      </div>

    </div>
  );
}
