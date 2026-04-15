"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { HiX } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { setFalse } from "@/rtk/slices/openMenu";
import Image from "next/image";

export default function SidebarHeader() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { logo, loading } = useAppSelector((s) => s.logo)

  return (
    <div className="flex flex-col items-center justify-center border-b border-gray-700 pb-4 mb-4 relative">
      {/* Close Button (visible only on mobile) */}
      <button
        onClick={() => dispatch(setFalse())}
        className="absolute top-0 right-0 lg:hidden text-gray-400 hover:text-white transition"
        aria-label="Close sidebar"
      >
        <HiX className="text-2xl" />
      </button>

      {/* Logo + Link to Home */}
      <Link
        href="/"
        onClick={() => dispatch(setFalse())}
        className="flex items-center justify-center"
      >
        {
          loading ? (
            <div className="w-52 h-20 bg-gray-700 animate-pulse rounded"></div>
          ) : (
            <Image
              src={logo?.logoDarkMode || "/default-logo.png"}
              alt="Mongiz"
              width={200}
              height={100}
              className="w-52 md:w-45 h-auto object-contain"
              priority
            />
          )
        }

      </Link>
    </div>
  );
}
