"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchLogo, createLogo } from "@/rtk/slices/logo/logoSlice";

const LogoCard = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { logo, loading } = useAppSelector((s) => s.logo);

  const darkInputRef = useRef<HTMLInputElement>(null);
  const lightInputRef = useRef<HTMLInputElement>(null);

  const [darkLoading, setDarkLoading] = useState(false);
  const [lightLoading, setLightLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchLogo());
  }, [dispatch]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: "dark" | "light"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    mode === "dark" ? setDarkLoading(true) : setLightLoading(true);
    await dispatch(
      createLogo(
        mode === "dark" ? { logoDarkMode: file } : { logoLightMode: file }
      )
    );
    mode === "dark" ? setDarkLoading(false) : setLightLoading(false);
  };

  return (
    <div className="group rounded-2xl bg-white transition-all duration-300 overflow-hidden">
      <div className="p-6 md:p-7">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{t("Brand Logo")}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {t("Upload logos for dark and light backgrounds")}
            </p>
          </div>
        </div>

        {/* Dark Logo Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-28 h-20 bg-dark rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
              {loading ? (
                <div className="w-full h-full bg-gray-100 animate-pulse" />
              ) : logo?.logoDarkMode ? (
                <div className="relative w-full h-full">
                  <Image
                    src={logo.logoDarkMode}
                    alt="Dark logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-gray-400">{t("No logo")}</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-700">{t("Change Dark Logo")}</p>
              <p className="text-xs text-gray-400">{t("For dark mode / dark backgrounds")}</p>
            </div>
          </div>
          <input
            ref={darkInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleChange(e, "dark")}
          />
          <button
            onClick={() => darkInputRef.current?.click()}
            disabled={darkLoading}
            className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {darkLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("Loading")}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {t("Upload Dark Logo")}
              </>
            )}
          </button>
        </div>

        {/* Light Logo Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-4">
            <div className="w-28 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
              {loading ? (
                <div className="w-full h-full bg-gray-100 animate-pulse" />
              ) : logo?.logoLightMode ? (
                <div className="relative w-full h-full">
                  <Image
                    src={logo.logoLightMode}
                    alt="Light logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-gray-400">{t("No logo")}</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-700">{t("Change Light Logo")}</p>
              <p className="text-xs text-gray-400">{t("For light mode / white backgrounds")}</p>
            </div>
          </div>
          <input
            ref={lightInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleChange(e, "light")}
          />
          <button
            onClick={() => lightInputRef.current?.click()}
            disabled={lightLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {lightLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("Loading")}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {t("Upload Light Logo")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoCard;