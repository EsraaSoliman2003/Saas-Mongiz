"use client";

import React, { useState } from "react";
import { X, Mail, MailCheck, AlertTriangle } from "lucide-react";
import MainButton from "../MainButton/MainButton";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { recoverAccount } from "@/rtk/slices/auth/authSlice";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
  email: string;
}

export default function RecoveryAccountModal({
  open,
  onClose,
  email,
}: Props) {
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleRecover = async () => {
    if (!email) {
      toast.error(t("EmailNotFound"));
      return;
    }

    try {
      setLoading(true);

      const result: any = await dispatch(recoverAccount(email));

      if (result.type.endsWith("rejected")) {
        toast.error(result.payload?.message || t("FailedToSendEmail"));
        return;
      }

      setSuccess(true);
    } catch {
      toast.error(t("SomethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10 relative">

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* ========= BEFORE SEND ========= */}
        {!success ? (
          <>
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-400" size={26} />
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-center text-white mb-2">
              {t("AccountDeletedTitle") || "Account Deleted"}
            </h2>

            {/* Description */}
            <p className="text-sm text-center text-white/70 mb-2 leading-relaxed">
              {t("AccountDeletedDesc") ||
                "This account has been deleted from our system."}
            </p>

            <p className="text-sm text-center text-white/70 mb-6">
              {t("AccountRecoverHint") ||
                "You can recover your account and continue using it."}
            </p>

            {/* Email */}
            <div className="text-center text-main text-sm mb-6 break-all">
              {email}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 h-11 rounded-lg bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition"
              >
                {t("Cancel")}
              </button>

              <MainButton
                onClick={handleRecover}
                text={t("RecoverAccount") || "Recover Account"}
                disabled={loading}
                className="flex-1"
              />
            </div>
          </>
        ) : (
          /* ========= AFTER SEND ========= */
          <>
            <div className="text-center">

              {/* Icon */}
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <MailCheck className="text-green-400" size={26} />
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold text-white mb-2">
                {t("CheckYourEmail")}
              </h2>

              {/* Description */}
              <p className="text-sm text-white/70 mb-4 leading-relaxed">
                {t("RecoveryEmailSent") ||
                  "We sent a recovery link to your email"}
              </p>

              {/* Email */}
              <div className="text-(--main-color) text-sm mb-6 break-all">
                {email}
              </div>

              {/* Extra note */}
              <p className="text-xs text-white/50 mb-4">
                {t("CheckInboxNote")}
              </p>

              {/* Open Email */}
              <a
                href="https://mail.google.com"
                target="_blank"
                className="block text-center text-sm text-main hover:underline mb-5"
              >
                {t("OpenEmail") || "Open Email"}
              </a>

              {/* Done button */}
              <Link
                href={`/${useAppSelector((s) => s.settings.data?.id)}/login`}
                className="w-full h-11 flex items-center justify-center rounded-lg bg-main text-white hover:bg-(--main-color) transition"
              >
                {t("GoToLogin") || "Go to Login"}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}