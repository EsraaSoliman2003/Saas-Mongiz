"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchSettings, updateSettings } from "@/rtk/slices/setting/settingSlice";

export default function ColorCard() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const { data } = useAppSelector((s) => s.settings);

  const [primary, setPrimary] = useState("#FF7642");
  const [secondary, setSecondary] = useState("#161727");
  const [loading, setLoading] = useState(false);

  // ✅ sync with API data
  useEffect(() => {
    if (data?.id) {
      setPrimary(data.primaryColor || "#FF7642");
      setSecondary(data.secondaryColor || "#161727");
    }
  }, [data]);

  const handleSave = async () => {
    if (!data?.id) return;

    try {
      setLoading(true);

      await dispatch(
        updateSettings({
          id: data.id,
          name: data.name,
          primaryColor: primary,
          secondaryColor: secondary,
        })
      ).unwrap();

      dispatch(fetchSettings(data.id));

      document.documentElement.style.setProperty("--main-color", primary);
      document.documentElement.style.setProperty("--dark-color", secondary);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group rounded-2xl bg-white transition-all duration-300 overflow-hidden">
      <div className="p-6 md:p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {t("Brand Colors")}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {t("Define your brand's primary and secondary colors")}
            </p>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-5">

          {/* PRIMARY */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50/50 rounded-xl">
            <div>
              <p className="font-semibold text-gray-800">
                {t("Primary Color")}
              </p>
              <p className="text-xs text-gray-400 font-mono">
                {primary.toUpperCase()}
              </p>
            </div>

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

          {/* SECONDARY */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50/50 rounded-xl">
            <div>
              <p className="font-semibold text-gray-800">
                {t("Secondary Color")}
              </p>
              <p className="text-xs text-gray-400 font-mono">
                {secondary.toUpperCase()}
              </p>
            </div>

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

          {/* Preview */}
          <div className="mt-4 rounded-xl overflow-hidden">
            <div className="flex h-2">
              <div style={{ width: "50%", backgroundColor: primary }} />
              <div style={{ width: "50%", backgroundColor: secondary }} />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="mt-6 pt-2 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" />
                {t("Saving")}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" />
                {t("Save Colors")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}