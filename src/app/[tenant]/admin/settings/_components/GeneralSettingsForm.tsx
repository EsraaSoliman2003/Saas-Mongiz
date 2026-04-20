"use client";

import { useTranslations } from "next-intl";

export default function GeneralSettingsForm() {
  const t = useTranslations();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
      <h2 className="text-lg font-bold text-gray-800 mb-6">
        {t("generalSettings")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <InputField
          label={t("storeName")}
          placeholder="Demo Electronics Store"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            {t("subdomain")}
          </label>

          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden mt-1">
            <span className="px-4 py-3 text-sm text-gray-400 border-l border-gray-200 bg-white">
              mothmr
            </span>
            <input
              type="text"
              placeholder="demo"
              className="w-full bg-transparent px-4 py-3 outline-none text-sm text-gray-700"
            />
          </div>
        </div>

        <InputField
          label={t("phoneNumber")}
          placeholder="+20 100 000 0000"
        />

        <InputField
          label={t("whatsapp")}
          placeholder="+20 100 000 0000"
        />

        <InputField
          label={t("email")}
          placeholder="demo@baseet.cc"
        />

        <InputField
          label={t("currency")}
          placeholder="EGP - Egyptian Pound"
        />
      </div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        className="
          w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3
          text-sm text-gray-700 outline-none mt-1
          focus:border-main focus:ring-2 focus:ring-(--main-color)/10
          transition-all duration-300
        "
      />
    </div>
  );
}
