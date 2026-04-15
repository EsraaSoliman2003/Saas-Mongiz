"use client";

import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from 'next-intl';
import { bottomArrow } from "@/assets";
import Image from 'next/image';
import { useState } from 'react';
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { createAddress } from '@/rtk/slices/address/addressSlice';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import "./style.css";

type Props = {};

export default function Page({ }: Props) {
    const t = useTranslations();

    // ---------- Temporary select data ----------
    const countries = [
        { code: "eg", nameEN: "Egypt", nameAR: "مصر", nameZH: "埃及" },
        { code: "sa", nameEN: "Saudi Arabia", nameAR: "السعودية", nameZH: "沙特阿拉伯" },
        { code: "ae", nameEN: "UAE", nameAR: "الإمارات", nameZH: "阿联酋" },
    ];

    const governorates = [
        { code: "mn", nameEN: "Menofeya", nameAR: "المنوفية", nameZH: "米努菲耶省" },
        { code: "cai", nameEN: "Cairo", nameAR: "القاهرة", nameZH: "开罗" },
    ];

    const cities = [
        { code: "shebin", nameEN: "Shebin", nameAR: "شبين", nameZH: "希宾" },
        { code: "tanta", nameEN: "Tanta", nameAR: "طنطا", nameZH: "坦塔" },
    ];

    // ---------- State ----------
    const [country, setCountry] = useState("");
    const [governorate, setGovernorate] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    // ---------- Classes ----------
    const fieldClass = `
        w-full h-12 rounded-lg border-1 border-gray-200 px-4 text-sm bg-white appearance-none 
        transition-all duration-300 ease-out focus:outline-none focus:border-main 
        hover:border-gray-300 focus:shadow-md focus:shadow-main/10
        placeholder:text-gray-400 placeholder:text-sm
    `;
    const labelClass = "text-sm font-semibold text-gray-700 mb-2";
    const selectWrapper = "relative group";
    // Arrow wrapper classes: positioning + size
    const arrowWrapperClass = `absolute ${t("dir") === "rtl" ? "left-4" : "right-4"} 
        top-1/2 -translate-y-1/2 pointer-events-none 
        transition-transform duration-300 
        group-focus-within:-rotate-180 group-hover:scale-110 
        w-3.5 h-3.5`;

    // ---------- Submit function ----------
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { mutateLoading } = useAppSelector(state => state.address);

    const handleSave = () => {
        if (!country || !governorate || !city || !address || !phone) {
            toast("Please fill all fields");
            return;
        }

        // Parse phone number to extract national number and country code
        let nationalNumber = "";
        let countryCode = "";
        try {
            const phoneNumber = parsePhoneNumber(phone);
            if (phoneNumber) {
                nationalNumber = phoneNumber.nationalNumber;
                countryCode = `+${phoneNumber.countryCallingCode}`;
            } else {
                throw new Error("Invalid phone number");
            }
        } catch (error) {
            toast("Invalid phone number format");
            return;
        }

        const payload = {
            country: (
                t("code") === "ar"
                    ? countries.find(c => c.code === country)?.nameAR
                    : t("code") === "en" ? countries.find(c => c.code === country)?.nameEN
                        : countries.find(c => c.code === country)?.nameZH
            )
                || "",
            governrate: (
                t("code") === "ar"
                    ? governorates.find(c => c.code === governorate)?.nameAR
                    : t("code") === "en" ? governorates.find(c => c.code === governorate)?.nameEN
                        : governorates.find(c => c.code === governorate)?.nameZH
            )
                || "",
            city: (
                t("code") === "ar"
                    ? cities.find(c => c.code === city)?.nameAR
                    : t("code") === "en" ? cities.find(c => c.code === city)?.nameEN
                        : cities.find(c => c.code === city)?.nameZH
            )
                || "",
            houseNumberAndStreet: address,
            phoneNumber: nationalNumber,
            countryCode: countryCode,
        };

        dispatch(createAddress(payload))
            .unwrap()
            .then(() => {
                toast("Address saved successfully!");
                router.back();
            })
            .catch((err) => {
                toast(err);
            });
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10 flex flex-col gap-8 mt-10 md:mt-5 mb-20">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-6 bg-main rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">{t("AddAddress")}</h2>
            </div>

            {/* Country */}
            <div className="flex flex-col">
                <label className={labelClass}>{t("SelectCountry")}</label>
                <div className={selectWrapper}>
                    <select
                        className={`${fieldClass} cursor-pointer [&>option]:bg-white [&>option]:text-gray-700`}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        <option value="">{t("SelectCountry")}</option>
                        {countries.map(c => (
                            <option key={c.code} value={c.code}>
                                {t("dir") === "rtl" ? c.nameAR : c.nameEN}
                            </option>
                        ))}
                    </select>
                    {/* Arrow icon with fill */}
                    <div className={arrowWrapperClass}>
                        <Image
                            src={bottomArrow}
                            alt="arrow"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* Governorate + City */}
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col flex-1">
                    <label className={labelClass}>{t("Governorate")}</label>
                    <div className={selectWrapper}>
                        <select
                            className={`${fieldClass} cursor-pointer [&>option]:bg-white [&>option]:text-gray-700`}
                            value={governorate}
                            onChange={(e) => setGovernorate(e.target.value)}
                        >
                            <option value="">{t("SelectGovernorate")}</option>
                            {governorates.map(g => (
                                <option key={g.code} value={g.code}>
                                    {t("dir") === "rtl" ? g.nameAR : g.nameEN}
                                </option>
                            ))}
                        </select>
                        <div className={arrowWrapperClass}>
                            <Image
                                src={bottomArrow}
                                alt="arrow"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-1">
                    <label className={labelClass}>{t("City")}</label>
                    <div className={selectWrapper}>
                        <select
                            className={`${fieldClass} cursor-pointer [&>option]:bg-white [&>option]:text-gray-700`}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        >
                            <option value="">{t("SelectCity")}</option>
                            {cities.map(c => (
                                <option key={c.code} value={c.code}>
                                    {t("dir") === "rtl" ? c.nameAR : c.nameEN}
                                </option>
                            ))}
                        </select>
                        <div className={arrowWrapperClass}>
                            <Image
                                src={bottomArrow}
                                alt="arrow"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="flex flex-col">
                <label className={labelClass}>{t("Address")}</label>
                <input
                    className={fieldClass}
                    placeholder={t("AddressPlaceholder")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>

            {/* Phone */}
            <div className="mb-5">
                <label className="block text-sm mb-3 text-white/80">{t("PhoneLabel")}</label>
                <PhoneInput
                    international={false}
                    defaultCountry="EG"
                    value={phone}
                    onChange={(val) => setPhone(val || "")}
                    className="flex items-center p-3 gap-3 border border-[#ffffff1a] rounded-lg"
                />
            </div>

            {/* Button */}
            <div className="flex justify-end pt-4">
                <MainButton
                    text={t("save")}
                    className="px-16 py-3.5 w-full sm:w-auto font-semibold text-base active:translate-y-0 active:scale-95 transition-all duration-300"
                    onClick={handleSave}
                    disabled={mutateLoading}
                />
            </div>
        </div>
    );
}