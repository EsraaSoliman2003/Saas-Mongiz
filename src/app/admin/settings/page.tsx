// "use client";

// import { useState } from "react";
// import SectionHeader from "../_components/SectionHeader";
// import SettingsTabs from "./_components/SettingsTabs";
// import GeneralSettingsForm from "./_components/GeneralSettingsForm";
// import ShippingSettingsForm from "./_components/ShippingSettingsForm";
// import VisualIdentityForm from "./_components/VisualIdentityForm";
// import PaymentMethodsForm from "./_components/PaymentMethodsForm";
// import NotificationSettingsForm from "./_components/NotificationSettingsForm";
// import SecuritySettingsForm from "./_components/SecuritySettingsForm";
// import DeliveryZonesForm from "./_components/DeliveryZonesForm";
// import { useTranslations } from "next-intl";

// export default function SettingsPage() {
//   const t = useTranslations();
//   const [activeTab, setActiveTab] = useState("general");

//   const renderContent = () => {
//     switch (activeTab) {
//       case "general":
//         return <GeneralSettingsForm />;
//       case "shipping":
//         return <ShippingSettingsForm />;
//       case "identity":
//         return <VisualIdentityForm />;
//       case "payments":
//         return <PaymentMethodsForm />;
//       case "notifications":
//         return <NotificationSettingsForm />;
//       case "zones":
//         return <DeliveryZonesForm />;
//       case "security":
//         return <SecuritySettingsForm />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="p-4 md:p-8 space-y-6">
//       <SectionHeader
//         title={t("settingsTitle")}
//         subtitle={t("settingsSubtitle")}
//         buttonText={t("saveChanges")}
//       />

//       <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

//       {renderContent()}
//     </div>
//   );
// }

import { useTranslations } from 'next-intl';
import React from 'react';
import SectionHeader from '../_components/SectionHeader';
import LogoCard from './_components/LogoCard';
import ColorCard from './_components/ColorCard';
import SubDomainCard from './_components/SubDomainCard';

export default function Page() {
  const t = useTranslations();

  return (
    <div className="p-4 md:p-8 space-y-6">
      <SectionHeader title={t("settingsTitle")} subtitle={t("settingsSubtitle")} />

      <div className="space-y-6">
        <LogoCard />
        <ColorCard />
        <SubDomainCard />
      </div>
    </div>
  );
}