"use client";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { deleteTenant, fetchTenants } from "@/rtk/slices/setting/settingSlice";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
    Trash2,
    Plus,
    Building2,
    Palette,
    Loader2,
    AlertCircle,
    Link2,
    Hash,
    Sun,
    Moon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
    const t = useTranslations();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { list, loading } = useAppSelector((s) => s.settings);

    useEffect(() => {
        dispatch(fetchTenants());
    }, [dispatch]);

    const handleDelete = async (id: number, name: string) => {
        toast.custom((toastId) => (
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-[400px] animate-in fade-in zoom-in duration-200">
                <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {t("deleteConfirmTitle") || "Delete Tenant"}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {t("deleteConfirmTenant") || `Are you sure you want to delete "${name}"? This action cannot be undone.`}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                        onClick={() => toast.dismiss(toastId)}
                    >
                        {t("Cancel") || "Cancel"}
                    </button>

                    <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={async () => {
                            toast.dismiss(toastId);
                            try {
                                await dispatch(deleteTenant(Number(id))).unwrap();
                                toast.success(t("Tenant deleted successfully") || "Tenant deleted successfully", {
                                    icon: "✅",
                                    duration: 3000,
                                });
                            } catch (e) {
                                toast.error(typeof e === "string" ? e : t("Failed to delete tenant") || "Failed to delete tenant", {
                                    icon: "❌",
                                    duration: 4000,
                                });
                            }
                        }}
                    >
                        {t("Delete") || "Delete"}
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: "top-center",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                {t("tenants") || "Tenants"}
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                {t("Manage your organization tenants")}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/add-tenant")}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 sm:px-5 py-2.5 rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="font-medium text-sm sm:text-base">{t("addTenant") || "Add Tenant"}</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">{t("loading") || "Loading tenants..."}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && list.length === 0 && (
                    <div className="text-center py-12 sm:py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                            <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                            {t("noTenants") || "No tenants found"}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500 mb-6">
                            {t("getStarted") || "Get started by creating your first tenant"}
                        </p>
                        <button
                            onClick={() => router.push("/add-tenant")}
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 sm:px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{t("addFirstTenant") || "Add First Tenant"}</span>
                        </button>
                    </div>
                )}

                {/* Cards Grid - Mobile Responsive */}
                {!loading && list.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {list.map((tenant) => (
                            <div
                                key={tenant.id}
                                className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                {/* Card Header with Tenant ID */}
                                <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-gray-100 rounded-lg flex items-center">
                                                <Hash className="w-3.5 h-3.5 text-gray-500" />
                                                {tenant.id}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(tenant.id, tenant.name)}
                                            className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4 sm:p-5 space-y-4">
                                    {/* Tenant Name */}
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                            {tenant.name}
                                        </h3>
                                    </div>

                                    {/* Logos */}
                                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                        <div className="flex-1 text-center">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <Moon className="w-3.5 h-3.5 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-600">Dark Logo</span>
                                            </div>
                                            <div className="flex justify-center">
                                                <Image
                                                    src={tenant.logoDark || "/default-logo.png"}
                                                    alt="Dark Logo"
                                                    width={48}
                                                    height={48}
                                                    className="rounded-lg object-cover border border-gray-200"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-px h-12 bg-gray-200"></div>
                                        <div className="flex-1 text-center">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <Sun className="w-3.5 h-3.5 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-600">Light Logo</span>
                                            </div>
                                            <div className="flex justify-center">
                                                <Image
                                                    src={tenant.logoLight || "/default-logo.png"}
                                                    alt="Light Logo"
                                                    width={48}
                                                    height={48}
                                                    className="rounded-lg object-cover border border-gray-200"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Colors */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Palette className="w-3.5 h-3.5 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-600">Primary</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-gray-700">
                                                    {tenant.primaryColor}
                                                </span>
                                                <div
                                                    className="w-6 h-6 rounded-lg shadow-sm border border-gray-200"
                                                    style={{ backgroundColor: tenant.primaryColor }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Palette className="w-3.5 h-3.5 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-600">Secondary</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-gray-700">
                                                    {tenant.secondaryColor}
                                                </span>
                                                <div
                                                    className="w-6 h-6 rounded-lg shadow-sm border border-gray-200"
                                                    style={{ backgroundColor: tenant.secondaryColor }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Link */}
                                    <div className="pt-2">
                                        <Link
                                            href={`/${tenant.id}`}
                                            className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 group/link"
                                        >
                                            <Link2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                            <span className="text-xs text-blue-700 truncate flex-1">
                                                https://single-mongiz.vercel.app/{tenant.id}
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}