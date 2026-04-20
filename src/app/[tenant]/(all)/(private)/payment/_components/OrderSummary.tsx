"use client";

import MainButton from "@/components/MainButton/MainButton";
import { bottomArrow } from "@/assets";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/hooks/useCart";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { createOrder } from "@/rtk/slices/orders/ordersSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchCouponByCode } from "@/rtk/slices/coupon/couponSlice";
import { useAuth } from "@/context/AuthContext";

export default function OrderSummary() {
    const t = useTranslations();
    const router = useRouter();
    const { emailConfirmed } = useAuth();
    const { items, itemsTotal, totalPrice, coupon, setCouponCode, address, clear, setAddressInfo } = useCart();
    const { data } = useAppSelector((s) => s.currency)
    const { currency } = useAppSelector((s) => s.currencyValue)
    const { createLoading } = useAppSelector((s) => s.order)

    const dispatch = useAppDispatch();

    const [openPromo, setOpenPromo] = useState(false);
    const [promoInput, setPromoInput] = useState("");

    const shippingFee = items.length > 0 ? 10 : 0;

    const finalTotal = itemsTotal + shippingFee;

    const handleOrder = async () => {
        if (!emailConfirmed) {
            toast(t("confirm required"));
            return;
        }

        if (address?.id && items && items.length !== 0) {
            const formattedProducts = items.map((item) => ({
                productId: item.id,
                quantity: item.qty,
                typeId: item.selectedOptions.type?.id ?? null,
                additionalDataSelections: Object.values(item.selectedOptions)
                    .filter((opt): opt is { id: number; name: string } => !!opt)
                    .map((opt) => ({
                        productAdditionalDataId: Number(opt.id),
                        selectedValue: opt.name || "",
                    })),
            }));

            try {
                await dispatch(
                    createOrder({
                        deliveryAddressId: address.id,
                        couponCode: coupon,
                        orderProducts: formattedProducts,
                    })
                ).unwrap();
                router.push("/orders");
                clear();
                setAddressInfo(null);

            } catch (error) {
                toast(t("TryAgain"));
            }
        }
    };
    return (
        <div className="border border-gray-200 rounded-xl p-6 space-y-5 h-fit">
            <h2 className="text-xl font-bold">{t("YourOrder")}</h2>

            {/* ================= Products ================= */}
            {items.length === 0 ? (
                <p className="text-sm text-gray-400">{t("CartEmpty")}</p>
            ) : (
                items.map((item) => (
                    <div
                        key={`${item.id}-${item.selectedOptions.type?.id ?? 0}`}
                        className="flex gap-3"
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-lg"
                        />

                        <div className="flex-1 text-sm">
                            <p className="font-medium line-clamp-2">
                                {item.name}
                            </p>
                            <span className="text-gray-400">
                                {t("Quantity")}: {item.qty}
                            </span>
                        </div>

                        <span className="text-sm font-semibold">
                            {(item.price * item.qty * (data?.[currency || "USD"] ?? 1)).toFixed(2)}
                            <span className="text-sm">{t("EGP")}</span>
                        </span>
                    </div>
                ))
            )}

            {/* ================= Summary ================= */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2">
                    <span className="text-gray-500">{t("Subtotal")}</span>
                    <span>
                        {(itemsTotal * (data?.[currency || "USD"] ?? 1)).toFixed(2)}
                        <span className="text-sm">{t("EGP")}</span>
                    </span>
                </div>

                <div className="flex justify-between py-2">
                    <span className="text-gray-500">{t("ShippingFee")}</span>
                    <span>
                        {(shippingFee * (data?.[currency || "USD"] ?? 1)).toFixed(2)}
                        <span className="text-sm">{t("EGP")}</span>
                    </span>
                </div>
            </div>

            {/* ================= Promo Toggle ================= */}
            <button
                onClick={() => setOpenPromo(!openPromo)}
                className="w-full flex justify-between items-center text-sm"
            >
                <span className="text-gray-600 font-medium">
                    {t("ApplyPromoCode")}
                </span>

                <Image
                    src={bottomArrow}
                    alt="arrow"
                    width={12}
                    height={12}
                    className={`transition-transform duration-300 ${openPromo ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* ================= Promo Form ================= */}
            <div
                className={`overflow-hidden transition-all duration-300 ${openPromo ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="pt-3 space-y-3">
                    <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder={t("EnterPromoCode")}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm"
                    />

                    <MainButton
                        text={t("Apply")}
                        onClick={async () => {
                            if (promoInput.trim() === "") return;

                            try {
                                const resultAction = await dispatch(fetchCouponByCode(promoInput));
                                if (fetchCouponByCode.fulfilled.match(resultAction)) {
                                    setCouponCode(resultAction.payload.code);
                                    toast.success(`${t("CouponApplied")}: ${resultAction.payload.discount}%`);
                                } else {
                                }
                            } catch {
                                toast.error(t("TryAgain"));
                            }
                        }}
                        className="w-full"
                        disabled={promoInput.trim() === ""}
                    />
                </div>
            </div>

            {/* ================= Total ================= */}
            <div className="flex justify-between font-semibold border-y border-gray-200 py-4">
                <span>{t("Total")}</span>
                <span>
                    {(finalTotal * (data?.[currency || "USD"] ?? 1)).toFixed(2)}
                    <span className="text-sm">{t("EGP")}</span>
                </span>
            </div>

            {/* ================= Payment ================= */}
            <div className="space-y-2 text-sm">
                <p className="font-medium">{t("PaymentMethods")}</p>

                <label className="flex items-center gap-2">
                    <input type="radio" name="payment" defaultChecked />
                    {t("VisaMasterCard")}
                </label>

                <label className="flex items-center gap-2">
                    <input type="radio" name="payment" />
                    {t("ATMCard")}
                </label>
            </div>

            {/* ================= Submit ================= */}
            <MainButton
                text={t("PlaceOrder")}
                className="w-full"
                disabled={items.length === 0 || !address || createLoading}
                onClick={handleOrder}
            />
        </div>
    );
}