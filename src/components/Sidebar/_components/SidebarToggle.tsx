"use client";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { setTrue } from "@/rtk/slices/openMenu";
import { Menu } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/safeImage/SafeImage";

export default function SidebarToggle() {
  const dispatch = useAppDispatch();
  const { logo, loading } = useAppSelector((s) => s.logo)

  return (
    <div
      className="
        lg:hidden fixed top-0
        flex items-center justify-between
        w-full px-4 py-3
        bg-white/80 backdrop-blur
        border-b border-gray-100
        z-50 bg-dark
      "
    >
      {/* Title */}
      <Link href={"/"}>
        {
          loading ? (
            <div className="w-52 h-20 bg-gray-700 animate-pulse rounded"></div>
          ) : (
            <SafeImage
              src={logo?.logoDarkMode || "/default-logo.png"}
              alt="Mongiz"
              width={100}
              height={40}
              className="object-contain h-8 w-auto"
            />
          )
        }
      </Link>

      {/* Button */}
      <button
        onClick={() => dispatch(setTrue())}
        className="p-0 rounded-lg hover:bg-white/10 transition cursor-pointer"
      >
        <Menu size={22} className="text-white" />
      </button>
    </div>
  );
}
