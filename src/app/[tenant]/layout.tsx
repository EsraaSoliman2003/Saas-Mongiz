"use client";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchSettings } from "@/rtk/slices/setting/settingSlice";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function applyThemeColors(primary: string, secondary: string) {
  document.documentElement.style.setProperty("--main-color", primary);
  document.documentElement.style.setProperty("--dark-color", secondary);
}

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((s) => s.settings);

  const [notFound, setNotFound] = useState(false);
  const [ready, setReady] = useState(false);

  const firstSegment = pathname.split("/").filter(Boolean)[0];

  useEffect(() => {
    if (!firstSegment) return;

    const load = async () => {
      try {
        const res = await dispatch(
          fetchSettings(Number(firstSegment))
        ).unwrap();

        applyThemeColors(res.primaryColor, res.secondaryColor);

        setReady(true);
      } catch {
        setNotFound(true);
      }
    };

    load();
  }, [dispatch, firstSegment]);

  // 🔥 LOADING STATE
  if (loading || !ready) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  // ❌ ERROR STATE
  if (notFound) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-xl">
        Tenant not found
      </div>
    );
  }

  // ✅ SUCCESS
  return <div>{children}</div>;
}