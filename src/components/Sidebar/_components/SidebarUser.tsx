"use client";

import { useLogout } from "@/hooks/useLogout";
import { useTranslations } from "next-intl";
import { FiLogOut, FiUser } from "react-icons/fi";
import { getCookie } from "cookies-next";
import { User } from "@/utils/dtos";
import { useMemo } from "react";

export default function SidebarUser({
  onChangeLanguage,
}: {
  onChangeLanguage: (lang: "ar" | "en" | "zh") => void;
}) {
  const t = useTranslations();
  const logout = useLogout();

  const user: User | null = useMemo(() => {
    const cookie = getCookie("user");

    if (!cookie || typeof cookie !== "string") return null;

    try {
      return JSON.parse(cookie);
    } catch {
      return null;
    }
  }, []);


  return (
    <div className="p-4 border-t border-gray-700 mt-4">
      {/* User Info */}
      <div className="flex items-center space-x-3 rtl:space-x-reverse gap-2">
        <div className="w-10 h-10 rounded-full bg-main flex items-center justify-center">
          <FiUser className="text-white" />
        </div>
        <h3 className="font-semibold text-gray-200">
          {user?.fullName ?? "User"}
        </h3>
      </div>

      <div className="mt-4 space-y-3">
        {/* Language Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => onChangeLanguage("ar")}
            className="flex-1 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition"
          >
            العربية
          </button>
          <button
            onClick={() => onChangeLanguage("en")}
            className="flex-1 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition"
          >
            English
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full py-3 rounded-xl flex items-center justify-center gap-2 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition"
        >
          <FiLogOut />
          {t("Logout")}
        </button>
      </div>
    </div>
  );
}