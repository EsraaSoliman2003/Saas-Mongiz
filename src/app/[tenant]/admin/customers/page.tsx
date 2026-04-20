"use client"
import React, { useState } from "react";
import SectionHeader from "../_components/SectionHeader";
import CustomerFilterBar from "./_components/CustomerFilterBar";
import Customers from "./_components/Customers";
import { useTranslations } from "next-intl";

type Props = {};

export default function page({}: Props) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="p-4 md:p-8 space-y-6">
      <SectionHeader
        title={t("customersTitle")}
        subtitle={t("customersSubtitle")}
        buttonText={t("addCustomer")}
      />
      {/* <MenuStats /> */}
      <CustomerFilterBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Customers activeTab={activeTab} />
    </div>
  );
}
