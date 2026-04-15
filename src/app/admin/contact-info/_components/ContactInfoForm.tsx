import React from "react";
import { useTranslations } from "next-intl";

interface Props {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ContactInfoForm = ({ formData, onChange, onSave, onCancel }: Props) => {
  const t = useTranslations();

  return (
    <div className="rounded-xl bg-white box-shadow overflow-hidden p-6">
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">{t("Location")}</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-main/30"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">{t("Phone Number")}</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-main/30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">{t("Email")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-main/30"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
            {t("Cancel")}
          </button>
          <button onClick={onSave} className="px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition">
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoForm;
