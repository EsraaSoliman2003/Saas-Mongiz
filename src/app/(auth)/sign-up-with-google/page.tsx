"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { getRegisterSchema, RegisterSchemaType } from "@/validation/registerSchema";
import GoogleSignUpButton from "../register/GoogleSignUpButton";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/rtk/hooks";

export default function Page() {
    const t = useTranslations();
    const { logo, loading } = useAppSelector((s) => s.logo)

    const { control, watch, formState: { errors } } = useForm<RegisterSchemaType>({
        resolver: zodResolver(getRegisterSchema(t, false)),
        mode: "onChange",
        defaultValues: {
            phone: "",
        },
    });

    const phoneValue = watch("phone");
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <Link href="/" className="flex justify-center mb-6">
                    {
                        loading ? (
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

                <h1 className="text-xl font-semibold text-center mb-2 text-white">{t("RegisterTitle")}</h1>
                <p className="text-sm text-center text-white/70 mb-7 leading-relaxed">{t("RegisterSubtitle")}</p>

                <div className="mb-5">
                    <label className="block text-sm mb-3 text-white/80">Phone Number</label>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <PhoneInput
                                international={false}
                                defaultCountry="EG"
                                value={value}
                                onChange={(val) => onChange(val ?? "")}
                                className="flex items-center p-3 gap-3 border border-white/10 rounded-lg bg-transparent! text-white placeholder:text-white/50"
                            />
                        )}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{t(errors.phone.message || "")}</p>}
                </div>

                <GoogleSignUpButton
                    phoneNumber={phoneValue ? parsePhoneNumberFromString(phoneValue, "EG")?.nationalNumber ?? "" : ""}
                    countryCode={phoneValue ? `+${parsePhoneNumberFromString(phoneValue, "EG")?.countryCallingCode ?? ""}` : ""}
                />
            </div>
        </div>
    );
}