"use client";

import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Google } from "@/assets";
import Image from "next/image";
import { MapPin, ImageIcon, FileText, CreditCard, Hash, Upload, X, EyeOff, Eye } from "lucide-react";
import Link from "next/link";
import MainButton from "@/components/MainButton/MainButton";
import { useRegisterForm } from "@/hooks/useRegisterForm";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Controller } from "react-hook-form";
import { RegisterSchemaType } from "@/validation/registerSchema";
import { useAppSelector } from "@/rtk/hooks";
import RecoveryAccountModal from "@/components/recoveryAccountModal/RecoveryAccountModal";

export default function Page() {
  const searchParams = useSearchParams();
  const { data, loading: logoLoading } = useAppSelector((s) => s.settings)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailForRecovery, setEmailForRecovery] = useState("");
  const isSeller = searchParams.get("seller") === "true";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
    onSubmit,
    loading,
    t,
    openRecoveryModal,
    setOpenRecoveryModal,
  } = useRegisterForm(isSeller, setEmailForRecovery);

  // Step management: 1 = basic info, 2 = seller details (only for sellers)
  const [step, setStep] = useState(1);

  // Image previews (seller only)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const profileFileRef = useRef<HTMLInputElement>(null);
  const [commercialImagePreview, setCommercialImagePreview] = useState<string | null>(null);
  const [taxImagePreview, setTaxImagePreview] = useState<string | null>(null);
  const commercialFileRef = useRef<HTMLInputElement>(null);
  const taxFileRef = useRef<HTMLInputElement>(null);

  // Handle "Next" button – validate only step 1 fields
  const handleNext = async () => {
    // List of field names that belong to step 1
    const step1Fields: (keyof RegisterSchemaType)[] = [
      "fullName",
      "phone",
      "email",
      "password",
      "confirmPassword",
    ];
    const isValid = await trigger(step1Fields);
    if (isValid) setStep(2);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
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

        <h1 className="text-xl font-semibold text-center mb-2 text-white">{t("RegisterTitle")}</h1>
        <p className="text-sm text-center text-white/70 mb-7 leading-relaxed">{t("RegisterSubtitle")}</p>

        {/* Step indicator (only for sellers) */}
        {isSeller && (
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 1 ? "bg-main text-white" : "bg-white/20 text-white/60"}`}>1</div>
            <div className="w-12 h-0.5 bg-white/20"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 2 ? "bg-main text-white" : "bg-white/20 text-white/60"}`}>2</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ========== STEP 1: Basic Info ========== */}
          <div style={{ display: step === 1 ? "block" : "none" }}>
            {/* Full Name */}
            <div className="mb-5">
              <label className="block text-sm mb-3 text-white/80">{t("FullName")}</label>
              <input
                type="text"
                placeholder={t("FullNamePlaceholder")}
                {...register("fullName")}
                className="w-full h-11 px-4 rounded-lg bg-white/10 border border-white/10 placeholder:text-white/50 text-white outline-none focus:border-(--main-color) focus:ring-2 focus:ring-(--main-color)/10 transition-colors duration-300"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label className="block text-sm mb-3 text-white/80">{t("PhoneLabel")}</label>
              <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    international={false}
                    defaultCountry="EG"
                    value={value}
                    onChange={(val) => onChange(val ?? '')}
                    className="flex items-center p-3 gap-3 border border-white/10 rounded-lg bg-white/10 text-black placeholder:text-white/50"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm mb-3 text-white/80">{t("EmailLabel")}</label>
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
            <div className="mb-5 relative">
              <label className="block text-sm mb-3 text-white/80">{t("PasswordLabel")}</label>
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
                  className={`absolute ${t("dir") === "rtl" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-8 relative">
              <label className="block text-sm mb-3 text-white/80">{t("ConfirmPasswordLabel")}</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("ConfirmPasswordPlaceholder")}
                  {...register("confirmPassword")}
                  className="w-full h-11 px-4 rounded-lg bg-white/10 border border-white/10 placeholder:text-white/50 text-white outline-none focus:border-(--main-color) focus:ring-2 focus:ring-(--main-color)/10 transition-colors duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className={`absolute ${t("dir") === "rtl" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition`}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Navigation for step 1 (only if seller) */}
            {isSeller && (
              <MainButton
                type="button"
                text="التالي"
                onClick={handleNext}
                className="w-full mb-6"
              />
            )}
          </div>

          {/* ========== STEP 2: Seller Details (only if isSeller = true) ========== */}
          {isSeller && (
            <div style={{ display: step === 2 ? "block" : "none" }}>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#1a1a2e] px-3 text-white/60">معلومات البائع</span>
                </div>
              </div>

              {/* Seller Profile Image */}
              <div className="mb-5">
                <label className="block text-sm mb-3 text-white/80 flex items-center gap-2">
                  <ImageIcon size={16} className="text-(--main-color)" />
                  صورة البروفايل <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                    {profileImagePreview ? (
                      <img src={profileImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-white/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      ref={profileFileRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setProfileImagePreview(reader.result as string);
                          reader.readAsDataURL(file);
                          setValue("imageUrl", file);
                        } else {
                          setProfileImagePreview(null);
                          setValue("imageUrl", null);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => profileFileRef.current?.click()}
                      className="w-full h-11 px-4 rounded-lg bg-white/10 border border-white/10 text-white/80 hover:bg-white/20 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <Upload size={18} className="text-(--main-color)" />
                      <span>اختر صورة البروفايل</span>
                    </button>
                  </div>
                </div>
                {errors.imageUrl && (
                  <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message as string}</p>
                )}
              </div>

              {/* Address */}
              <div className="mb-5">
                <label className="block text-sm mb-3 text-white/80 flex items-center gap-2">
                  <MapPin size={16} className="text-(--main-color)" />
                  العنوان <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ادخل عنوان المتجر بالكامل"
                  {...register("address")}
                  className="w-full h-11 px-4 rounded-lg bg-white/10 border border-white/10 placeholder:text-white/50 text-white outline-none focus:border-(--main-color) focus:ring-2 focus:ring-(--main-color)/10 transition-colors duration-300"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* Commercial Register Image */}
              <div className="mb-5">
                <label className="block text-sm mb-3 text-white/80 flex items-center gap-2">
                  <ImageIcon size={16} className="text-(--main-color)" />
                  صورة السجل التجاري <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                    {commercialImagePreview ? (
                      <img src={commercialImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-white/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      ref={commercialFileRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setCommercialImagePreview(reader.result as string);
                          reader.readAsDataURL(file);
                          setValue("commercialRegisterImage", file);
                        } else {
                          setCommercialImagePreview(null);
                          setValue("commercialRegisterImage", null);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => commercialFileRef.current?.click()}
                      className="w-full h-11 px-4 rounded-lg bg-white/10 border border-white/10 text-white/80 hover:bg-white/20 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <Upload size={18} className="text-(--main-color)" />
                      <span>اختر صورة</span>
                    </button>
                    {commercialImagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setCommercialImagePreview(null);
                          setValue("commercialRegisterImage", null);
                          if (commercialFileRef.current) commercialFileRef.current.value = '';
                        }}
                        className="text-xs text-red-400 hover:text-red-300 mt-1 flex items-center gap-1"
                      >
                        <X size={14} /> إزالة
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-white/40 mt-1">jpg, png, jpeg (أقصى حجم 5 ميجابايت)</p>
                {errors.commercialRegisterImage && (
                  <p className="text-red-500 text-xs mt-1">{errors.commercialRegisterImage.message as string}</p>
                )}
              </div>

              {/* Commercial Register Text */}
              <div className="mb-5">
                <label className="block text-sm mb-3 text-white/80 flex items-center gap-2">
                  <FileText size={16} className="text-(--main-color)" />
                  نص السجل التجاري <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="رقم السجل التجاري أو النص الظاهر"
                  {...register("commercialRegisterText")}
                  className="w-full h-11 px-4 rounded-lg bg-white/10 border border-white/10 placeholder:text-white/50 text-white outline-none focus:border-(--main-color) focus:ring-2 focus:ring-(--main-color)/10 transition-colors duration-300"
                />
                {errors.commercialRegisterText && (
                  <p className="text-red-500 text-xs mt-1">{errors.commercialRegisterText.message}</p>
                )}
              </div>

              {/* Tax Card Image */}
              <div className="mb-5">
                <label className="block text-sm mb-3 text-white/80 flex items-center gap-2">
                  <CreditCard size={16} className="text-(--main-color)" />
                  صورة بطاقة الضريبة <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                    {taxImagePreview ? (
                      <img src={taxImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <CreditCard size={24} className="text-white/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      ref={taxFileRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setTaxImagePreview(reader.result as string);
                          reader.readAsDataURL(file);
                          setValue("taxCardImage", file);
                        } else {
                          setTaxImagePreview(null);
                          setValue("taxCardImage", null);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => taxFileRef.current?.click()}
                      className="w-full h-11 px-4 rounded-lg bg-white/10 border border-white/10 text-white/80 hover:bg-white/20 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <Upload size={18} className="text-(--main-color)" />
                      <span>اختر صورة</span>
                    </button>
                    {taxImagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setTaxImagePreview(null);
                          setValue("taxCardImage", null);
                          if (taxFileRef.current) taxFileRef.current.value = '';
                        }}
                        className="text-xs text-red-400 hover:text-red-300 mt-1 flex items-center gap-1"
                      >
                        <X size={14} /> إزالة
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-white/40 mt-1">jpg, png, jpeg (أقصى حجم 5 ميجابايت)</p>
                {errors.taxCardImage && (
                  <p className="text-red-500 text-xs mt-1">{errors.taxCardImage.message as string}</p>
                )}
              </div>

              {/* Tax Card Text */}
              <div className="mb-8">
                <label className="block text-sm mb-3 text-white/80 flex items-center gap-2">
                  <Hash size={16} className="text-(--main-color)" />
                  نص بطاقة الضريبة <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="الرقم الضريبي أو النص الظاهر"
                  {...register("taxCardText")}
                  className="w-full h-11 px-4 rounded-lg bg-white/10 border border-white/10 placeholder:text-white/50 text-white outline-none focus:border-(--main-color) focus:ring-2 focus:ring-(--main-color)/10 transition-colors duration-300"
                />
                {errors.taxCardText && (
                  <p className="text-red-500 text-xs mt-1">{errors.taxCardText.message}</p>
                )}
              </div>

              {/* Navigation buttons for step 2 */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 h-11 rounded-lg bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-colors duration-300"
                >
                  رجوع
                </button>
                <MainButton
                  type="submit"
                  text={t("CreateAccount")}
                  loading={loading}
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {/* For non‑sellers, the submit button is shown directly after basic info */}
          {!isSeller && (
            <MainButton type="submit" text={t("CreateAccount")} loading={loading} className="w-full mb-6" />
          )}
        </form>

        {/* Footer links (unchanged) */}
        <p className="text-center text-sm text-white/70 mb-2">
          {t("HaveAccount")}{" "}
          <Link href={`/${useAppSelector((s) => s.settings.data?.id)}/login`} className="text-(--main-color) hover:underline">
            {t("LoginNow")}
          </Link>
        </p>

        <Link href={`/${useAppSelector((s) => s.settings.data?.id)}/sign-up-with-google`} className="w-full h-11 rounded-lg bg-white text-gray-800 flex items-center justify-center gap-2 font-medium cursor-pointer transition-all duration-150 hover:bg-gray-100 hover:shadow-md active:scale-[0.97]">
          <Image src={Google} alt="Google" width={28} height={28} /> {t("LoginWithGoogle")}
        </Link>
      </div>

      <RecoveryAccountModal
        open={openRecoveryModal}
        onClose={() => setOpenRecoveryModal(false)}
        email={emailForRecovery}
      />
    </div>
  );
}