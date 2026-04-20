"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useAppSelector } from "@/rtk/hooks";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();
  const { data, loading: logoLoading } = useAppSelector((s) => s.settings)

  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ read params
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    setEmail(emailParam || "");
    setToken(tokenParam || "");
  }, [searchParams]);

  // ✅ send to backend
  const handleRecover = async () => {
    if (!email || !token) {
      toast("Invalid data");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${base}/api/Account/recover-account`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar",
        },
        body: JSON.stringify({
          email,
          token,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast(data?.message || "تم إستعادة الحساب بنجاح");

        setTimeout(() => {
          router.push(`/${useAppSelector((s) => s.settings.data?.id)}/login`);
        }, 2000);
      } else {
        toast(data?.message || "Something went wrong");
      }
    } catch (err) {
      toast("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-2xl px-8 py-10 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Logo */}
        <Link href={`/${useAppSelector((s) => s.settings.data?.id)}`} className="flex justify-center mb-6">
          {
            logoLoading ? (
              <div className="w-52 h-20 bg-gray-700 animate-pulse rounded"></div>
            ) : (
              <Image
                src={data?.logoDark || "/default-logo.png"}
                alt="Mongiz"
                width={220}
                height={220}
              />
            )
          }
        </Link>

        {/* Title */}
        <h1 className="text-xl font-semibold text-center mb-2">
          {t("Recover Your Account")}
        </h1>

        <p className="text-sm text-center text-white/70 mb-4 leading-relaxed">
          {t("We received a request to recover your account")}
        </p>

        {/* Email preview */}
        {email && (
          <div className="text-center text-sm text-main mb-6 break-all">
            {atob(email)}
          </div>
        )}

        <p className="text-xs text-center text-white/60 mb-7 leading-relaxed">
          {t("Click the button below to confirm and restore your account access If you didn’t request this, you can safely ignore this page")}
        </p>

        {/* Button */}
        <button
          onClick={handleRecover}
          disabled={loading}
          className="w-full py-3 bg-main hover:bg-(--main-color) transition rounded-lg font-medium"
        >
          {loading ? t("Processing") : t("Recover Account")}
        </button>

        {/* Extra help */}
        <p className="text-center text-xs text-white/50 mt-6">
          {t("Need help?")}{" "}
          <Link href={`/${useAppSelector((s) => s.settings.data?.id)}/contact`} className="text-(--main-color) hover:underline">
            {t("Contact support")}
          </Link>
        </p>
      </div>
    </div>
  );
}