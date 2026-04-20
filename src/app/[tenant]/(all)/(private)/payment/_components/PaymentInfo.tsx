"use client"
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ChevronDown } from 'lucide-react';
import MainButton from '@/components/MainButton/MainButton';
import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { fetchDefaultAddress, fetchUserAddressesPaginated } from '@/rtk/slices/address/addressSlice';

export default function PaymentInfo() {
    const t = useTranslations();
    const [checked, setChecked] = useState(false);

    const toggleChecked = () => setChecked(prev => !prev);

    const [phoneNumber, setPhoneNumber] = useState<string>();

    const inputClass = `
        w-full h-12 px-4 rounded-lg border-1 border-gray-200 
        bg-white transition-all duration-300 ease-out
        focus:outline-none focus:border-(--main-color) focus:shadow-md focus:shadow-(--main-color)/10
        hover:border-gray-300 placeholder:text-gray-400 placeholder:text-sm
    `;

    const selectClass = `
        ${inputClass} appearance-none cursor-pointer
        pr-10
    `;

    const labelClass = "text-sm font-semibold text-gray-700 mb-2";

    const { defaultAddress, defaultLoading, items, loading } = useAppSelector((s) => s.address)

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchDefaultAddress())
        if(!defaultAddress){
            fetchUserAddressesPaginated({})
        }
    }, [dispatch])


    return (
        <div className="lg:col-span-2 space-y-8 p-6 rounded-xl border border-gray-200">

            <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <div className="w-2 h-6 bg-(--main-color) rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">{t("PaymentInfo")}</h2>
            </div>

            {/* <div className='flex flex-col'>
                <label className={labelClass}>{t("FullName")}</label>
                <input
                    className={inputClass}
                    placeholder={t("FullNamePlaceholder")}
                />
            </div> */}

            <div className='flex flex-col'>
                <label className={labelClass}>{t("Country")}</label>
                <div className="relative">
                    <select className={selectClass}>
                        <option value="">{t("SelectCountry")}</option>
                        <option value="sa">السعودية</option>
                        <option value="eg">مصر</option>
                        <option value="ae">الإمارات</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="flex w-full gap-6 flex-col md:flex-row">
                <div className='flex flex-col flex-1'>
                    <label className={labelClass}>{t("City")}</label>
                    <div className="relative">
                        <select className={selectClass}>
                            <option value="">{t("SelectCity")}</option>
                            <option value="riyadh">الرياض</option>
                            <option value="cairo">القاهرة</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className='flex flex-col flex-1'>
                    <label className={labelClass}>{t("Area")}</label>
                    <div className="relative">
                        <select className={selectClass}>
                            <option value="">{t("SelectArea")}</option>
                            <option value="north">الشمال</option>
                            <option value="south">الجنوب</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className='flex flex-col'>
                <label className={labelClass}>{t("Address")}</label>
                <input
                    className={inputClass}
                    placeholder={t("AddressPlaceholder")}
                />
            </div>

            <div className="flex w-full gap-6 flex-col md:flex-row">
                {/* <div className='flex flex-col flex-1'>
                    <label className={labelClass}>{t("Email")}</label>
                    <input
                        className={inputClass}
                        placeholder={t("EmailPlaceholder")}
                        type="email"
                    />
                </div> */}

                <div className='flex flex-col flex-1'>
                    <label className={labelClass}>{t("Phone")}</label>
                    <div className="relative">
                        <PhoneInput
                            id="phone"
                            international
                            defaultCountry="EG"
                            value={phoneNumber}
                            onChange={(value) => setPhoneNumber(value)}
                            className={`
                                PhoneInput border-2 border-gray-100 rounded-lg h-12 px-4
                                hover:border-gray-300 focus-within:border-(--main-color) 
                                focus-within:shadow-md focus-within:shadow-(--main-color)/10
                                transition-all duration-300
                            `}
                            inputClassName="!border-none !shadow-none !outline-none !h-auto !w-full"
                            countrySelectClassName="!mr-3"
                        />
                        {phoneNumber && (
                            <div className="absolute -bottom-5 left-0">
                                {!isValidPhoneNumber(phoneNumber) && (
                                    <p className="text-red-500 text-xs animate-pulse">
                                        {t("phone_v")}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Checkbox with improved styling */}
            {/* <div
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer group"
                onClick={toggleChecked}
            >
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => { }}
                        id="deliverToOther"
                        className="sr-only"
                    />
                    <div
                        className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-300
            ${checked ? "bg-(--main-color) border-(--main-color)" : "border-gray-300 bg-white"}`}
                    >
                        {checked && (
                            <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </div>
                <label onClick={toggleChecked} htmlFor="deliverToOther" className="text-sm text-gray-700 cursor-pointer select-none">
                    {t("DeliverToOtherAddress")}
                </label>
            </div> */}

            {/* Notes */}
            {/* <div className='flex flex-col'>
                <label className={labelClass}>{t("NotesPlaceholder") || "ملاحظات اضافية"}</label>
                <textarea
                    className="
                        w-full h-32 resize-none px-4 py-3 rounded-lg border-1 border-gray-200 
                        bg-white transition-all duration-300 ease-out
                        focus:outline-none focus:border-(--main-color) focus:shadow-md focus:shadow-(--main-color)/10
                        hover:border-gray-300 placeholder:text-gray-400 placeholder:text-sm
                    "
                    placeholder={t("NotesPlaceholder")}
                />
            </div> */}

            <div className='flex justify-end'>
                <MainButton
                    text='addAddress'
                />
            </div>

            {/* Privacy Text */}
            <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">
                    {t("PrivacyTextPart1")}
                    <span className="text-(--main-color) hover:text-(--main-color)/80 cursor-pointer transition-colors font-medium">
                        {" "}{t("PrivacyTextPart2")}
                    </span>
                </p>
            </div>
        </div>
    )
}