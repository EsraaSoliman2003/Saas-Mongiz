"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { deleteAccount } from "@/rtk/slices/profile/profileSlice";
import { toast } from "sonner";
import { X, Trash2, Eye, EyeOff } from "lucide-react";
import useClickOutside from "@/hooks/useClickOutside";
import MainButton from "@/components/MainButton/MainButton";
import { useLogout } from "@/hooks/useLogout";

export default function DeleteAccount() {
    const t = useTranslations();
    const dispatch = useAppDispatch();
    const { deleteAccountLoading } = useAppSelector((s) => s.profile);
    const logOut = useLogout();

    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const ref = useRef<HTMLDivElement>(null);

    useClickOutside({
        ref,
        handler: () => setOpen(false),
    });

    const handleDelete = async () => {
        setError("");

        if (!password) {
            setError(t("passwordRequired") || "Password is required");
            return;
        }

        try {
            await dispatch(deleteAccount({ password })).unwrap();

            toast.success(t("accountDeleted") || "Account deleted");
            logOut();
        } catch (err) {
            console.log(err);
            setError(t("wrongPassword") || "Wrong password");
        }
    };

    const isRtl = t("dir") === "rtl";
    const inputPadding = isRtl ? "pl-10" : "pr-10";
    const iconPos = isRtl ? "left-0" : "right-0";

    return (
        <>
            {/* Trigger */}
            <div className="pt-8 space-y-3 text-right">
                <p className="text-red-500 text-sm font-medium">
                    {t("dangerZone") || "Danger Zone"}
                </p>

                <div
                    onClick={() => setOpen(true)}
                    className="flex items-center justify-between bg-red-50 p-4 rounded-xl cursor-pointer hover:bg-red-100 transition"
                >
                    <span className="text-red-600 font-medium">
                        {t("deleteAccount")}
                    </span>
                    <Trash2 className="w-5 h-5 text-red-500" />
                </div>
            </div>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div
                        ref={ref}
                        className="bg-white rounded-xl p-6 w-full max-w-md relative m-4"
                    >
                        <button
                            onClick={() => setOpen(false)}
                            className={`absolute top-4 ${isRtl ? "left-4" : "right-4"}`}
                        >
                            <X />
                        </button>

                        <h2 className="text-lg font-semibold mb-4 text-red-600">
                            {t("confirmDeleteAccount") || "Delete Account"}
                        </h2>

                        <p className="text-gray-500 text-sm mb-4">
                            {t("deleteWarning") ||
                                "This action is permanent. Enter your password to confirm."}
                        </p>

                        {/* Password */}
                        <div className="relative mb-3">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={t("password")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`border border-gray-100 p-2 rounded-lg w-full ${inputPadding}`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute inset-y-0 ${iconPos} px-3 flex items-center`}
                            >
                                {showPassword
                                    ? <EyeOff className="w-5 h-5 text-gray-500" />
                                    : <Eye className="w-5 h-5 text-gray-500" />
                                }
                            </button>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mb-3">{error}</p>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 text-gray-600"
                            >
                                {t("cancel")}
                            </button>

                            <MainButton
                                text={t("delete")}
                                onClick={handleDelete}
                                disabled={deleteAccountLoading}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}