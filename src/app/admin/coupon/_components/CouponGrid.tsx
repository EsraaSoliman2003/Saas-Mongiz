"use client";
import AdminGridLayout from "@/components/adminGridLayout/AdminGridLayout";
import AdminSectionHeader from "@/components/adminSectionHeader/AdminSectionHeader";
import { useAppSelector } from "@/rtk/hooks";
import { useTranslations } from "next-intl";
import CouponCard from "./CouponCard";
import LoadingSpinner from "../../_components/LoadingSpinner";

const CouponGrid = () => {
    const t = useTranslations();
    const { data, loading } = useAppSelector((state) => state.coupon);

    return (
        <>
            <AdminSectionHeader
                title={t("Coupon")}
                addHref="/admin/coupon/create"
            />
            <div className="relative">
                <AdminGridLayout isEmpty={!loading && data != null && data.length === 0}>
                    {
                        data?.map((item) => (
                            <CouponCard
                                key={item.id}
                                id={item.id}
                                code={item.code}
                                discount={item.discount}
                            />
                        ))
                    }
                </AdminGridLayout>
                {loading && (
                    <div className="absolute inset-0 z-10 grid place-items-center bg-white/60">
                        <LoadingSpinner />
                    </div>
                )}
            </div>
        </>
    );

};

export default CouponGrid;
