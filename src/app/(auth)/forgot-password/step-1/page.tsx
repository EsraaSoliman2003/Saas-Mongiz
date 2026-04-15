"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Layer_1 } from "@/assets";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  const t = useTranslations();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgetPass = async () => {
    // ✅ Validation
    if (!email) {
      toast.error(t("Please enter your email"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${base}/api/Account/forget-password?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Accept-Language": "ar",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data?.message || t("Email sent successfully"));

        router.push(`/forgot-password/check-email`);
      } else {
        toast.error(data?.title || t("Something went wrong"));
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div
        className="
          w-full max-w-md
          bg-white/10 backdrop-blur-xl
          rounded-2xl
          px-8 py-10
          text-white
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <Image src={Layer_1} alt="Logo" width={70} height={70} />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-center mb-3">
          {t("ResetPasswordTitle")}
        </h1>

        <p className="text-sm text-center text-white/70 mb-8 leading-relaxed">
          {t("ResetPasswordSubtitle")}
        </p>

        {/* Email */}
        <div className="mb-8">
          <label className="block text-sm mb-3 text-white/80">
            {t("EmailLabel")}
          </label>
          <input
            type="email"
            placeholder={t("EmailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full h-11 px-4 rounded-lg
              bg-white/10 border border-white/10
              placeholder:text-white/50 text-white
              outline-none
              focus:border-(--main-color) focus:ring-2 focus:ring-(--main-color)/10
              transition-colors duration-300 ease-in-out
            "
          />
        </div>

        {/* Button بدل Link */}
        <button
          onClick={handleForgetPass}
          disabled={loading}
          className="w-full h-11 rounded-lg bg-main text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? t("Loading") : t("ResetPasswordButton")}
        </button>
      </div>
    </div>
  );
}