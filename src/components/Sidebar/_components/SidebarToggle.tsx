"use client";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { setTrue } from "@/rtk/slices/openMenu";
import { Menu } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/safeImage/SafeImage";

export default function SidebarToggle() {
  const dispatch = useAppDispatch();
      const { data, loading } = useAppSelector((s) => s.settings)

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
      <Link href={`/${useAppSelector((s) => s.settings.data?.id)}`}>
        {
          loading ? (
            <div className="w-52 h-20 bg-gray-700 animate-pulse rounded"></div>
          ) : data?.logoDark
            ? (
              <SafeImage
                src={data?.logoDark}
                alt="Mongiz"
                width={100}
                height={40}
                className="object-contain h-8 w-auto"
              />
            ) : (
              (
                <div className="w-10 h-5 relative">
                </div>
              )
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
