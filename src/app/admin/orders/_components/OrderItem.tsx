"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock3, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { OrderApi } from "@/rtk/slices/orders/ordersSlice";

type OrderStatus = 1 | 2 | 3;

function StatusBadge({ text, className }: { text: string; className: string }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${className}`}
    >
      {text}
    </span>
  );
}

const statusConfig: Record<
  OrderStatus,
  {
    badgeClass: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    labelKey: string;
  }
> = {
  1: {
    badgeClass: "bg-yellow-100 text-yellow-600",
    icon: Clock3,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    labelKey: "processing",
  },
  2: {
    badgeClass: "bg-green-100 text-green-600",
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    labelKey: "completed",
  },
  3: {
    badgeClass: "bg-red-100 text-red-600",
    icon: XCircle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    labelKey: "canceled",
  },
};

export default function OrderItem({ order }: { order: OrderApi }) {
  const t = useTranslations();

  const { id, status, user, deliveryDate } = order;
  const config = statusConfig[status as OrderStatus];
  if (!config) return null;

  const Icon = config.icon;

  const dateStr = deliveryDate || new Date().toISOString();
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = t(`months.${date.getMonth() + 1}`);
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes}`;

  return (
    <Link
      href={`/admin/orders/order-details?id=${id}`}
      className="rounded-2xl block cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="bg-white rounded-2xl p-4 transition duration-300 relative">
        {/* Top Section: Icon + Customer Info */}
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${config.iconBg}`}
          >
            <Icon size={20} className={config.iconColor} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-gray-700 text-base truncate">
                #{id}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 truncate">
              {user?.fullName || "—"}
            </p>
          </div>
        </div>

        {/* Middle Section: Order Time */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <span>{formattedDate}</span>
        </div>

        {/* Bottom Section: Status */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-400">{t("status")}</span>
          <StatusBadge text={t(config.labelKey)} className={config.badgeClass} />
        </div>
      </div>
    </Link>
  );
}