"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import ToggleSwitch from "../../_components/ToggleSwitch";
import { useTranslations } from "next-intl";

type PaymentMethod = {
  id: string;
  name: string;
  enabled: boolean;
};

export default function PaymentMethodsForm() {
  const t = useTranslations();

  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: "cod", name: t("cashOnDelivery"), enabled: true },
    { id: "wallet", name: t("wallet"), enabled: false },
    { id: "instapay", name: t("instapay"), enabled: true },
    { id: "card", name: t("bankCard"), enabled: true },
  ]);

  const toggleMethod = (id: string) => {
    setMethods((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, enabled: !m.enabled } : m
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">

      <h2 className="text-lg font-bold text-gray-800 text-right">
        {t("paymentMethods")}
      </h2>

      <div className="space-y-4">
        {methods.map((method) => (
          <div
            key={method.id}
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
                <CreditCard size={18} />
              </div>

              <span className="font-semibold text-gray-800 text-sm">
                {method.name}
              </span>
            </div>

            <ToggleSwitch
              enabled={method.enabled}
              setEnabled={() => toggleMethod(method.id)}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
