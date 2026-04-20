"use client";

import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { updateSettings } from "@/rtk/slices/setting/settingSlice";

const LogoCard = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((s) => s.settings);

  const darkInputRef = useRef<HTMLInputElement>(null);
  const lightInputRef = useRef<HTMLInputElement>(null);

  const [darkLoading, setDarkLoading] = useState(false);
  const [lightLoading, setLightLoading] = useState(false);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: "dark" | "light"
  ) => {
    const file = e.target.files?.[0];
    if (!file || !data?.id) return;

    try {
      mode === "dark" ? setDarkLoading(true) : setLightLoading(true);

      await dispatch(
        updateSettings({
          id: data.id,
          name: data.name,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          logoDark: mode === "dark" ? file : undefined,
          logoLight: mode === "light" ? file : undefined,
        })
      ).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setDarkLoading(false);
      setLightLoading(false);
    }
  };

  return (
    <div className="group rounded-2xl bg-white transition-all duration-300 overflow-hidden">
      <div className="p-6 md:p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {t("Brand Logo")}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {t("Upload logos for dark and light backgrounds")}
            </p>
          </div>
        </div>

        {/* DARK */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-28 h-20 bg-dark rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
              {loading ? (
                <div className="w-full h-full bg-gray-100 animate-pulse" />
              ) : data?.logoDark ? (
                <div className="relative w-full h-full">
                  <Image
                    src={data.logoDark}
                    alt="Dark logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ) : (
                <span className="text-xs text-gray-400">
                  {t("No logo")}
                </span>
              )}
            </div>

            <div>
              <p className="font-medium text-gray-700">
                {t("Change Dark Logo")}
              </p>
              <p className="text-xs text-gray-400">
                {t("For dark mode")}
              </p>
            </div>
          </div>

          <input
            ref={darkInputRef}
            type="file"
            hidden
            onChange={(e) => handleChange(e, "dark")}
          />

          <button
            onClick={() => darkInputRef.current?.click()}
            disabled={darkLoading}
            className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm"
          >
            {darkLoading ? t("Loading") : t("Upload Dark Logo")}
          </button>
        </div>

        {/* LIGHT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-4">
            <div className="w-28 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
              {loading ? (
                <div className="w-full h-full bg-gray-100 animate-pulse" />
              ) : data?.logoLight ? (
                <div className="relative w-full h-full">
                  <Image
                    src={data.logoLight}
                    alt="Light logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ) : (
                <span className="text-xs text-gray-400">
                  {t("No logo")}
                </span>
              )}
            </div>

            <div>
              <p className="font-medium text-gray-700">
                {t("Change Light Logo")}
              </p>
              <p className="text-xs text-gray-400">
                {t("For light mode")}
              </p>
            </div>
          </div>

          <input
            ref={lightInputRef}
            type="file"
            hidden
            onChange={(e) => handleChange(e, "light")}
          />

          <button
            onClick={() => lightInputRef.current?.click()}
            disabled={lightLoading}
            className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm"
          >
            {lightLoading ? t("Loading") : t("Upload Light Logo")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoCard;