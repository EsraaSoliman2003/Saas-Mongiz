"use client";
import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchStatistical } from "@/rtk/slices/statistical/statisticalSlice";
import { useTranslations } from "next-intl";
import { AiOutlineGift, AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

// Type for the statistical data returned from the API
type StatisticalData = {
  productsCount: number;
  categoriesCount: number;
  ordersCount: number;
  // ... other fields if any
};

type StatCardProps = {
  icon: React.ReactNode;
  number: string | number;
  label: string;
  percentage: string;
  trend: "up" | "down";
  bgColor?: string;
};

// Memoized card component to prevent re-renders when parent state changes
const StatCard = React.memo(({ icon, number, label, percentage, trend, bgColor = "#EEF2FF" }: StatCardProps) => {
  return (
    <div className="group bg-white rounded-xl p-5 hover:shadow-md transition-all duration-300 flex flex-col border border-transparent hover:border-gray-100">
      <div className="flex justify-between items-start">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-300 group-hover:bg-opacity-80"
          style={{ backgroundColor: bgColor }}
        >
          {icon}
        </div>
        <div className={`text-sm font-medium flex items-center ${trend === "up" ? "text-green-600" : "text-red-500"} bg-white px-2 py-1 rounded-full shadow-sm`}>
          {trend === "up" ? <FiTrendingUp className="ml-1" /> : <FiTrendingDown className="ml-1" />}
          {percentage}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-800">{number}</h3>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
});

StatCard.displayName = "StatCard";

// Skeleton component (unchanged)
const StatSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
    <div className="flex justify-between">
      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
      <div className="w-12 h-4 bg-gray-200 rounded-full" />
    </div>
    <div className="mt-6 space-y-2">
      <div className="w-20 h-6 bg-gray-200 rounded" />
      <div className="w-24 h-4 bg-gray-200 rounded" />
    </div>
  </div>
);

export default function StatCards() {
  const t = useTranslations();
  const { data, loading } = useAppSelector((s) => s.statistical) as { data: StatisticalData | null; loading: boolean };
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchStatistical());
  }, [dispatch]);

  // Stable icon references (no recreation on each render)
  const icons = useMemo(
    () => ({
      products: <AiOutlineGift className="text-purple-600 text-2xl" />,
      categories: <AiOutlineUser className="text-blue-600 text-2xl" />,
      orders: <AiOutlineShoppingCart className="text-amber-600 text-2xl" />,
    }),
    []
  );

  // Card configuration – makes it easy to add/remove cards without duplicating JSX
  const cardConfig = useMemo(
    () => [
      {
        key: "products",
        icon: icons.products,
        dataKey: "productsCount" as const,
        label: t("totalProducts"),
        bgColor: "#F3E8FF",
      },
      {
        key: "categories",
        icon: icons.categories,
        dataKey: "categoriesCount" as const,
        label: t("totalCategories"),
        bgColor: "#E8F0FF",
      },
      {
        key: "orders",
        icon: icons.orders,
        dataKey: "ordersCount" as const,
        label: t("totalOrders"),
        bgColor: "#FEF3E2",
      },
    ],
    [icons, t]
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: cardConfig.length }).map((_, idx) => (
          <StatSkeleton key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cardConfig.map(({ key, icon, dataKey, label, bgColor }) => (
        <StatCard
          key={key}
          icon={icon}
          number={data?.[dataKey] ?? 0}
          label={label}
          percentage="" // kept empty to match original design
          trend="up"
          bgColor={bgColor}
        />
      ))}
    </div>
  );
}