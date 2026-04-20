"use client";
import React, { useEffect } from "react";
import { Pencil, Trash2, Mail, Phone, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { deleteUser, fetchUsers, User } from "@/rtk/slices/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import Image from "next/image";
import LoadingSpinner from "../../_components/LoadingSpinner";
import { Seller } from "@/rtk/slices/seller/sellerSlice";
import { toast } from "sonner";

interface Props {
  activeTab: string;
}

function isSeller(customer: Seller | User): customer is Seller {
  return "phone" in customer;
}

export default function Customers({ activeTab }: Props) {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, pageSize: 50 }));
  }, [dispatch]);

  const { users, loading: usersLoading } = useAppSelector((s) => s.users);
  const { allSellers, pending, loading } = useAppSelector((state) => state.seller);

  const data = activeTab === "vendors" ? allSellers : activeTab === "pendingVendors" ? pending : (activeTab === "users" || activeTab === "all") ? users : [];

  const handleApproveVendor = (id: number) => {
    try {
      toast(t("vendorAccepted"));
    } catch (error) {
    }
  }

  const handleDelete = async (id: any) => {
    toast.custom((toastId) => (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-[340px] space-y-4">

        {/* Message */}
        <p className="text-sm font-medium leading-relaxed text-gray-800">
          {t("deleteConfirmUser")}
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-900 text-sm hover:bg-gray-300 transition"
            onClick={() => toast.dismiss(toastId)}
          >
            {t("Cancel")}
          </button>

          <button
            type="button"
            className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition"
            onClick={async () => {
              toast.dismiss(toastId);
              try {
                await dispatch(deleteUser(id.toString())).unwrap();
                toast.success(t("userDeletedSuccessfully"));
              } catch (e) {
                toast.error(typeof e === "string" ? e : t("failedToDeleteUser"));
              }
            }}
          >
            {t("Delete")}
          </button>
        </div>
      </div>
    ));
  };

  if (usersLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* ---------- Table (Desktop) ---------- */}
      <div className="hidden md:block">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-6 py-4 text-sm font-semibold text-gray-500 bg-gray-50">
          <div className="col-span-3">{t("customer")}</div>
          <div className="col-span-3">{t("email")}</div>
          <div className="col-span-4">{t("phone")}</div>
          <div className="col-span-2">{t("actions")}</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {data.map((customer) => (
            <div
              key={customer.id}
              className="grid grid-cols-12 px-6 py-5 items-center hover:bg-gray-50 transition duration-300"
            >
              {/* Customer */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {/* {customer.imageUrl ? (
                    <Image
                      src={customer.imageUrl}
                      alt={customer.fullName}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : ( */}
                  <div className="w-full h-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {customer.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  {/* )} */}
                </div>
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {
                    isSeller(customer)
                      ? customer.fullName ?? customer.name ?? "—"
                      : customer.fullName ?? "—"
                  }
                </p>
              </div>

              {/* Email */}
              <div className="col-span-3 text-gray-600 text-sm truncate">
                {customer.email}
              </div>

              {/* Phone */}
              <div className="col-span-4 text-gray-600 text-sm">
                {isSeller(customer)
                  ? customer.phone
                  : customer.phoneNumber || "—"}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center gap-4 text-gray-400">
                <Pencil
                  size={18}
                  className="cursor-pointer hover:text-gray-700 transition"
                />
                <Trash2
                  size={18}
                  className="cursor-pointer hover:text-red-500 transition"
                  onClick={() => handleDelete(customer.id)}
                />
                {
                  isSeller(customer) && !customer.isApproved && (
                    <CheckCircle
                      size={18}
                      className="cursor-pointer hover:text-green-600 text-green-500 transition"
                      onClick={() => {
                        if (!customer.id) return;
                        handleApproveVendor(customer.id);
                      }}
                    />
                  )
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Cards (Mobile) ---------- */}
      <div className="block md:hidden p-4 space-y-4">
        {data.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
          >
            {/* Header with avatar and name */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {/* {customer.imageUrl ? (
                  <Image
                    src={customer.imageUrl}
                    alt={customer.fullName}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : ( */}
                <div className="w-full h-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {customer.fullName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                {/* )} */}
              </div>
              <p className="font-semibold text-gray-800">
                {
                  isSeller(customer)
                    ? customer.fullName ?? customer.name ?? "—"
                    : customer.fullName ?? "—"
                }
              </p>
            </div>

            {/* Contact details */}
            <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} className="text-gray-400" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <span>
                  {isSeller(customer)
                    ? customer.phone
                    : customer.phoneNumber || "—"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-5 pt-3 border-t border-gray-100 text-gray-400">
              <Pencil
                size={18}
                className="cursor-pointer hover:text-gray-700 transition"
              />
              <Trash2
                size={18}
                className="cursor-pointer hover:text-red-500 transition"
              />
              {
                isSeller(customer) && !customer.isApproved && (
                  <CheckCircle
                    size={18}
                    className="cursor-pointer hover:text-green-600 text-green-500 transition"
                    onClick={() => {
                      if (!customer.id) return;
                      handleApproveVendor(customer.id);
                    }}
                  />
                )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}