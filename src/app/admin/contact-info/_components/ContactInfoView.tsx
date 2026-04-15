import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { useTranslations } from "next-intl";

interface Props {
    data: any;
    onEdit: () => void;
}

const ContactInfoView = ({ data, onEdit }: Props) => {
    const t = useTranslations();

    return (
        <div className="rounded-xl bg-white box-shadow overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 rounded-xl py-4 border border-gray-200 border-gray-200">
                <div>
                    <p className="text-sm text-gray-500">{t("Contact Info")}</p>
                    <h3 className="text-base font-semibold text-gray-900">{t("Main Details")}</h3>
                </div>

                <button
                    onClick={onEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition"
                >
                    <FiEdit2 />
                    {t("Edit")}
                </button>
            </div>

            {/* Content */}
            <div className="p-6 grid md:grid-cols-3 gap-6 text-center">
                {/* Location */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">{t("Location")}</span>
                    <p
                        className="text-sm text-gray-900 mt-1 truncate max-w-[200px]"
                        title={data.location}
                    >
                        {data.location || "-"}
                    </p>
                </div>

                {/* Phone */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">{t("Phone")}</span>
                    <a
                        href={data.phoneNumber ? `tel:${data.phoneNumber}` : "#"}
                        className="text-sm text-gray-900 hover:text-main mt-1"
                    >
                        {data.phoneNumber || "-"}
                    </a>
                </div>

                {/* Email */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">{t("Email")}</span>
                    <a
                        href={data.email ? `mailto:${data.email}` : "#"}
                        className="text-sm text-gray-900 hover:text-main mt-1 truncate max-w-[200px]"
                        title={data.email}
                    >
                        {data.email || "-"}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactInfoView;
