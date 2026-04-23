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
    AlertCircle
} from "lucide-react";
import Image from "next/image";

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                {t("tenants") || "Tenants"}
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {t("Manage your organization tenants")}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/add-tenant")}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-2.5 rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="font-medium">{t("addTenant") || "Add Tenant"}</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">{t("loading") || "Loading tenants..."}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && list.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                            <Building2 className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {t("noTenants") || "No tenants found"}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {t("getStarted") || "Get started by creating your first tenant"}
                        </p>
                        <button
                            onClick={() => router.push("/add-tenant")}
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{t("addFirstTenant") || "Add First Tenant"}</span>
                        </button>
                    </div>
                )}

                {/* Table */}
                {!loading && list.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {t("name") || "Name"}
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {t("logoDark")}
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {t("logoLight")}
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {t("primaryColor") || "Primary Color"}
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {t("secondaryColor") || "Secondary Color"}
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {t("actions") || "Actions"}
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {list.map((tenant, index) => (
                                        <tr
                                            key={tenant.id}
                                            className="hover:bg-gray-50 transition-colors duration-150 group text-center"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                #{index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 justify-center">
                                                    {tenant.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center">
                                                    <Image
                                                        src={tenant.logoDark || "/default-logo.png"}
                                                        alt="Dark Logo"
                                                        width={40}
                                                        height={40}
                                                        className="rounded-md object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center">
                                                    <Image
                                                        src={tenant.logoLight || "/default-logo.png"}
                                                        alt="Light Logo"
                                                        width={40}
                                                        height={40}
                                                        className="rounded-md object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <div
                                                        className="w-6 h-6 rounded-lg shadow-sm border border-gray-200"
                                                        style={{ backgroundColor: tenant.primaryColor }}
                                                    />
                                                    <span className="text-sm text-gray-700 font-mono">
                                                        {tenant.primaryColor}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <div
                                                        className="w-6 h-6 rounded-lg shadow-sm border border-gray-200"
                                                        style={{ backgroundColor: tenant.secondaryColor }}
                                                    />
                                                    <span className="text-sm text-gray-700 font-mono">
                                                        {tenant.secondaryColor}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(tenant.id, tenant.name)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 group/btn"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}