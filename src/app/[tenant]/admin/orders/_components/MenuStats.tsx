"use client";
import React from "react";
import { Wallet, Clock3, ShoppingBag, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MenuStats() {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">

      {/* Revenue */}
      <div className="bg-white rounded-2xl p-5 hover:shadow-md transition duration-300 flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
          <TrendingUp className="text-green-500" size={22} />
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">
            <span className="text-sm text-gray-400 font-medium">
              {t("currency")}
            </span>{" "}
            257,779
          </p>
          <p className="text-sm text-gray-500">{t("revenue")}</p>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-2xl p-5 hover:shadow-md transition duration-300 flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
          <ShoppingBag className="text-blue-500" size={22} />
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">100</p>
          <p className="text-sm text-gray-500">{t("orders")}</p>
        </div>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-2xl p-5 hover:shadow-md transition duration-300 flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100">
          <Clock3 className="text-yellow-500" size={22} />
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">37</p>
          <p className="text-sm text-gray-500">{t("pending")}</p>
        </div>
      </div>

      {/* Average Value */}
      <div className="bg-white rounded-2xl p-5 hover:shadow-md transition duration-300 flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100">
          <Wallet className="text-purple-500" size={22} />
        </div>

        <div>
          <p className="text-lg font-bold text-gray-900">
            <span className="text-sm text-gray-400 font-medium">
              {t("currency")}
            </span>{" "}
            3906
          </p>
          <p className="text-sm text-gray-500">{t("averageValue")}</p>
        </div>
      </div>

    </div>
  );
}
