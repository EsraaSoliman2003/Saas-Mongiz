"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import MainButton from "@/components/MainButton/MainButton";
import { useAppSelector } from "@/rtk/hooks";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getCookie, setCookie } from "cookies-next";

export default function ConfirmEmailPage() {
  const t = useTranslations();
  const router = useRouter();
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  const { setEmailConfirmed } = useAuth();

  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const [loading, setLoading] = useState(false);

  const { data, loading: logoLoading } = useAppSelector((s) => s.settings);

  const base64Decode = (value: string) => {
    try {
      return atob(value);
    } catch {
      return value;
    }
  };

  // ✅ Read & decode params
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    setEmail(emailParam || "");
    setToken(tokenParam || "");
  }, [searchParams]);

  // ✅ Verify function
  const handleVerify = async (emailValue: any, tokenValue: any) => {
    if (!emailValue || !tokenValue) {
      toast(t("Invalid email or token"));
      return;
    }

    setLoading(true);
    try {

      const res = await fetch(
        `${base}/api/Account/ConfirmEmail?email=${encodeURIComponent(
          emailValue
        )}&token=${encodeURIComponent(tokenValue)}`,
        {
          method: "GET",
          headers: {
            "Accept-Language": "ar",
          },
        }
      );

      if (res.ok) {
        toast(t("Email verified successfully! 🎉"));

        // ✅ Update AuthContext
        setEmailConfirmed(true);

        // ✅ Update cookie
        let userCookie = getCookie("user");
        if (userCookie) {
          try {
            const userObj = JSON.parse(userCookie as string);
            userObj.emailConfirmed = true;
            setCookie("user", JSON.stringify(userObj), { path: `/${useAppSelector((s) => s.settings.data?.id)}` });
          } catch (err) {
            console.error("Failed to update user cookie:", err);
          }
        }

        setTimeout(() => {
          router.push(`/${useAppSelector((s) => s.settings.data?.id)}`);
        }, 3000);
      } else {
        const data = await res.json();
        toast(data?.title || t("Invalid email or token"));
      }
    } catch (err) {
      toast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-2xl px-8 py-10 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

        {/* Logo */}
        <Link href={`/${useAppSelector((s) => s.settings.data?.id)}`} className="flex justify-center mb-6">
          {logoLoading ? (
            <div className="w-52 h-20 bg-gray-700 animate-pulse rounded"></div>
          ) : (
            <Image
              src={data?.logoDark || "/default-logo.png"}
              alt="Logo"
              width={220}
              height={220}
            />
          )}
        </Link>

        {/* Title */}
        <h1 className="text-xl font-semibold text-center mb-2">
          {t("Confirm Your Email")}
        </h1>

        <div className="text-sm text-center text-white/70 mb-7 leading-relaxed">
          {email ? (
            <>
              <div>{base64Decode(email)}</div>
              <div>{t("Click the button below to verify your email")}.</div>
            </>
          ) : (
            t("No email provided")
          )}
        </div>

        {/* Button */}
        <MainButton
          onClick={() => handleVerify(email, token)}
          text={t("Verify Email")}
          loading={loading}
          className="w-full mb-6"
          disabled={loading}
        />

        {/* Login link */}
        <p className="text-center text-sm text-white/70 mt-6">
          {t("Already verified?")}{" "}
          <Link href={`/${useAppSelector((s) => s.settings.data?.id)}/login`} className="text-(--main-color) hover:underline">
            {t("Go to Login")}
          </Link>
        </p>
      </div>
    </div>
  );
}