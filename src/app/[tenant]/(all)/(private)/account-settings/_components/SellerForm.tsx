"use client";

import Image from "next/image";
import MainButton from "@/components/MainButton/MainButton";
import { useTranslations } from "next-intl";
import { useEffect, useState, ChangeEvent } from "react";
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchSellerProfile, updateSellerProfile } from '@/rtk/slices/seller/sellerSlice';
import SafeImage from "@/components/safeImage/SafeImage";
import { toast } from "sonner";
import Title from "@/components/title/Title";

export default function UserForm() {
    const t = useTranslations();
    const dispatch = useAppDispatch();
    const { profile, loading, loadingUpdate } = useAppSelector((s) => s.seller);

    // Form state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [address, setAddress] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("/placeholder.png");

    // Commercial register fields
    const [commercialRegisterImage, setCommercialRegisterImage] = useState<File | null>(null);
    const [commercialRegisterPreview, setCommercialRegisterPreview] = useState<string>("");
    const [commercialRegisterText, setCommercialRegisterText] = useState("");

    // Tax card fields
    const [taxCardImage, setTaxCardImage] = useState<File | null>(null);
    const [taxCardPreview, setTaxCardPreview] = useState<string>("");
    const [taxCardText, setTaxCardText] = useState("");

    // Fetch profile on mount
    useEffect(() => {
        dispatch(fetchSellerProfile());
    }, [dispatch]);

    // Populate form when profile loads
    useEffect(() => {
        if (profile) {
            setFullName(profile.name || "");
            setEmail(profile.email || "");
            setPhoneNumber(profile.phone || "");
            setAddress(profile.address || "");
            setPreview(profile.image || "/placeholder.png");
            setCommercialRegisterText(profile.commercialRegisterText || "");
            setCommercialRegisterPreview(profile.commercialRegisterImage || "");
            setTaxCardText(profile.taxCardText || "");
            setTaxCardPreview(profile.taxCardImage || "");
        }
    }, [profile]);

    // Handlers for image changes
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setProfileImage(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleCommercialRegisterChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setCommercialRegisterImage(file);
        if (file) setCommercialRegisterPreview(URL.createObjectURL(file));
    };

    const handleTaxCardChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setTaxCardImage(file);
        if (file) setTaxCardPreview(URL.createObjectURL(file));
    };

    // Handle save
    const handleSave = async () => {
        if (!fullName || !email || !phoneNumber) {
            toast(t("fillRequiredFields") || "Please fill all required fields");
            return;
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            toast(t("invalidPhone") || "Invalid phone number");
            return;
        }

        let countryCode = "20";
        let phone = phoneNumber;

        if (phoneNumber) {
            const parsed = parsePhoneNumber(phoneNumber);

            if (parsed) {
                countryCode = parsed.countryCallingCode;
                phone = parsed.nationalNumber;
            }
        }

        // Build FormData
        const formData = new FormData();
        formData.append("FullName", fullName);
        formData.append("Email", email);
        formData.append("Phone", phone);
        formData.append("CountryCode", `+${countryCode}`);
        if (profileImage) formData.append("Image", profileImage);
        formData.append("Address", address);
        if (commercialRegisterImage) formData.append("CommercialRegisterImage", commercialRegisterImage);
        formData.append("CommercialRegisterText", commercialRegisterText);
        if (taxCardImage) formData.append("TaxCardImage", taxCardImage);
        formData.append("TaxCardText", taxCardText);

        try {
            await dispatch(updateSellerProfile(formData)).unwrap();
            console.log("FormData to send:", Object.fromEntries(formData));
            toast(t("profileUpdated") || "Profile updated successfully");
        } catch (err: any) {
            toast(err || t("updateFailed") || "Failed to update profile");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-primary"></div>
            </div>
        );
    }

    return (
        <>
            <Title text={t("accountSettings")} />

            <div className="space-y-8">
                {/* Profile section (image + basic info) */}
                <div className="flex gap-5 flex-col md:flex-row">
                    {/* Profile Image */}
                    <div className="flex justify-center md:justify-start">
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
                            <label className="mb-1 font-medium">{t("fullName")} *</label>
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
                                <label className="mb-1 font-medium">{t("email")} *</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("emailPlaceholder")}
                                    className="border border-gray-200 p-2 rounded-lg"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1 font-medium">{t("phone")} *</label>
                                <PhoneInput
                                    international={false}
                                    defaultCountry="EG"
                                    value={phoneNumber}
                                    onChange={(value) => setPhoneNumber(value || "")}
                                    className="border border-gray-200 rounded-lg p-2"
                                />
                                {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                                    <p className="text-red-500 text-xs mt-1">{t("invalidPhone")}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">{t("address")}</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder={t("addressPlaceholder")}
                                className="border border-gray-200 p-2 rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Commercial Register Section */}
                <div className="border-t pt-6 border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">{t("commercialRegister")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">{t("commercialRegisterImage")}</label>
                            <div className="relative w-full h-40 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                {commercialRegisterPreview ? (
                                    <Image
                                        src={commercialRegisterPreview}
                                        alt="Commercial Register"
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        {t("noImage")}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCommercialRegisterChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">{t("commercialRegisterText")}</label>
                            <textarea
                                value={commercialRegisterText}
                                onChange={(e) => setCommercialRegisterText(e.target.value)}
                                placeholder={t("commercialRegisterTextPlaceholder")}
                                rows={4}
                                className="border border-gray-200 p-2 rounded-lg resize-none h-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Tax Card Section */}
                <div className="border-t pt-6 border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">{t("taxCard")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">{t("taxCardImage")}</label>
                            <div className="relative w-full h-40 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                {taxCardPreview ? (
                                    <Image
                                        src={taxCardPreview}
                                        alt="Tax Card"
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        {t("noImage")}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleTaxCardChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">{t("taxCardText")}</label>
                            <textarea
                                value={taxCardText}
                                onChange={(e) => setTaxCardText(e.target.value)}
                                placeholder={t("taxCardTextPlaceholder")}
                                rows={4}
                                className="border border-gray-200 p-2 rounded-lg resize-none h-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <MainButton
                        text={t("save")}
                        className="min-w-[150px] sm:min-w-[200px]"
                        onClick={handleSave}
                        disabled={loadingUpdate}
                    />
                </div>
            </div>
        </>
    );
}