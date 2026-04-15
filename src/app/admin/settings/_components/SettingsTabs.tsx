"use client";

import {
  Store,
  Truck,
  Globe,
  CreditCard,
  Bell,
  Shield,
  MapPin,
} from "lucide-react";
import { useTranslations } from "next-intl";

const tabs = [
  { key: "general", icon: Store },
  { key: "shipping", icon: Truck },
  { key: "identity", icon: Globe },
  { key: "payments", icon: CreditCard },
  { key: "notifications", icon: Bell },
  { key: "zones", icon: MapPin },
  { key: "security", icon: Shield },
];

export default function SettingsTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  const t = useTranslations();

  return (
    <div className="flex flex-wrap gap-3 justify-center xl:justify-start">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium
              transition-all duration-300 cursor-pointer
              ${
                activeTab === tab.key
                  ? "bg-main text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            <Icon size={16} />
            {t(tab.key)}
          </button>
        );
      })}
    </div>
  );
}
