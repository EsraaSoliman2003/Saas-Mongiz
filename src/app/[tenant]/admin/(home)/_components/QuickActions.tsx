"use client";
import React from "react";
import { FiBox, FiUsers, FiShoppingCart } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { BsLightningChargeFill } from "react-icons/bs";
import { SiWhatsapp } from "react-icons/si"; // WhatsApp icon
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useAppSelector } from "@/rtk/hooks";

type QuickActionCardProps = {
    icon: React.ReactNode;
    label: string;
    color?: string;
    href: string;
};

const QuickActionCard = ({ icon, label, color = "text-indigo-600", href }: QuickActionCardProps) => {
    return (
        <Link
            href={href}
            className="group flex flex-col items-center justify-center gap-3 bg-[#F8F8F8] rounded-xl p-5 hover:shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-indigo-100"
        >
            <div className={`w-14 h-14 flex items-center justify-center rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-300 ${color}`}>
                {icon}
            </div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                {label}
            </p>
        </Link>
    );
};

export default function QuickActions() {
    const t = useTranslations();

    return (
        <div className="bg-white rounded-2xl p-6 hidden lg:block">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <BsLightningChargeFill className="text-yellow-500 text-2xl animate-pulse" />
                    {t("quickActions")}
                </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* <QuickActionCard
                    icon={<FiBox size={22} />}
                    label={t("products")}
                    href={`/${useAppSelector((s) => s.settings.data?.id)}/seller/products`}
                /> */}

                <QuickActionCard
                    icon={<BiCategory size={22} />}
                    label={t("categories")}
                    href={`/${useAppSelector((s) => s.settings.data?.id)}/admin/categories`}
                />

                <QuickActionCard
                    icon={<FiUsers size={22} />}
                    label={t("customers")}
                    href={`/${useAppSelector((s) => s.settings.data?.id)}/admin/customers`}
                />

                <QuickActionCard
                    icon={<FiShoppingCart size={22} />}
                    label={t("orders")}
                    href={`/${useAppSelector((s) => s.settings.data?.id)}/admin/orders`}
                />

                <QuickActionCard
                    icon={<SiWhatsapp size={22} />}
                    label="whatsapp"
                    // color="text-green-500"
                    href="/whatsapp.html"
                />
            </div>
        </div>
    );
}