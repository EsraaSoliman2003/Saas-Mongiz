"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

export default function ColorCard() {
  const t = useTranslations();

  const [primary, setPrimary] = useState("#FF7642");
  const [secondary, setSecondary] = useState("#161727");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log({ primary, secondary });
    setLoading(false);
  };

  return (
    <div className="group rounded-2xl bg-white transition-all duration-300  overflow-hidden">
      <div className="p-6 md:p-7">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{t("Brand Colors")}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {t("Define your brand's primary and secondary colors")}
            </p>
          </div>
        </div>

        {/* Color Items */}
        <div className="space-y-5">
          {/* Primary Color */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50/50 rounded-xl">

            {/* Label */}
            <div>
              <p className="font-semibold text-gray-800">{t("Primary Color")}</p>
              <p className="text-xs text-gray-400 font-mono">
                {primary.toUpperCase()}
              </p>
            </div>

            {/* Single Color Picker */}
            <div className="relative w-12 h-11">
              <input
                type="color"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div
                className="w-full h-full rounded-md shadow-sm"
                style={{ backgroundColor: primary }}
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50/50 rounded-xl">

            {/* Label */}
            <div>
              <p className="font-semibold text-gray-800">{t("Secondary Color")}</p>
              <p className="text-xs text-gray-400 font-mono">
                {secondary.toUpperCase()}
              </p>
            </div>

            {/* Single Color Picker */}
            <div className="relative w-12 h-11">
              <input
                type="color"
                value={secondary}
                onChange={(e) => setSecondary(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div
                className="w-full h-full rounded-md shadow-sm"
                style={{ backgroundColor: secondary }}
              />
            </div>
          </div>

          {/* Live Preview Bar */}
          <div className="mt-4 rounded-xl overflow-hidden">
            <div className="flex h-2">
              <div className="h-full" style={{ width: "50%", backgroundColor: primary }} />
              <div className="h-full" style={{ width: "50%", backgroundColor: secondary }} />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 pt-2 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("Saving")}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t("Save Colors")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}