"use client";

import { useState } from "react";
import { Trash2, Map } from "lucide-react";
import ToggleSwitch from "../../_components/ToggleSwitch";
import MainButton from "@/components/MainButton/MainButton";
import { useTranslations } from "next-intl";

type Zone = {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
};

export default function DeliveryZonesForm() {
  const t = useTranslations();

  const [zones, setZones] = useState<Zone[]>([
    { id: "1", name: t("cairo"), price: 25, enabled: true },
    { id: "2", name: t("giza"), price: 30, enabled: true },
    { id: "3", name: t("alexandria"), price: 40, enabled: false },
  ]);

  const toggleZone = (id: string) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === id ? { ...z, enabled: !z.enabled } : z
      )
    );
  };

  const deleteZone = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          {t("deliveryZones")}
        </h2>

        <MainButton text={t("addNewZone")} className="w-auto" />
      </div>

      {/* Zones */}
      <div className="space-y-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="
              flex items-center justify-between
              bg-gray-50 border border-gray-100
              rounded-2xl px-6 py-5
              hover:shadow-md
              transition-all duration-300
            "
          >
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                <Map size={18} />
              </div>

              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {zone.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {zone.price} {t("currency")} {t("deliveryFee")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400">
              <ToggleSwitch
                enabled={zone.enabled}
                setEnabled={() => toggleZone(zone.id)}
              />

              <Trash2
                size={18}
                className="cursor-pointer hover:text-red-500 transition-colors duration-200"
                onClick={() => deleteZone(zone.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
