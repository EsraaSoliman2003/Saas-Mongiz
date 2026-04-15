"use client";

import React, { useEffect } from "react";
import { FiClock } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchOrdersPaginated } from "@/rtk/slices/orders/ordersSlice";
import Link from "next/link";
import OrdersSkeleton from "@/skeleton/OrdersSkeleton";
import NoData from "@/components/noData/NoData";

/* ================= STATUS TYPES ================= */

type OrderStatus = "new" | "cancelled" | "delivered" | "processing";

type OrderItemProps = {
  id: number;
  status: number; // coming as number from backend
  name: string;
  products: any[];
};

/* ================= STATUS STYLE ================= */

const statusStyles: Record<
  OrderStatus,
  { bg: string; text: string; dot: string }
> = {
  new: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  delivered: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  processing: {
    bg: "bg-(--main-color)/10",
    text: "text-(--main-color)",
    dot: "bg-main",
  },
};

/* ================= STATUS MAPPER ================= */

const statusMap: Record<number, OrderStatus> = {
  1: "processing", // In Progress
  2: "delivered",  // Completed
  3: "cancelled",  // Canceled
};

/* ================= ORDER ITEM ================= */

const OrderItem = ({ id, status, name, products }: OrderItemProps) => {
  const t = useTranslations();

  const mappedStatus = statusMap[status] ?? "new";
  const { bg, text, dot } = statusStyles[mappedStatus];

  return (
    <Link href={`/admin/orders/order-details?id=${id}`} className="group flex items-center justify-between py-4 px-2 rounded-xl hover:bg-gray-50 transition-colors duration-200">

      {/* Left Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF89041A] border border-[#FF8904] text-[#FF8904] font-bold shadow-sm group-hover:shadow-md transition-shadow">
          {name?.charAt(0) || "U"}
        </div>

        <div>
          <p className="font-semibold">{name}</p>

          <p className="text-xs text-gray-500 flex items-center gap-1">
            {products?.length ?? 0}{" "}
            {products?.length === 1 ? t("product") : t("products")}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="text-left">
        <p className="font-semibold text-gray-800">#{id}</p>

        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
          >
            {t(mappedStatus)}
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ================= MAIN COMPONENT ================= */

export default function LatestOrders() {
  const t = useTranslations();
  const { items, loading } = useAppSelector((s) => s.order);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchOrdersPaginated({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  return (
    <div className="bg-white rounded-2xl p-6 hover:shadow-md transition-shadow">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            <FiClock className="text-xl" />
          </div>

          <div>
            <h2 className="text-md font-bold text-gray-800">
              {t("latestOrdersTitle")}
            </h2>
            <p className="text-gray-500 text-sm">
              {t("latestOrdersSubtitle")}
            </p>
          </div>
        </div>

        <Link href={"/admin/orders"} className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-[#FF8904] transition-colors group">
          <span>{t("viewAll")}</span>
          {t("dir") === "rtl" ? (
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
          )}
        </Link>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <OrdersSkeleton />
        ) : items?.length > 0
          ? (
            items?.map((item: any) => (
              <OrderItem
                key={item.id}
                id={item.id}
                status={item.status}
                name={item.user?.fullName || "User"}
                products={item.orderProducts || []}
              />
            ))
          )
          : <NoData />
        }
      </div>
    </div>
  );
}