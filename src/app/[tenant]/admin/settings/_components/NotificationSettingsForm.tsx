"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import ToggleSwitch from "../../_components/ToggleSwitch";
import { useTranslations } from "next-intl";

type NotificationSetting = {
  id: string;
  name: string;
  enabled: boolean;
};

export default function NotificationSettingsForm() {
  const t = useTranslations();

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: "new_order", name: t("newOrder"), enabled: true },
    { id: "order_cancel", name: t("orderCancel"), enabled: false },
    { id: "new_review", name: t("newReview"), enabled: true },
    { id: "low_stock", name: t("lowStockAlert"), enabled: true },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">

      <h2 className="text-lg font-bold text-gray-800 text-right">
        {t("notificationSettings")}
      </h2>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="
              flex items-center justify-between
              bg-gray-50 border border-gray-100
              rounded-2xl px-6 py-5
              hover:shadow-md
              transition-all duration-300
            "
          >
            <div className="flex items-center gap-3 text-right">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                <Bell size={18} />
              </div>

              <span className="font-semibold text-gray-800 text-sm">
                {item.name}
              </span>
            </div>

            <ToggleSwitch
              enabled={item.enabled}
              setEnabled={() => toggleNotification(item.id)}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
