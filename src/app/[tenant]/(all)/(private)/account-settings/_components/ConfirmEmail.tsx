"use client";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getCookie } from "cookies-next";

export default function ConfirmEmail() {
  const t = useTranslations();
  const { emailConfirmed, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

  useEffect(() => {
    let user = getCookie("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user as string);
        setUserEmail(parsedUser.email || "");
      } catch (err) {
        console.error("Failed to parse user cookie:", err);
      }
    }
  }, []);

  if (emailConfirmed) return null;

  const handleVerify = async () => {
    if (!userEmail) {
      toast(t("Invalid email"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${base}/api/Account/Re-ConfirmEmail?email=${encodeURIComponent(
          userEmail
        )}`,
        {
          method: "GET",
          headers: {
            "Accept-Language": "ar",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        toast(t("We have sent a confirm email link to your email"));
        setShowModal(false);
      } else {
        const data = await res.json();
        toast(data?.title || t("Invalid email"));
      }
    } catch (err) {
      toast("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Banner */}
      <div className="w-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 px-4 py-3 rounded-lg flex items-center justify-between">
        <span className="text-sm">
          {t("Please confirm your email to unlock all features")}
        </span>

        <button
          onClick={() => setShowModal(true)}
          disabled={loading}
          className="text-sm font-medium text-yellow-600 hover:underline disabled:opacity-50"
        >
          {loading ? t("Loading") : t("Confirm Now")}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-gray-900">
            <h2 className="text-lg font-semibold mb-4">{t("Confirm Your Email")}</h2>
            <p className="mb-4 text-sm">
              {t("We will send a confirmation link to your email")}:
            </p>
            <p className="mb-6 font-medium text-gray-800">{userEmail}</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleVerify}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-main text-white hover:bg-yellow-600 disabled:opacity-50"
              >
                {loading ? t("Loading") : t("Send Confirmation")}
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              {t(
                "After sending, open your Gmail account and click the link to verify your email"
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}