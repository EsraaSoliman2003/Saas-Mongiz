import React from "react";
import SectionHeader from "../_components/SectionHeader";
import { useTranslations } from "next-intl";
import MenuStats from "./_components/MenuStats";
import OrdersFilterBar from "./_components/OrdersFilterBar";
import OrdersList from "./_components/OrdersList";

type Props = {};

export default function page({ }: Props) {
    const t = useTranslations();

    return (
        <div className="p-4 md:p-8 space-y-6">
            <SectionHeader
                title={t("Orders")}
                subtitle={t("ordersSubtitle")}
            />
            {/* <MenuStats /> */}
            {/* <OrdersFilterBar /> */}
            <OrdersList />
        </div>
    );
}
