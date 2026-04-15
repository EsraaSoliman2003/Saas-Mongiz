"use client";
import React from "react";
import { FiPackage, FiGrid, FiDollarSign } from "react-icons/fi";
import { useTranslations } from "next-intl";

type StatCardProps = {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  valueClassName?: string;
  iconBgColor?: string;
  iconColor?: string;
};

const StatCard = ({
  icon,
  value,
  label,
  valueClassName = "text-gray-800",
  iconBgColor = "bg-(--main-color)/10",
  iconColor = "text-(--main-color)",
}: StatCardProps) => {
  return (
    <div className="group bg-white rounded-xl p-5 hover:shadow-lg transition-all duration-300 flex items-center gap-4 border border-transparent hover:border-(--main-color)/10">
      <div
        className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center ${iconColor} text-xl transition-transform`}
      >
        {icon}
      </div>
      <div className="text-right">
        <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
};

export default function MenuStats() {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<FiPackage />}
        value={15}
        label={t("totalItems")}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard
        icon={<FiGrid />}
        value={5}
        label={t("categories")}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
      />
      <StatCard
        icon={<FiPackage />}
        value={15}
        label={t("item")}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard
        icon={<FiDollarSign />}
        value={`EGP 976`}
        label={t("averagePrice")}
        valueClassName="text-green-600"
        iconBgColor="bg-amber-100"
        iconColor="text-amber-600"
      />
    </div>
  );
}
