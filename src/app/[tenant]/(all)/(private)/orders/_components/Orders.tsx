"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import NoData from "@/components/noData/NoData";
import { fetchOrderHistory, updateOrderStatus } from "@/rtk/slices/orders/ordersSlice";
import OrdersSkeleton from "@/skeleton/OrdersSkeleton";
import {
    HiOutlineShoppingBag,
    HiOutlineCalendar,
    HiOutlineCash,
    HiOutlineTrash,
    HiOutlineRefresh,
} from "react-icons/hi";
import { FiPackage } from "react-icons/fi";

type OrderStatus = "completed" | "processing" | "canceled";
type FilterType = "all" | OrderStatus;

const statusConfig: Record<
    OrderStatus,
    { color: string; bg: string; border: string; icon: React.ReactNode; text: string }
> = {
    completed: {
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        icon: <HiOutlineShoppingBag className="w-3.5 h-3.5" />,
        text: "مكتمل",
    },
    processing: {
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        icon: <HiOutlineRefresh className="w-3.5 h-3.5" />,
        text: "قيد التنفيذ",
    },
    canceled: {
        color: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
        icon: <HiOutlineTrash className="w-3.5 h-3.5" />,
        text: "ملغي",
    },
};

const mapStatus = (status: number): OrderStatus => {
    switch (status) {
        case 1:
            return "processing";
        case 2:
            return "completed";
        case 3:
            return "canceled";
        default:
            return "processing";
    }
};

export default function Orders() {
    const t = useTranslations();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<FilterType>("all");

    const { historyItems, historyLoading } = useAppSelector((s) => s.order);
    const { data } = useAppSelector((s) => s.currency)
    const { currency } = useAppSelector((s) => s.currencyValue)

    useEffect(() => {
        dispatch(fetchOrderHistory());
    }, [dispatch]);

    const filteredOrders = useMemo(() => {
        if (statusFilter === "all") return historyItems;
        return historyItems.filter(
            (order) => mapStatus(order.orderStatus) === statusFilter
        );
    }, [historyItems, statusFilter]);

    const handleOrderClick = (orderId: number) => {
        router.push(`/order-details?id=${orderId}`);
    };

    const handleCancelOrder = async (e: React.MouseEvent, orderId: number) => {
        e.stopPropagation();
        if (cancellingId) return;

        setCancellingId(orderId);
        try {
            await dispatch(
                updateOrderStatus({
                    orderId,
                    status: 3,
                })
            ).unwrap();
            await dispatch(fetchOrderHistory());
        } catch (error) {
            console.error("Cancel failed", error);
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("ar-EG", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    if (historyLoading) {
        return (
            <>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{t("MyOrders")}</h2>
                <OrdersSkeleton />
            </>
        );
    }

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t("MyOrders")}</h2>

                {/* Filter buttons with icons */}
                <div className="flex flex-wrap gap-2">
                    {(["all", "completed", "processing", "canceled"] as const).map(
                        (filter) => {
                            const isActive = statusFilter === filter;
                            let label = "";
                            let Icon = null;
                            if (filter === "all") {
                                label = t("All") || "الكل";
                                Icon = FiPackage;
                            } else {
                                label = statusConfig[filter].text;

                                Icon = () => statusConfig[filter].icon;
                            }

                            return (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(filter)}
                                    className={`
                                        inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all
                                        border focus:outline-none focus:ring-2 focus:ring-[#FF7642]
                                        ${isActive
                                            ? "bg-[#FF7642] text-white border-[#FF7642] hover:bg-[#FF7642]"
                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                        }
                                    `}
                                >
                                    {filter !== "all" && statusConfig[filter].icon}
                                    {filter === "all" && <FiPackage className="w-4 h-4" />}
                                    <span>{label}</span>
                                </button>
                            );
                        }
                    )}
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <NoData />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {filteredOrders.map((order) => {
                        const currentStatus = mapStatus(order.orderStatus);
                        const status = statusConfig[currentStatus];
                        const isProcessing = currentStatus === "processing";
                        const isCancelling = cancellingId === order.orderId;

                        return (
                            <div
                                key={order.orderId}
                                onClick={() => handleOrderClick(order.orderId)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleOrderClick(order.orderId);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2"
                            >
                                {/* Gradient accent bar with status color */}
                                <div
                                    className={`absolute top-0 left-0 w-1.5 h-full bg-linear-to-b ${status.bg.replace(
                                        "bg-",
                                        "from-"
                                    )} to-transparent`}
                                />

                                <div className="p-5 pr-4">
                                    {/* Header: Order ID with icon */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-gray-100 rounded-lg transition-colors">
                                                <FiPackage className="w-5 h-5 text-gray-600 group-hover:text-[#FF7642] transition-colors" />
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500">
                                                    #{order.orderId}
                                                </span>
                                                <h3 className="text-base font-semibold text-gray-800">
                                                    {t("orderNumber", { id: order.orderId })}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                                            <HiOutlineCalendar className="w-3.5 h-3.5" />
                                            <span>{formatDate(order.orderDate)}</span>
                                        </div>
                                    </div>

                                    {/* Body: Items summary and total */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <HiOutlineShoppingBag className="w-4 h-4" />
                                                <span>{t("itemsCount", { count: order.itemsCount })}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                                                <HiOutlineCash className="w-4 h-4 text-gray-500" />
                                                <span>
                                                    {(order.totalPrice * (data?.[currency || "USD"] ?? 1)).toFixed(2)}
                                                    <span className="text-sm">{t("EGP")}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer: Cancel button (if processing) and status badge */}
                                    <div className="flex items-center justify-between">
                                        {isProcessing ? (
                                            <button
                                                onClick={(e) => handleCancelOrder(e, order.orderId)}
                                                disabled={isCancelling}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-full hover:bg-rose-100 hover:text-rose-800 hover:border-rose-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                                            >
                                                {isCancelling ? (
                                                    <>
                                                        <HiOutlineRefresh className="w-3.5 h-3.5 animate-spin" />
                                                        <span>{t("Cancelling")}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <HiOutlineTrash className="w-3.5 h-3.5" />
                                                        <span>{t("CancelOrder")}</span>
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <div />
                                        )}

                                        {/* Status badge with subtle shadow */}
                                        <span
                                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm ${status.bg} ${status.color} ${status.border}`}
                                        >
                                            {status.icon}
                                            {status.text}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}