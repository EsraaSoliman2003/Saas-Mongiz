"use client"
import React, { useState } from 'react'
import { bottomArrow } from "@/assets";
import Image from 'next/image';
import MainButton from '@/components/MainButton/MainButton';
import Link from 'next/link';
import { useTranslations } from 'next-intl'
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';
import { useAppSelector } from '@/rtk/hooks';

type Props = {}

export default function Summary({ }: Props) {
    const t = useTranslations();
    const [openShipping, setOpenShipping] = useState(false)
    const [openPromo, setOpenPromo] = useState(false)
    const { itemsTotal } = useCart();
    const { token } = useAuth();
      const { data } = useAppSelector((s) => s.currency)
      const { currency } = useAppSelector((s) => s.currencyValue)

    return (
        <div className="border border-[#F5F7FA] rounded-xl h-fit space-y-2 py-6 mb-30">
            <h3 className="text-xl font-semibold mb-6 px-6">{t("YourCart")}</h3>

            {/* <div className="flex justify-between text-sm mb-4 px-6">
                <span className="text-gray-500">{t("Subtotal")}</span>
                <span>$1,574.88</span>
            </div> */}

            <div className="flex justify-between font-medium mb-6 px-6">
                <span>{t("Total")}</span>
                <span>
                    {(itemsTotal * (data?.[currency || "USD"] ?? 1)).toFixed(2)}
                    <span className="text-sm">{t("EGP")}</span>

                </span>
            </div>

            <div className='px-6'>
                <Link href={token ? "/payment" : "/login"}>
                    <MainButton text={t("ProceedToPayment")} className="w-full" disabled={itemsTotal === 0} />
                </Link>
            </div>
        </div>
    )
}
