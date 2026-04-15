"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { getCookie } from "cookies-next";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    const rolesCookie = getCookie("roles") as string | undefined;
    const roles = rolesCookie ? JSON.parse(rolesCookie) : [];

    if (!roles.includes("ADMIN")) {
      router.replace("/");
      return;
    }

    setLoading(false);
  }, [token, router]);

  if (loading) {
    return (
      <main className="relative min-h-screen flex font-Expo">
        <div className="absolute inset-0 -z-10 bg-[#F6F8F8]" />
        <div className="flex w-full">
          {/* Sidebar Skeleton */}
          <div className="w-64 p-4 space-y-4 animate-pulse bg-gray-100">
            <div className="h-8 bg-gray-300 rounded" />
            <div className="h-8 bg-gray-300 rounded" />
            <div className="h-8 bg-gray-300 rounded" />
            <div className="h-8 bg-gray-300 rounded" />
          </div>
          {/* Content Skeleton */}
          <section className="flex-1 p-6 space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3 animate-pulse" />
            <div className="h-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-40 bg-gray-200 rounded animate-pulse" />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex font-Expo">
      <div className="absolute inset-0 -z-10 bg-[#F6F8F8]" />
      <Sidebar />
      <section className="relative grow z-10 mb-30 lg:mb-0">
        <div className="absolute w-full h-[242px] md:h-[349px] bg-cover bg-center z-[-20]" />
        <section className="mt-15 md:mt-13 lg:mt-0">{children}</section>
      </section>
    </main>
  );
}