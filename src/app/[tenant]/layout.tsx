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
  // 🔥 LOADING SKELETON STATE
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col animate-pulse bg-gray-50">

        {/* Navbar Skeleton */}
        <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="flex gap-3">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Page Content Skeleton */}
        <div className="flex-1 p-6 space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>

          <div className="h-40 bg-gray-200 rounded-xl mt-6"></div>
        </div>

        {/* Footer Skeleton */}
        <div className="h-14 bg-white border-t border-gray-100 px-6 flex items-center justify-between">
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>

      </div>
    );
  }

  // ❌ ERROR STATE
  if (notFound) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 9.172a4 4 0 015.656 0M9 15h6"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            لا يمكن العثور على المتجر
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            يبدو أن الرابط غير صحيح أو أن هذا المتجر لم يعد متاحًا.
          </p>

        </div>
      </div>
    );
  }

  // ✅ SUCCESS
  return <div>{children}</div>;
}