"use client";

import { useState } from "react";
import ToggleSwitch from "../../_components/ToggleSwitch";
import { useTranslations } from "next-intl";

export default function SecuritySettingsForm() {
  const t = useTranslations();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">

      <h2 className="text-lg font-bold text-gray-800">
        {t("security")}
      </h2>

      {/* Two Factor Authentication */}
      <div
        className="
          flex items-center justify-between
          bg-gray-50 border border-gray-100
          rounded-2xl px-6 py-5
          hover:shadow-md
          transition-all duration-300
        "
      >
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {t("twoFactorAuth")}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {t("twoFactorDesc")}
            </p>
          </div>
        </div>

        <ToggleSwitch
          enabled={twoFactorEnabled}
          setEnabled={() => setTwoFactorEnabled(!twoFactorEnabled)}
        />
      </div>

      {/* Change Password */}
      <div
        className="
          flex items-center justify-between
          bg-gray-50 border border-gray-100
          rounded-2xl px-6 py-5
          hover:shadow-md
          transition-all duration-300
        "
      >
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {t("changePassword")}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {t("lastPasswordChange")}
            </p>
          </div>
        </div>

        <button className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg hover:opacity-90 transition cursor-pointer">
          {t("change")}
        </button>
      </div>

      {/* Active Sessions */}
      <div
        className="
          bg-gray-50 border border-gray-100
          rounded-2xl px-6 py-5
          hover:shadow-md
          transition-all duration-300
        "
      >
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-gray-800 text-sm text-right">
            {t("activeSessions")}
          </p>
        </div>

        <div className="space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm text-gray-600">
              chrome on windows · cairo, egypt
            </span>

            <span className="text-green-600 font-medium text-sm">
              {t("currentSession")}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm text-gray-600">
              safari on iphone · cairo, egypt
            </span>

            <button className="text-red-500 hover:underline text-xs font-medium cursor-pointer text-right">
              {t("endSession")}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
