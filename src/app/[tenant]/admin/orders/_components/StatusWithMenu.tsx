"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { updateOrderStatus } from "@/rtk/slices/orders/ordersSlice";

type Props = {
    orderId: number;
    status: number;
};

export default function StatusWithMenu({ orderId, status }: Props) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    // close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const statusConfig = {
        1: {
            label: t("processing"),
            icon: Clock,
            color: "text-amber-600 bg-amber-50 border-amber-200",
        },
        2: {
            label: t("completed"),
            icon: CheckCircle,
            color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        },
        3: {
            label: t("canceled"),
            icon: XCircle,
            color: "text-rose-600 bg-rose-50 border-rose-200",
        },
    };

    const config =
        statusConfig[status as keyof typeof statusConfig] || {
            label: t("unknown"),
            icon: Package,
            color: "text-gray-600 bg-gray-50 border-gray-200",
        };

    const Icon = config.icon;

    const handleChangeStatus = async (newStatus: number) => {
        if (newStatus === status) {
            setOpen(false);
            return;
        }

        setLoading(true);
        try {
            await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
        } catch (err) {
            console.error("Failed to update status", err);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <div className="relative inline-block" ref={menuRef}>
            {/* Badge */}
            <span
                onClick={() => !loading && setOpen(!open)}
                className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color} ${loading ? "opacity-70 pointer-events-none" : ""
                    }`}
            >
                {loading ? (
                    <span className="w-3.5 h-3.5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin" />
                ) : (
                    <Icon className="w-3.5 h-3.5" />
                )}
                {config.label}
            </span>

            {/* Dropdown */}
            {open && !loading && (
                <div className="absolute mt-2 w-40 bg-white rounded-lg shadow-lg z-50">
                    <button
                        onClick={() => handleChangeStatus(1)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-amber-50 transition"
                    >
                        <Clock className="w-4 h-4 text-amber-500" />
                        {t("processing")}
                    </button>

                    <button
                        onClick={() => handleChangeStatus(2)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-emerald-50 transition"
                    >
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        {t("completed")}
                    </button>

                    <button
                        onClick={() => handleChangeStatus(3)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-rose-50 transition"
                    >
                        <XCircle className="w-4 h-4 text-rose-500" />
                        {t("canceled")}
                    </button>
                </div>
            )}
        </div>
    );
}