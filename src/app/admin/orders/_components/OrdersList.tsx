"use client";

import React, { useEffect } from "react";
import OrderItem from "./OrderItem";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchOrdersPaginated } from "@/rtk/slices/orders/ordersSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function OrdersList() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const sp = useSearchParams();

  const { items, loading, currentPage, pageCount } = useAppSelector(
    (s) => s.order
  );

  const pageSize = 12;
  const pageQuery = Number(sp.get("page") || currentPage || 1);

  useEffect(() => {
    dispatch(fetchOrdersPaginated({ page: pageQuery, pageSize }));
  }, [dispatch, pageQuery]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", newPage.toString());
    router.replace(`?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => handlePageChange(pageQuery - 1)}
          disabled={pageQuery === 1}
          className="px-4 py-2 rounded border hover:bg-gray-100 transition disabled:opacity-50"
        >
          {t("Previous")}
        </button>

        <span className="px-2 py-2">
          {pageQuery} / {pageCount}
        </span>

        <button
          onClick={() => handlePageChange(pageQuery + 1)}
          disabled={pageQuery === pageCount}
          className="px-4 py-2 rounded border hover:bg-gray-100 transition disabled:opacity-50"
        >
          {t("Next")}
        </button>
      </div>
    </div>
  );
}