"use client";

import React, { useEffect } from "react";
import { Mail, Phone, MapPin, User } from "lucide-react";
import AdminSectionHeader from "@/components/adminSectionHeader/AdminSectionHeader";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchContactUsList } from "@/rtk/slices/contactUs/contactUsSlice";
import LoadingSpinner from "../_components/LoadingSpinner";

export default function ContactInfoView() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchContactUsList());
  }, [dispatch]);

  const { list, loading } = useAppSelector((s) => s.ContactUs);

  return (
    <div className="min-h-screen bg-[#F6F7F9] p-4 md:p-8">
      <div className="p-2 space-y-5">
        {/* Header */}
        <AdminSectionHeader title={t("view messages")} />
        {loading && (<LoadingSpinner />)}

        {list.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 mb-5 shadow-sm"
          >

            {/* Sender info */}
            <div className="mt-4 flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                <User className="h-5 w-5 text-gray-600" />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-[#111827]">{item.fullName}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{item.email}</span>
                  </div>
                </div>
              </div>

              {/* Phone nicely formatted */}
              <div dir="ltr" className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>
                  {item.countryCode ? `${item.countryCode} ` : ""}{item.phoneNumber}
                </span>
              </div>
            </div>


            {/* Message */}
            <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-sm text-gray-800 leading-6 whitespace-pre-line">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
