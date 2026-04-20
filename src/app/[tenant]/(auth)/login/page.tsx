"use client";

import React from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import MainButton from "@/components/MainButton/MainButton";
import { useLoginForm } from "@/hooks/useLoginForm";
import GoogleSignInButton from "./GoogleSignInButton";
import { useAppSelector } from "@/rtk/hooks";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    loading,
    t,
  } = useLoginForm();

  const [showPassword, setShowPassword] = React.useState(false);
  const { logo, loading: logoLoading } = useAppSelector((s) => s.logo)

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
                src={logo?.logoDarkMode || "/default-logo.png"}
                alt="Mongiz"
                width={220}
                height={220}
              />
            )
          }
        </Link>

        {/* Title */}
        <h1 className="text-xl font-semibold text-center mb-2">{t("LoginTitle")}</h1>
        <p className="text-sm text-center text-white/70 mb-7 leading-relaxed">
          {t("LoginSubtitle")}
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm mb-3 text-white/80">
              {t("EmailLabel")}
            </label>
            <input
              type="email"
              placeholder={t("EmailPlaceholder")}
              {...register("email")}
              className="w-full h-11 px-4 rounded-lg bg-white/10 border border-white/10 placeholder:text-white/50 text-white outline-none focus:border-(--main-color) focus:ring-2 focus:ring-(--main-color)/10 transition-colors duration-300"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-8 relative">
            <div className="flex justify-between mb-2 items-center">
              <label className="block text-sm text-white/80">
                {t("PasswordLabel")}
              </label>
              <Link
                href={`/${useAppSelector((s) => s.settings.data?.id)}/forgot-password/step-1`}
                className="text-sm text-(--main-color) hover:underline"
              >
                {t("ForgotPassword")}
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("PasswordPlaceholder")}
                {...register("password")}
                className="w-full h-11 px-4 rounded-lg bg-white/10 border border-white/10 placeholder:text-white/50 text-white outline-none focus:border-(--main-color) focus:ring-2 focus:ring-(--main-color)/10 transition-colors duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className={`absolute ${t("dir") === "rtl" ? "left-3" : "right-3"
                  } top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Login Button */}
          <MainButton
            type="submit"
            text={t("LoginButton")}
            loading={loading}
            className="w-full mb-6"
          />
        </form>

        {/* Signup */}
        <p className="text-center text-sm text-white/70 mb-2">
          {t("NoAccount")}{" "}
          <Link href={`/${useAppSelector((s) => s.settings.data?.id)}/register`} className="text-main hover:underline">
            {t("RegisterLink")}
          </Link>
        </p>

        {/* Google Button */}
        <GoogleSignInButton />
      </div>
    </div>
  );
}