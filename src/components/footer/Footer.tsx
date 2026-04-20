"use client";

import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/rtk/hooks";

const Footer = () => {
    const t = useTranslations();
        const { data, loading } = useAppSelector((s) => s.settings)

    return (
        <footer className={`bg-dark text-[#B7B9C6] text-center ${t("dir") === "rtl" ? "md:text-right" : "md:text-left"}`}>
            <div className="container py-16 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 items-start">

                    {/* Logo */}
                    <div className="flex md:col-span-2 lg:col-span-1 items-center mt-5 justify-center md:justify-start">
                        {
                            loading ? (
                                <div className="w-52 h-20 bg-gray-700 animate-pulse rounded"></div>
                            ) : (
                                <Image
                                    src={data?.logoDark || "/default-logo.png"}
                                    alt="Mongiz"
                                    width={270}
                                    height={100}
                                />
                            )
                        }
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold mb-6 text-white text-sm">{t("Contact Us")}</h4>
                        <ul className="space-y-5 text-sm">
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <MapPin size={18} />
                                <span>{t("Salah Salem Street, Cairo")}</span>
                            </li>
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <Phone size={18} />
                                <span className="text-(--main-color)">01234484855</span>
                            </li>
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <Mail size={18} />
                                <span className="text-(--main-color)">admin@ftribe.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* التعاون - الجمعية */}
                    <div>
                        <h4 className="font-bold mb-6 text-white text-sm">
                            {t("Cooperation - Association")}
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li className="hover:text-(--main-color) cursor-pointer">
                                {t("European Currency Exchange Operating Regulations")}
                            </li>
                            <li className="hover:text-(--main-color) cursor-pointer">
                                {t("Advertising Policy")}
                            </li>
                            <li className="hover:text-(--main-color) cursor-pointer">
                                {t("Privacy Policy")}
                            </li>
                        </ul>
                    </div>

                    {/* دعم العملاء */}
                    <div>
                        <h4 className="font-bold mb-6 text-white text-sm">{t("Customer Support")}</h4>
                        <ul className="space-y-4 text-sm">
                            <li>{t("Hotline Customer Service")}</li>
                            <li className="text-(--main-color) font-medium">
                                212 929 9953
                            </li>
                            <li className="hover:text-(--main-color) cursor-pointer">
                                {t("FAQ")}
                            </li>
                            <li className="hover:text-(--main-color) cursor-pointer">
                                {t("Submit a Support Request")}
                            </li>
                            <li className="hover:text-(--main-color) cursor-pointer">
                                {t("Order Guide")}
                            </li>
                            <li className="hover:text-(--main-color) cursor-pointer">
                                {t("Shipping Methods")}
                            </li>
                        </ul>
                    </div>

                    {/* دليل الشراء */}
                    <div>
                        <h4 className="font-bold mb-6 text-white text-sm">
                            {t("Buying & Installment Guide")}
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li className="hover:text-(--main-color) cursor-pointer">
                                {t("Exchange Policy")}
                            </li>
                            <li className="hover:text-(--main-color) cursor-pointer">
                                {t("Customer Service")}
                                <br />
                                <span className="text-(--main-color)">customers@ftribe.com</span>

                            </li>
                            <li className="hover:text-(--main-color) cursor-pointer">
                                {t("Technical Issue Reports")}
                                <br />
                                <span className="text-(--main-color)">admin@ftribe.com</span>

                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
