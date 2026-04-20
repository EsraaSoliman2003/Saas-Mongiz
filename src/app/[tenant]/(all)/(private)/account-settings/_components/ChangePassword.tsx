"use client";

import { ChevronLeft, X, Eye, EyeOff } from "lucide-react";
import MainButton from "@/components/MainButton/MainButton";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { updateProfilePassword } from "@/rtk/slices/profile/profileSlice";
import { toast } from "sonner";

export default function ChangePassword() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { updatePasswordLoading } = useAppSelector((s) => s.profile);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  // Separate visibility states for each password field
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useClickOutside({
    ref: menuRef,
    handler: () => setShowPasswordModal(false),
  });

  const handleChangePassword = async () => {
    setError("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError(t("allFieldsRequired") || "All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError(t("passwordsDoNotMatch") || "Passwords do not match");
      return;
    }

    try {
      await dispatch(
        updateProfilePassword({ currentPassword, newPassword })
      ).unwrap();

      toast.success(t("passwordChangedSuccessfully") || "Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPasswordModal(false);
    } catch (err: any) {
      console.log(err);
    }
  };

  // Helper to apply RTL-aware padding and icon placement
  const isRtl = t("dir") === "rtl";
  const inputPaddingClass = isRtl ? "pl-10" : "pr-10";
  const iconPositionClass = isRtl ? "left-0" : "right-0";

  return (
    <>
      <div className="pt-8 space-y-3 text-right">
        <p className="text-gray-500 text-sm">{t("changePassword")}</p>
        <div
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center justify-between bg-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-200 transition"
        >
          <span className="text-gray-700">{t("changePasswordInfo")}</span>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div
            ref={menuRef}
            className="bg-white rounded-xl p-6 w-full max-w-md relative m-4"
          >
            <button
              onClick={() => setShowPasswordModal(false)}
              className={`absolute top-6 ${
                isRtl ? "left-6" : "right-6"
              } text-gray-500 hover:text-gray-700`}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold mb-4">{t("changePassword")}</h3>

            <div className="flex flex-col space-y-4">
              {/* Current Password */}
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder={t("currentPassword")}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`border border-gray-200 p-2 rounded-lg w-full ${inputPaddingClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className={`absolute inset-y-0 ${iconPositionClass} px-3 flex items-center`}
                >
                  {showCurrent ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder={t("newPassword")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`border border-gray-200 p-2 rounded-lg w-full ${inputPaddingClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className={`absolute inset-y-0 ${iconPositionClass} px-3 flex items-center`}
                >
                  {showNew ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder={t("confirmNewPassword")}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={`border border-gray-200 p-2 rounded-lg w-full ${inputPaddingClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className={`absolute inset-y-0 ${iconPositionClass} px-3 flex items-center`}
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end">
                <MainButton
                  text={t("change")}
                  onClick={handleChangePassword}
                  disabled={updatePasswordLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}