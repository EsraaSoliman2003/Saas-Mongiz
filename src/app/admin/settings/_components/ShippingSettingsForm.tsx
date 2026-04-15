"use client";

import { useState } from "react";
import ToggleSwitch from "../../_components/ToggleSwitch";
import { useTranslations } from "next-intl";

export default function ShippingSettingsForm() {
  const t = useTranslations();

  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [pickupEnabled, setPickupEnabled] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">

      <h2 className="text-lg font-bold text-gray-800 mb-6">
        {t("shippingSettings")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="border border-dashed border-gray-200 rounded-2xl p-5 flex items-start justify-between hover:shadow-md transition-all duration-300">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">
              {t("enableDelivery")}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {t("enableDeliveryDesc")}
            </p>
          </div>

          <ToggleSwitch enabled={deliveryEnabled} setEnabled={setDeliveryEnabled} />
        </div>

        <div className="border border-dashed border-gray-200 rounded-2xl p-5 flex items-start justify-between hover:shadow-md transition-all duration-300">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">
              {t("enablePickup")}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {t("enablePickupDesc")}
            </p>
          </div>

          <ToggleSwitch enabled={pickupEnabled} setEnabled={setPickupEnabled} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            {t("freeDeliveryLimit")}
          </label>

          <input
            type="number"
            className="
              w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3
              text-sm text-gray-700 outline-none
              focus:border-main focus:ring-2 focus:ring-(--main-color)/10
              transition-all duration-300 mt-1
            "
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            {t("extraDeliveryFees")}
          </label>

          <input
            type="number"
            className="
              w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3
              text-sm text-gray-700 outline-none
              focus:border-main focus:ring-2 focus:ring-(--main-color)/10
              transition-all duration-300 mt-1
            "
          />
        </div>

      </div>
    </div>
  );
}
