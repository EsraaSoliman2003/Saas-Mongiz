"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { setCurrency } from "@/rtk/slices/ui/Currency";
import { setCookie } from "cookies-next";
import { useTranslations } from "next-intl";

const Currency = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { currency: selectedCurrency } = useAppSelector((s) => s.currencyValue);
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const currencies = [
    { code: "USD", label: "USD" },
    { code: "EGP", label: "EGP" },
    { code: "SAR", label: "SAR" },
    { code: "AED", label: "AED" },
    { code: "JOD", label: "JOD" },
    { code: "CNY", label: "CNY" },
  ];

  const changeCurrency = (currency: string) => {
    setCookie("currency", currency);
    dispatch(setCurrency(currency));
    setOpen(false); // close dropdown after selection
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block">
      {/* Current currency */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 px-3 py-1 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer text-sm font-medium"
      >
        {t(selectedCurrency || "USD")}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-32 bg-white shadow-lg rounded-lg z-50"
        >
          <div className="flex flex-col text-sm text-gray-700">
            {currencies.map((c) => (
              <button
                key={c.code}
                onClick={() => changeCurrency(c.code)}
                className="px-4 py-2 hover:bg-gray-100 text-left"
              >
                {t(c.label)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Currency;