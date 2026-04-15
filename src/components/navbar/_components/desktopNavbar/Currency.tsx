"use client";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { setCurrency } from "@/rtk/slices/ui/Currency";
import { setCookie } from "cookies-next";
import { useTranslations } from "next-intl";

const Currency = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { currency: selectedCurrency } = useAppSelector((s) => s.currencyValue);

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
  };

  return (
    <div className="relative inline-block group">
      {/* Current currency */}
      <button className="flex items-center gap-1 px-3 py-1 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer text-sm font-medium">
        {t(`${selectedCurrency}text` || "USDtext")}
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-32 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="flex flex-col text-sm text-gray-700">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => changeCurrency(c.code)}
              className="px-4 py-2 hover:bg-gray-100"
            >
              {t(`${c.label}text`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Currency;