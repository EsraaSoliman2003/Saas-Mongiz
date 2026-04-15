// LogoCard.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchLogo, createLogo } from "@/rtk/slices/logo/logoSlice";
import { useTranslations } from "next-intl";
import Image from "next/image";

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

  const LogoItem = ({
    title,
    src,
    loadingState,
    inputRef,
    handleClick,
    placeholder,
  }: any) => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <div className="flex items-center gap-4 w-full md:w-auto">
        {loading ? (
          <div className="h-20 w-40 bg-gray-200 animate-pulse rounded" />
        ) : src ? (
          <div className="relative h-20 w-40 m-auto">
            <Image src={src} alt={title} fill className="object-contain" />
          </div>
        ) : (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}
      </div>

      <div className="w-full md:w-auto">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleClick}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={loadingState}
          className="px-6 py-2 rounded-lg bg-dark text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 w-full md:w-auto"
        >
          {loadingState ? t("Loading") : title}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <LogoItem
        title={t("Change Dark Logo")}
        src={logo?.logoDarkMode}
        loadingState={darkLoading}
        inputRef={darkInputRef}
        handleClick={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(e, "dark")
        }
        placeholder={t("No dark logo")}
      />

      <LogoItem
        title={t("Change Light Logo")}
        src={logo?.logoLightMode}
        loadingState={lightLoading}
        inputRef={lightInputRef}
        handleClick={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(e, "light")
        }
        placeholder={t("No light logo")}
      />
    </div>
  );
};

export default LogoCard;
