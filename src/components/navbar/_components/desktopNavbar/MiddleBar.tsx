"use client";

import { cart, favorite } from "@/assets";
import Image from "next/image";
import Link from "next/link";
import Language from "@/components/Language/Language";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import SearchSection from "./SearchSection";
import Currency from "./Currency";
import { useAppSelector } from "@/rtk/hooks";
import CategoriesDrawer from "./CategoriesMegaMenu";
import { Heart, ShoppingCart } from "lucide-react";
import UserMenu from "./UserMenu";
import EmailStatusButton from "./EmailStatusButton";

const MiddleBar = ({ locale }: { locale: string }) => {
  const { token } = useAuth();
  const { items } = useCart();
  const { logo, loading } = useAppSelector((s) => s.logo)

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      {/* Logo */}
      <Link href={"/"} className="flex items-center shrink-0">
        {loading ? (
          <div className="w-44 h-12 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <div className="relative w-44 h-12">
            <Image
              src={logo?.logoLightMode || "/default-logo.png"}
              alt="Mongiz"
              fill
              sizes="(max-width: 768px) 120px, 176px"
              priority
              className="object-contain"
            />
          </div>
        )}
      </Link>

      {/* Categories Drawer */}
      <div className="shrink-0">
        <CategoriesDrawer />
      </div>

      {/* Search Section - Takes remaining space */}
      <div className="flex-1 max-w-2xl">
        <SearchSection />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-5 shrink-0">
        <Language locale={locale} />

        {/* Cart */}
        <Link
          href={"/cart"}
          className="relative cursor-pointer hover:opacity-80 transition text-gray-600 hover:text-(--main-color)"
        >
          <ShoppingCart size={22} />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-(--main-color) text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold shadow-sm">
              {items.length}
            </span>
          )}
        </Link>

        <UserMenu />
        
        <EmailStatusButton />
      </div>
    </div>
  );
};

export default MiddleBar;