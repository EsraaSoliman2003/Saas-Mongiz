"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function VisualIdentityForm() {
  const t = useTranslations();
  const [primaryColor, setPrimaryColor] = useState("#0723F9");

  const presetColors = [
    "#F97316",
    "#EF4444",
    "#0EA5E9",
    "#8B5CF6",
    "#10B981",
    "#2563EB",
    "#6366F1",
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-8">

      <h2 className="text-lg font-bold text-gray-800">
        {t("visualIdentity")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadBox label={t("storeLogo")} />
        <UploadBox label={t("coverImage")} />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-600">
          {t("primaryColor")}
        </label>

        <div className="flex items-center gap-4 flex-wrap mt-2">
          <div
            className="w-10 h-10 rounded-lg border border-gray-200"
            style={{ backgroundColor: primaryColor }}
          />

          <input
            type="text"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="
              w-32 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2
              text-sm text-gray-700 outline-none text-left
              focus:border-main focus:ring-2 focus:ring-(--main-color)/10
              transition-all duration-300
            "
          />

          <div className="flex gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => setPrimaryColor(color)}
                className="w-8 h-8 rounded-full border-2 transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor: color,
                  borderColor: primaryColor === color ? "#111" : "transparent",
                }}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

function UploadBox({ label }: { label: string }) {
  const t = useTranslations();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>

      <div
        className="
          border border-dashed border-gray-200
          rounded-2xl p-8 mt-1
          flex flex-col items-center justify-center
          text-gray-400
          hover:border-main hover:bg-gray-50
          transition-all duration-300
          cursor-pointer
        "
      >
        <Upload size={28} />
        <p className="text-sm mt-3">
          {t("uploadHint")}
        </p>
      </div>
    </div>
  );
}
