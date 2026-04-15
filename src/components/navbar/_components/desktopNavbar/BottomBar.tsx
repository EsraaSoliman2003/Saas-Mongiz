"use client";

import { Menu, Car, User, bottomArrow } from "@/assets";
import Image from "next/image";
import CategoriesMegaMenu from "./CategoriesMegaMenu";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useLogout";

type Props = {};

export default function BottomBar({ }: Props) {
  const t = useTranslations();
  const { token, role } = useAuth();
  const rolesArray = role ? JSON.parse(role) : [];


  const logOut = useLogout();
  return (
    <div className="w-full border-t shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] font-bold bg-white relative z-40">
      <div className="container mx-auto flex items-center justify-between text-sm text-dark">
        {/* Right side */}
        <div className="flex items-center gap-8">
          {/* Categories */}
          <div className="relative">
            <div className="flex items-center gap-2 cursor-pointer px-2 rounded-lg transition-all duration-300 group-hover:text-(--main-color)">
              <CategoriesMegaMenu />
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {/* Links */}
          <Link href={"/"}>
            <span className="cursor-pointer py-1 px-2 rounded-lg transition-all duration-300 hover:text-(--main-color) active:scale-95">
              {t("Home")}
            </span>
          </Link>

          <div className="relative group">
            <Link href={"/products"} className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-lg transition-all duration-300 group-hover:text-(--main-color)">
              <span>{t("NewProducts")}</span>
              <span className="bg-linear-to-r from-(--main-color) to-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                {t("Hot")}
              </span>
            </Link>
          </div>
        </div>

        {/* Left side */}
        <div className="flex items-center gap-0 lg:gap-6">
          {/* Login/Signup */}
          {token ? (
            <div className="relative group">
              {/* Trigger */}
              <div className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-lg transition-all duration-300 group-hover:text-(--main-color)">
                <div className="relative w-5 h-5">
                  <Image
                    src={User}
                    alt="user"
                    fill
                    className="object-contain mt-1 transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute w-5 h-6 bg-main/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span>{t("myAccount")}</span>
              </div>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="flex flex-col text-sm text-gray-700">
                  <Link href="/profile" className="px-4 py-2 hover:bg-gray-100">
                    {t("Profile")}
                  </Link>
                  {
                    rolesArray.includes("SELLER") && (
                      <Link href="/seller" className="px-4 py-2 hover:bg-gray-100">
                        {t("dashboard")}
                      </Link>
                    )
                  }
                  {
                    rolesArray.includes("ADMIN") && (
                      <Link href="/admin" className="px-4 py-2 hover:bg-gray-100">
                        {t("dashboard")}
                      </Link>
                    )
                  }
                  <Link href="/account-settings" className="px-4 py-2 hover:bg-gray-100">
                    {t("accountSettings")}
                  </Link>
                  <Link href="/orders" className="px-4 py-2 hover:bg-gray-100">
                    {t("orders")}
                  </Link>
                  <Link href="/addresses" className="px-4 py-2 hover:bg-gray-100">
                    {t("addresses")}
                  </Link>
                  <Link href="/favourite" className="px-4 py-2 hover:bg-gray-100">
                    {t("favorites")}
                  </Link>
                  <Link href="/support" className="px-4 py-2 hover:bg-gray-100">
                    {t("support")}
                  </Link>
                  <button
                    onClick={logOut}
                    className="px-4 py-2 mt-2 pt-2 border-t border-gray-200 font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {t("Logout")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <Link href={"/login"}>
                <div className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-lg transition-all duration-300 group-hover:text-(--main-color)">
                  <div className="relative w-5 h-5">
                    <Image
                      src={User}
                      alt="user"
                      fill
                      className="object-contain mt-1 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-main/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <span>{t("LoginRegister")}</span>
                </div>
              </Link>
            </div>
          )}

          {/* Track Order */}
          <div className="relative group">
            <Link href={token ? "/orders" : "/login"}>
              <div className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-lg transition-all duration-300 group-hover:text-(--main-color)">
                <div className="relative w-5 h-5">
                  <Image
                    src={Car}
                    alt="car"
                    fill
                    className="object-contain mt-1 transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span>{t("TrackOrder")}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}