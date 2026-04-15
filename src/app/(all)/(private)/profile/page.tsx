"use client"
import React from 'react'
import Link from 'next/link'
import { User, Settings, Gift, Heart, MapPin, LifeBuoy } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getCookie, setCookie } from 'cookies-next'

type Props = {}

export default function page({ }: Props) {
  const t = useTranslations();

  let userObj = null;

  let userCookie = getCookie("user");

  if (userCookie) {
    try {
      userObj = JSON.parse(userCookie as string);
    } catch (err) {
      console.error("Failed to parse user cookie:", err);
    }
  }

  console.log(userObj);

  return (
    <div className="container mt-10 mb-20">
      <h2 className="text-xl font-semibold mb-6">{t("myAccount")}</h2>

      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {/* Profile Card */}
        <Link
          href="/profile"
          className="flex items-center justify-center gap-2 p-6 rounded-xl bg-main text-white font-medium hover:shadow-md transition min-h-[116px]"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={userObj.imageUrl || "/default-logo.png"}
              alt="Profile"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <span>{userObj.fullName}</span>
        </Link>

        {/* Account Settings */}
        <Link href="/account-settings" className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium min-h-[116px]">
          <Settings className="w-5 h-5" />
          <span>{t("accountSettings")}</span>
        </Link>

        {/* Orders */}
        <Link href="/orders" className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium min-h-[116px]">
          <Gift className="w-5 h-5" />
          <span>{t("orders")}</span>
        </Link>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Addresses */}
        <Link href="/addresses" className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium min-h-[116px]">
          <MapPin className="w-5 h-5" />
          <span>{t("addresses")}</span>
        </Link>

        {/* Favorites */}
        <Link href="/favourite" className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium min-h-[116px]">
          <Heart className="w-5 h-5" />
          <span>{t("favorites")}</span>
        </Link>

        {/* Customer Support */}
        <Link href="/support" className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium min-h-[116px]">
          <LifeBuoy className="w-5 h-5" />
          <span>{t("support")}</span>
        </Link>
      </div>
    </div>
  )
}
