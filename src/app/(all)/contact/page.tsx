"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import {
  sendContactUs,
  resetSendStatus,
} from "@/rtk/slices/contactUs/contactUsSlice";
import {
  fetchContactInfoList,
} from "@/rtk/slices/contactInfo/contactInfoSlice";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function Page() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const { sendLoading, sendError, sentSuccess } = useAppSelector(
    (s) => s.contactUs
  );

  const { list } = useAppSelector((s) => s.contactInfo);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+20",
    message: "",
  });

  useEffect(() => {
    dispatch(fetchContactInfoList());
  }, [dispatch]);

  useEffect(() => {
    if (sentSuccess) {
      toast.success(t("contactSentSuccess"));
      setForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        countryCode: "+20",
        message: "",
      });

      const timer = setTimeout(() => {
        dispatch(resetSendStatus());
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (sendError) {
      toast.error(t("contactSentFailed"));
      const timer = setTimeout(() => {
        dispatch(resetSendStatus());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sentSuccess, sendError, dispatch, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(sendContactUs(form));
  };

  const info = list?.[0];

  return (
    <div className="py-10 md:py-20">
      <div className="container space-y-16">

        {/* ================= TOP SECTION ================= */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* ===== RIGHT: NEWSLETTER CARD ===== */}
          <div
            className="text-white rounded-3xl p-10 shadow-lg flex flex-col justify-between transition-all duration-300"
            style={{
              background: "linear-gradient(rgba(0,0,0,0.7)), url('/faq.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div>
              {/* Icon */}
              <div className="bg-white/20 w-14 h-14 flex items-center justify-center rounded-xl mb-6">
                <HelpCircle size={28} />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-4">
                {t("faqTitle")}
              </h3>

              {/* Text */}
              <p className="text-white/90 leading-relaxed mb-4">
                {t("description1")}
              </p>

              <p className="text-white/80 text-sm">
                {t("description2")}
              </p>

              {/* Divider */}
              <div className="w-full h-px bg-white/30 my-6" />
            </div>

            {/* Button */}
            <Link
              href="/faq"
              className="w-full bg-white text-dark py-3 rounded-full text-center font-medium transition-all duration-300 hover:opacity-80"
            >
              {t("faqButton")}
            </Link>
          </div>

          {/* ===== LEFT: CONTACT FORM ===== */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email + Phone */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                required
                placeholder={t("emailPlaceholder")}
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full bg-gray-100 rounded-full px-6 py-4 outline-none transition-shadow focus:ring-2 focus:ring-(--dark-color)/20"
              />

              <input
                type="text"
                required
                placeholder={t("phonePlaceholder")}
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
                className="w-full bg-gray-100 rounded-full px-6 py-4 outline-none transition-shadow focus:ring-2 focus:ring-(--dark-color)/20"
              />
            </div>

            {/* Name */}
            <input
              type="text"
              required
              placeholder={t("namePlaceholder")}
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
              className="w-full bg-gray-100 rounded-full px-6 py-4 outline-none transition-shadow focus:ring-2 focus:ring-(--dark-color)/20"
            />

            {/* Message */}
            <textarea
              rows={6}
              required
              placeholder={t("messagePlaceholder")}
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="w-full bg-gray-100 rounded-3xl px-6 py-5 outline-none resize-none transition-shadow focus:ring-2 focus:ring-(--dark-color)/20"
            />

            {/* Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sendLoading}
                className="bg-dark text-white px-8 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:shadow-lg disabled:opacity-50"
              >
                {sendLoading ? t("sending") : t("submit")}
              </button>
            </div>
          </form>
        </div>

        {/* ================= BOTTOM CONTACT INFO ================= */}
        {info && (
          <div className="grid md:grid-cols-3 gap-6">

            {/* Address */}
            <div className="bg-gray-100 p-8 rounded-3xl transition-all duration-300 group">
              <MapPin className="mb-4 text-gray-700 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" />
              <h4 className="text-lg font-semibold mb-2">{info.location}</h4>
              <p className="text-gray-600 text-sm">{t("addressDesc")}</p>
            </div>

            {/* Email */}
            <div className="bg-gray-200 p-8 rounded-3xl transition-all duration-300 group">
              <Mail className="mb-4 text-gray-700 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" />
              <h4 className="text-lg font-semibold mb-2">{info.email}</h4>
              <p className="text-gray-600 text-sm">{t("emailDesc")}</p>
            </div>

            {/* Phone */}
            <div className="bg-dark text-white p-8 rounded-3xl transition-all duration-300 group">
              <Phone className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" />
              <h4 className="text-lg font-semibold mb-2">{info.phoneNumber}</h4>
              <p className="text-white/80 text-sm">{t("phoneDesc")}</p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}