"use client";

import Image from "next/image";
import MainButton from "@/components/MainButton/MainButton";
import { useTranslations } from "next-intl";
import { useEffect, useState, ChangeEvent } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchProfile, updateProfileForMobile } from "@/rtk/slices/profile/profileSlice";
import SafeImage from "@/components/safeImage/SafeImage";
import { toast } from "sonner";
import Title from "@/components/title/Title";

export default function UserForm() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((s) => s.profile);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("/placeholder.png");

  // Fetch profile on mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setEmail(profile.email || "");
      setPhoneNumber(profile.phone || "");
      setPreview(profile.imageUrl || "/placeholder.png");
    }
  }, [profile]);

  // Handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!fullName || !email || !phoneNumber) {
      toast("Please fill all required fields");
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      toast("Invalid phone number");
      return;
    }

    try {
      await dispatch(
        updateProfileForMobile({ fullName, email, phoneNumber, profileImage })
      ).unwrap();
      toast("Profile updated successfully");
    } catch (err: any) {
      toast(err || "Failed to update profile");
    }
  };

  return (
    <>
      <Title text={t("accountSettings")} />

      <div className="space-y-6 flex gap-5">
        {/* Profile Image */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 relative">
            <SafeImage
              src={preview}
              alt="Profile"
              fill
              sizes="128px"
              className="object-cover"
              priority={false}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">{t("fullName")}</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("fullNamePlaceholder")}
              className="border border-gray-200 p-2 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-medium">{t("email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="border border-gray-200 p-2 rounded-lg"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium">{t("phone")}</label>
              <PhoneInput
                id="phone"
                international={false}
                defaultCountry="EG"
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value || "")}
              />
              {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                <p className="text-red-500 text-xs mt-1">{t("invalidPhone")}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <MainButton
              text={t("save")}
              className="min-w-[150px] sm:min-w-[200px]"
              onClick={handleSave}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
