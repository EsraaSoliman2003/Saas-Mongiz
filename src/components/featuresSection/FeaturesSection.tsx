"use client";

import { delivery, money, support } from "@/assets";
import { useTranslations } from "next-intl";
import Image from "next/image";

const FeaturesSection = () => {
    const t = useTranslations();
    return (
        <section className="container py-12 px-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                {/* الكارد الأول */}
                <div className="group flex flex-col items-center text-center p-6 rounded-xl border border-[#ddd] bg-white
                        transition-all duration-200 hover:shadow-md">
                    <Image
                        src={support}
                        alt="support"
                        width={50}
                        height={50}
                        className="transition-transform duration-200 group-hover:scale-105"
                    />
                    <h3 className="font-bold text-lg mb-2 transition-colors group-hover:text-(--main-color)">
                        {t("support")}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-45">
                        {t("supportDescription")}
                    </p>
                </div>

                {/* الكارد الثاني */}
                <div className="group flex flex-col items-center text-center p-6 rounded-xl border border-[#ddd] bg-white
                        transition-all duration-200 hover:shadow-md">
                    <Image
                        src={money}
                        alt="money"
                        width={50}
                        height={50}
                        className="transition-transform duration-200 group-hover:scale-105"
                    />
                    <h3 className="font-bold text-lg mb-2 transition-colors group-hover:text-(--main-color)">
                        {t("cashback")}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-45">
                        {t("cashbackDescription")}
                    </p>
                </div>

                {/* الكارد الثالث */}
                <div className="group flex flex-col items-center text-center p-6 rounded-xl border border-[#ddd] bg-white
                        transition-all duration-200 hover:shadow-md">
                    <Image
                        src={delivery}
                        alt="delivery"
                        width={50}
                        height={50}
                        className="transition-transform duration-200 group-hover:scale-105"
                    />
                    <h3 className="font-bold text-lg mb-2 transition-colors group-hover:text-(--main-color)">
                        {t("delivery")}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-24">
                        {t("deliveryDescription")}
                    </p>
                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;
