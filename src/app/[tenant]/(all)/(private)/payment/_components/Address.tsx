"use client";
import { Map, MapSelected } from "@/assets";
import { useTranslations } from "next-intl";
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { useEffect, useState } from "react"; // 👈 import useState
import {
  fetchUserAddressesPaginated,
  setDefaultAddress,
} from "@/rtk/slices/address/addressSlice";
import NoData from "@/components/noData/NoData";
import { Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Address() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  // Local state to track which address is being deleted (for loading spinner)
  const { setAddressInfo } = useCart();

  const { items, loading, mutateLoading } = useAppSelector((s) => s.address);

  // Fetch addresses on mount
  useEffect(() => {
    dispatch(fetchUserAddressesPaginated({}));
  }, [dispatch]);

  const handleMakeDefault = (id: number) => {
    dispatch(setDefaultAddress(id));
  };

  useEffect(() => {
    if (!loading && items.length > 0) {
      const defaultAddress = items.find((addr) => addr.isDefault);

      if (defaultAddress) {
        setAddressInfo(defaultAddress);
      }
    }
  }, [loading, items, setAddressInfo]);

  return (
    <div className="lg:col-span-2 space-y-8 p-6 rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-xl font-semibold text-gray-800 flex-1">{t("MyAddress")}</h2>
        <Link
          href={"/add-address"}
          className="text-main p-2 rounded-full transition-all duration-300 hover:bg-gray-100"
        >
          <Plus size={30} />
        </Link>
      </div>

      {/* Addresses List */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {loading ? (
          // Skeleton placeholders (with extra line for delete button)
          Array(3).fill(0).map((_, idx) => (
            <div key={idx} className="animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-xl bg-gray-200 gap-4 sm:gap-0">
              <div className="flex gap-3 sm:gap-4 items-start sm:items-center w-full sm:w-auto">
                <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
                <div className="flex flex-col flex-1 gap-1">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 rounded w-28"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <div className="w-20 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))
        ) : items.length > 0 ? (
          items.map(addr => (
            <div
              key={addr.id}
              className={`
                flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-xl bg-white 
                border border-gray-200 hover:border-main/30 hover:shadow-lg
                transition-all duration-300 ease-out ${!addr.isDefault && "cursor-pointer"}
                group active:scale-[0.995] gap-4 sm:gap-0
              `}
            >
              <div className='flex gap-3 sm:gap-4 items-start sm:items-center w-full sm:w-auto'>
                <div className="relative flex-shrink-0">
                  <Image
                    src={addr.isDefault ? MapSelected : Map}
                    alt="Map"
                    width={28}
                    height={28}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  {addr.isDefault && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-main rounded-full animate-pulse border border-white"></div>
                  )}
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  {/* City + Default badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-base text-gray-900 group-hover:text-main transition-colors">
                      {addr.city || t("NoCity")}
                    </span>
                    {addr.isDefault && (
                      <span className="text-xs bg-main/10 text-main px-2 py-0.5 rounded-full">
                        {t("Default")}
                      </span>
                    )}
                  </div>

                  {/* Governorate & Country */}
                  <span className="text-gray-600 text-sm">
                    {addr.governorate && `${addr.governorate}, `}{addr.country}
                  </span>

                  {/* Street address */}
                  {addr.houseNumberAndStreet && (
                    <span className="text-gray-500 text-sm">
                      {addr.houseNumberAndStreet}
                    </span>
                  )}

                  {/* Phone number with country code */}
                  {(addr.countryCode || addr.phoneNumber) && (
                    <span className="text-gray-500 text-sm">
                      {addr.phoneNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                {!addr.isDefault ? (
                  <button
                    className={`
                      text-sm font-medium 
                      px-4 py-2.5
                      bg-white hover:bg-main
                      text-main hover:text-white
                      border border-main hover:border-main
                      rounded-lg 
                      transition-all duration-300 ease-out
                      cursor-pointer
                      hover:shadow-md
                      active:scale-95
                      focus:outline-none focus:ring-2 focus:ring-main/30
                      w-full sm:w-auto text-center
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMakeDefault(addr.id);
                      setAddressInfo(addr)
                    }}
                    disabled={mutateLoading}
                  >
                    {t("UseThis")}
                  </button>
                ) : (
                  <div className="
                    text-main font-semibold text-sm sm:text-base 
                    bg-main/5 px-4 py-2
                    rounded-lg hidden sm:block
                    transition-all duration-300 group-hover:bg-main/10
                    w-full sm:w-auto text-center
                  ">
                    {t("Default")}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
}