"use client";

import { CheckCircle, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import { useAppSelector } from "@/rtk/hooks";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function AddToCartPopup({ open, onClose }: Props) {
    const router = useRouter();
    const t = useTranslations();
    const popupRef = useRef<HTMLDivElement>(null);

    const tenantId = useAppSelector((s) => s.settings.data?.id);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div
                ref={popupRef}
                className="bg-white w-[90%] max-w-md rounded-xl shadow-xl p-6 text-center"
            >
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("addedToCart")}
                </h3>

                <p className="text-gray-500 mb-6">
                    {t("whatNext")}
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push(`/${tenantId}/cart`)}
                        className="w-full py-3 rounded-lg bg-main text-white font-medium hover:bg-(--main-color) transition flex items-center justify-center gap-2"
                    >
                        <ShoppingBag size={18} />
                        {t("goToCart")}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                        {t("continueShopping")}
                    </button>
                </div>
            </div>
        </div>
    );
}