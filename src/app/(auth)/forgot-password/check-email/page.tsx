"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Layer_1 } from "@/assets";

export default function CheckEmailPage() {
    const t = useTranslations();
    const searchParams = useSearchParams();

    const email = searchParams.get("email");

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
                text-center
                "
            >
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image src={Layer_1} alt="Logo" width={70} height={70} />
                </div>

                {/* Title */}
                <h1 className="text-xl font-semibold mb-3">
                    {t("Check Your Email")}
                </h1>

                {/* Message */}
                <p className="text-sm text-white/70 mb-6 leading-relaxed">
                    {email ? (
                        <>
                            <span className="block font-medium text-white mb-2">
                                {email}
                            </span>
                            {t("We have sent a password reset link to your email")}
                        </>
                    ) : (
                        t("We have sent a password reset link")
                    )}
                </p>

                {/* Instructions */}
                <div className="text-xs text-white/60 mb-8 space-y-1">
                    <div>{t("Open your email inbox")}</div>
                    <div>{t("Click on the reset link")}</div>
                    <div>{t("Create a new password")}</div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    {/* Open Gmail (optional shortcut) */}
                    <a
                        href="https://mail.google.com"
                        target="_blank"
                        className="block w-full h-11 rounded-lg bg-main text-white flex items-center justify-center hover:opacity-90 transition"
                    >
                        {t("Open Email")}
                    </a>

                    {/* Back */}
                    <Link
                        href="/forgot-password"
                        className="block text-sm text-main hover:underline"
                    >
                        {t("Back")}
                    </Link>
                </div>

                {/* Resend */}
                <p className="text-xs text-white/50 mt-6">
                    {t("Didn't receive the email?")}{" "}
                    <Link
                        href="/forgot-password/step-1"
                        className="text-main hover:underline"
                    >
                        {t("Try again")}
                    </Link>
                </p>
            </div>
        </div>
    );
}