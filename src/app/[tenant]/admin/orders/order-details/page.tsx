"use client";

import React, { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { useTranslations, useFormatter } from "next-intl";
import NoData from "@/components/noData/NoData";
import { fetchOrderById, markOrderProductReady } from "@/rtk/slices/orders/ordersSlice";
import {
    MapPin,
    Package,
    CreditCard,
    CheckCircle,
    XCircle,
    Clock,
    Home,
    Phone,
    Mail,
    Tag,
    Truck,
    User,
} from "lucide-react";
import OrderDetailsSkeleton from "@/skeleton/OrderDetailsSkeleton";
import StatusWithMenu from "../_components/StatusWithMenu";
import { getCookie } from "cookies-next";
import { User as UserData } from "@/utils/dtos";

// ======================
// Status Badge Component (simplified)
// ======================
const StatusBadge = ({ status }: { status: number }) => {
    const t = useTranslations();
    const statusConfig = {
        1: { label: t("processing"), icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
        2: { label: t("completed"), icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
        3: { label: t("canceled"), icon: XCircle, color: "text-rose-600 bg-rose-50 border-rose-200" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || {
        label: t("unknown"),
        icon: Package,
        color: "text-gray-600 bg-gray-50 border-gray-200",
    };
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
};

// ======================
// Timeline Step Component
// ======================
const TimelineStep = ({
    status,
    currentStatus,
    label,
    icon: Icon,
    isLast,
}: {
    status: number;
    currentStatus: number;
    label: string;
    icon: any;
    isLast?: boolean;
}) => {
    const isActive = status <= currentStatus && currentStatus !== 3;
    const isCanceled = currentStatus === 3 && status === 3;
    const isCompleted = status < currentStatus && currentStatus !== 3;

    let lineColor = "bg-gray-200";
    let dotColor = "bg-gray-300";
    let textColor = "text-gray-400";
    let iconColor = "text-gray-400";

    if (isActive || isCanceled) {
        dotColor = isCanceled ? "bg-rose-500" : "bg-[#FF7642]";
        iconColor = isCanceled ? "text-rose-500" : "text-white";
        textColor = "text-gray-700";
        lineColor = isCanceled ? "bg-rose-200" : "bg-[#FF7642]";
    }
    if (isCompleted) {
        dotColor = "bg-[#FF7642]";
        iconColor = "text-white";
        textColor = "text-gray-700";
        lineColor = "bg-[#FF7642]";
    }

    return (
        <div className="flex items-start gap-3 relative">
            <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dotColor} bg-opacity-20`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                {!isLast && <div className={`w-0.5 h-full min-h-8 ${lineColor} mt-1`} />}
            </div>
            <div className="pb-4">
                <p className={`font-medium ${textColor}`}>{label}</p>
            </div>
        </div>
    );
};

// ======================
// Info Card Component (minimal)
// ======================
const InfoCard = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: any }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Icon className="w-4 h-4 text-main" />
            <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">{title}</h3>
        </div>
        <div className="p-5 space-y-3">{children}</div>
    </div>
);

// ======================
// Info Row Component
// ======================
const InfoRow = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: any }) => (
    <div className="flex items-start justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500">
            {Icon && <Icon className="w-4 h-4" />}
            <span>{label}</span>
        </div>
        <div className="font-medium text-gray-800">{value}</div>
    </div>
);

// ======================
// Main Component
// ======================
export default function OrderDetailsPage() {
    const t = useTranslations();
    const format = useFormatter();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    const { selectedOrder, selectedLoading, productLoading } = useAppSelector((state) => state.order);
    const { data } = useAppSelector((s) => s.currency)
    const { currency } = useAppSelector((s) => s.currencyValue)
    
    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderById(Number(orderId)));
        }
    }, [dispatch, orderId]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return format.dateTime(date, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatPrice = (price: number) => {
        return (
            <span>
                {(price * (data?.[currency || "USD"] ?? 1)).toFixed(2)}
                <span className="text-sm">{t("EGP")}</span>
            </span>
        );
    };

    if (selectedLoading) {
        return (
            <div className="container max-w-5xl mx-auto px-4 py-8 mt-10">
                <OrderDetailsSkeleton />
            </div>
        );
    }

    if (!selectedOrder) {
        return (
            <div className="container max-w-5xl mx-auto px-4 py-8 mt-10">
                <NoData />
            </div>
        );
    }

    const order = selectedOrder;

    const handleChangeStatus = (orderProductId: number) => {
        console.log(orderProductId);
    };

    const userCookie = getCookie("user") as string | undefined;
    const user = userCookie ? JSON.parse(userCookie) : [];

    return (
        <div className="mx-4 md:mx-6 lg:mx-8  py-8 mt-5 mb-20">
            {/* Order Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-semibold text-gray-800">{t("orderDetails")}</h1>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-mono">
                        #{order.id}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <StatusWithMenu orderId={order.id} status={order.status} />
                </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Right column - 1/3 width */}
                <div className="space-y-6">
                    {/* Customer info */}
                    <InfoCard title={t("customer")} icon={User}>
                        <InfoRow label={t("name")} value={order.user?.fullName} icon={User} />
                        <InfoRow label={t("phone")} value={order.user?.phoneNumber} icon={Phone} />
                        <InfoRow label={t("email")} value={order.user?.email || "—"} icon={Mail} />
                    </InfoCard>

                    {/* Delivery address */}
                    <InfoCard title={t("deliveryAddress")} icon={MapPin}>
                        <InfoRow label={t("country")} value={order.deliveryAddress?.country} icon={Home} />
                        <InfoRow label={t("governorate")} value={order.deliveryAddress?.governorate} />
                        <InfoRow label={t("city")} value={order.deliveryAddress?.city} />
                        <InfoRow label={t("street")} value={order.deliveryAddress?.houseNumberAndStreet} />
                        <InfoRow label={t("phone")} value={order.deliveryAddress?.phoneNumber} icon={Phone} />
                    </InfoCard>

                    {/* Payment summary */}
                    <InfoCard title={t("payment")} icon={CreditCard}>
                        <InfoRow label={t("subtotal")} value={formatPrice(order.mainPrice)} />
                        {order.discount && (
                            <InfoRow label={t("discount")} value={`-${formatPrice(order.discount)}`} icon={Tag} />
                        )}
                        <InfoRow
                            label={t("delivery")}
                            value={order.hasDelivery ? formatPrice(order.deliveryPrice ?? 0) : t("free")}
                            icon={Truck}
                        />
                        <div className="pt-3 mt-2 border-t border-gray-100">
                            <div className="flex items-center justify-between font-semibold">
                                <span className="text-gray-700">{t("total")}</span>
                                <span className="text-lg text-main">{formatPrice(order.totalPrice)}</span>
                            </div>
                        </div>
                    </InfoCard>

                </div>

                {/* Left column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Timeline */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-main" />
                            {t("orderTimeline")}
                        </h3>
                        <div className="space-y-1">
                            <TimelineStep
                                status={1}
                                currentStatus={order.status}
                                label={t("processing")}
                                icon={Clock}
                            />
                            {order.status === 3 ? (
                                <TimelineStep
                                    status={2}
                                    currentStatus={order.status}
                                    label={t("canceled")}
                                    icon={XCircle}
                                    isLast
                                />
                            ) : (
                                <TimelineStep
                                    status={3}
                                    currentStatus={order.status}
                                    label={t("delivered")}
                                    icon={CheckCircle}
                                    isLast
                                />
                            )}
                        </div>
                    </div>

                    {/* Products */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-main" />
                                <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">{t("items")}</h3>
                            </div>
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                {order.orderProducts.length} {t("products")}
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.orderProducts.map((item) => (
                                <div key={item.id} className="p-5 flex gap-4 hover:bg-gray-50/50 transition-colors">
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                        <Image
                                            src={item.product.mainImage || "/placeholder.png"}
                                            alt={item.product.name}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center w-full">
                                            {/* Product Name */}
                                            <h4 className="font-medium text-gray-800 truncate">{item.product.name}</h4>
                                        </div>
                                        {item.product.brand?.name && (
                                            <p className="text-xs text-gray-400 mt-0.5">{item.product.brand.name}</p>
                                        )}
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm text-gray-500">
                                                {t("quantity")}: {item.quantity}
                                            </span>
                                            <span className="font-medium text-gray-900">{formatPrice(item.price)}</span>
                                        </div>


                                        {/* Additional Data */}
                                        {item.additionalDataSelections?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {item.additionalDataSelections.map((selection) => (
                                                    <div
                                                        key={selection.productAdditionalDataId}
                                                        className="flex items-center gap-1 text-sm text-gray-600"
                                                    >
                                                        {
                                                            selection.selectedValue.startsWith("#") ? (
                                                                <span
                                                                    className="w-4 h-4 rounded-full border border-gray-300"
                                                                    style={{ backgroundColor: selection.selectedValue || 'transparent' }}
                                                                    aria-label={`Color: ${selection.selectedValue}`}
                                                                />
                                                            )
                                                                : (
                                                                    <span className="truncate">{selection.selectedValue}</span>
                                                                )
                                                        }
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Estimated delivery / footer note */}
            {order.deliveryDate && order.status !== 3 && (
                <div className="mt-8 flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-800">
                    <Truck className="w-5 h-5 text-main" />
                    <div>
                        <p className="font-medium">{t("estimatedDelivery")}</p>
                        <p className="text-sm">{formatDate(order.deliveryDate)}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
