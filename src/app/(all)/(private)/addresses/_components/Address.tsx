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
  deleteAddress
} from "@/rtk/slices/address/addressSlice";
import NoData from "@/components/noData/NoData";
import { toast } from "sonner";

export default function Address() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  // Local state to track which address is being deleted (for loading spinner)
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { items, loading, mutateLoading } = useAppSelector((s) => s.address);

  // Fetch addresses on mount
  useEffect(() => {
    dispatch(fetchUserAddressesPaginated({}));
  }, [dispatch]);

  const handleMakeDefault = (id: number) => {
    dispatch(setDefaultAddress(id));
  };

  // Delete handler with toast confirmation
  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.custom((tId) => (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[280px]">
        <p className="mb-4 text-gray-700">{t("ConfirmDeleteAddress")}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              setDeletingId(id); // 👈 set loading state
              toast.dismiss(tId);
              dispatch(deleteAddress(id))
                .finally(() => setDeletingId(null)); // 👈 clear loading when done
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
          >
            {t("Yes")}
          </button>
          <button
            onClick={() => toast.dismiss(tId)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
          >
            {t("No")}
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-xl font-semibold text-gray-800 flex-1">{t("MyAddress")}</h2>
        <Link
          href={"/add-address"}
          className="px-10 py-3 rounded-lg text-sm font-medium transition-all duration-300 
          bg-main text-white hover:bg-main/90 hover:shadow-lg active:scale-95 
          cursor-pointer text-center shadow-sm"
        >
          {t("AddAddress")}
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
                      ${(mutateLoading || deletingId !== null) ? 'opacity-50 pointer-events-none' : ''}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMakeDefault(addr.id);
                    }}
                    disabled={mutateLoading || deletingId !== null}
                  >
                    {t("MakeDefault")}
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

                {/* Delete button with loading spinner */}
                <button
                  onClick={(e) => handleDelete(addr.id, e)}
                  disabled={mutateLoading || deletingId !== null}
                  className={`
                    p-2.5 rounded-lg
                    bg-white hover:bg-red-50
                    text-gray-500 hover:text-red-600
                    border border-gray-200 hover:border-red-200
                    transition-all duration-300
                    cursor-pointer
                    hover:shadow-md
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-red-500/30
                    ${(mutateLoading || deletingId !== null) ? 'opacity-50 pointer-events-none' : ''}
                  `}
                  aria-label={t("Delete")}
                >
                  {deletingId === addr.id ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <NoData />
        )}
      </div>
    </>
  );
}