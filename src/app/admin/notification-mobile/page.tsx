"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import AdminSectionHeader from "@/components/adminSectionHeader/AdminSectionHeader";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import {
    createNotification,
    sendNotificationToUser,
} from "@/rtk/slices/notification-mobile/mobileNotificationSlice";

// Notification types
const NOTIFICATION_TYPES = [
    { label: "notification_type_success", value: 1 },
    { label: "notification_type_error", value: 2 },
    { label: "notification_type_warning", value: 3 },
    { label: "notification_type_info", value: 4 },
    { label: "notification_type_none", value: 5 },
];

// Priority options
const PRIORITY_OPTIONS = [
    { label: "Low", value: 1 },
    { label: "Medium", value: 2 },
    { label: "High", value: 3 },
    { label: "Very High", value: 4 },
    { label: "Critical", value: 5 },
    { label: "None", value: 6 },
];

export default function Page() {
    const t = useTranslations();
    const dispatch = useAppDispatch();

    const { createLoading, sendLoading } = useAppSelector(
        (state) => state.mobileNotification
    );

    const [form, setForm] = useState({
        typeSelection: "broadcast", // "broadcast" | "user"
        userId: "",
        title: "",
        body: "",
        notificationType: 1,
        priority: 1,
        sender: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payloadCommon = {
                title: form.title,
                body: form.body,
                type: Number(form.notificationType),
                priority: Number(form.priority),
                sender: form.sender || undefined,
            };
                console.log(payloadCommon)

            if (form.typeSelection === "broadcast") {
                await dispatch(createNotification(payloadCommon)).unwrap();
                toast.success(t("notification_added_success"));
            } else if (form.typeSelection === "user") {
                if (!form.userId) {
                    toast.error(t("notification_user_required"));
                    return;
                }

                await dispatch(
                    sendNotificationToUser({
                        userId: Number(form.userId),
                        ...payloadCommon,
                    })
                ).unwrap();
                toast.success(t("notification_sent_to_user"));
            }

            setForm({
                typeSelection: "broadcast",
                userId: "",
                title: "",
                body: "",
                notificationType: 1,
                priority: 1,
                sender: "",
            });
        } catch (err: any) {
            toast.error(err || t("notification_added_error"));
        }
    };

    return (
        <section className="p-4 lg:p-10 space-y-6">
            <AdminSectionHeader title={t("notification_title")} />

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 space-y-4"
            >
                <h2 className="font-semibold text-lg">{t("notification_form_title")}</h2>

                {/* Type Selector */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">{t("notification_type_selection")}</label>
                    <select
                        name="typeSelection"
                        value={form.typeSelection}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                    >
                        <option value="broadcast">{t("broadcast_to_all")}</option>
                        <option value="user">{t("send_to_user")}</option>
                    </select>
                </div>

                {/* User ID input (conditional) */}
                {form.typeSelection === "user" && (
                    <div className="space-y-1">
                        <label className="text-sm font-medium">{t("user_id")}</label>
                        <input
                            type="number"
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                            required
                        />
                    </div>
                )}

                {/* Title */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">{t("Title")}</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                        required
                    />
                </div>

                {/* Body */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">{t("notification_body")}</label>
                    <textarea
                        name="body"
                        value={form.body}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none resize-none"
                        required
                    />
                </div>

                {/* Notification Type */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">{t("notification_level")}</label>
                    <select
                        name="notificationType"
                        value={form.notificationType}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                    >
                        {NOTIFICATION_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {t(type.label.toLowerCase())}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Priority */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">{t("priority")}</label>
                    <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                    >
                        {PRIORITY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {t(option.label.toLowerCase())}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sender */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">{t("sender")}</label>
                    <input
                        type="text"
                        name="sender"
                        value={form.sender}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                        placeholder={t("optional")}
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={createLoading || sendLoading}
                        className="px-5 py-2 rounded-lg bg-dark text-white font-medium disabled:opacity-60"
                    >
                        {(createLoading || sendLoading)
                            ? t("notification_saving")
                            : t("notification_submit")}
                    </button>
                </div>
            </form>
        </section>
    );
}
