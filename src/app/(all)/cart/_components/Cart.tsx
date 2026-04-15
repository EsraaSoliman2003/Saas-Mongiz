"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { plus, minus } from "@/assets";
import { useTranslations } from "next-intl";
import { useCart } from "@/hooks/useCart";
import NoData from "@/components/noData/NoData";
import { useAppSelector } from "@/rtk/hooks";

export default function Cart() {
  const t = useTranslations();
  const { items, remove, updateQty } = useCart();
  const { data } = useAppSelector((s) => s.currency)
  const { currency } = useAppSelector((s) => s.currencyValue)
  return (
    <div className="lg:mb-30">
      <h2 className="text-xl font-semibold mb-6">{t("Cart")}</h2>

      {
        items && items.length > 0 ? (
          <>
            {/* ================= Desktop Header ================= */}
            <div className="hidden lg:grid grid-cols-12 text-md font-medium border-b border-[#F5F7FA] pb-3">
              <span className="col-span-5 pr-10">{t("Product")}</span>
              <span className="col-span-2 text-center">{t("Price")}</span>
              <span className="col-span-2 text-center">{t("Quantity")}</span>
              <span className="col-span-2 text-center">{t("Total")}</span>
            </div>

            {/* ================= Desktop Layout ================= */}
            <div className="hidden lg:block">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedOptions.type?.id ?? 0}-${item.selectedOptions.color?.name ?? 0}-${item.selectedOptions.weight?.name ?? 0}-${item.selectedOptions.size?.name ?? 0}-${item.selectedOptions.shape?.name ?? 0}-${item.selectedOptions.volume?.name ?? 0}-${item.selectedOptions.memory?.name ?? 0}`}
                  className="grid grid-cols-12 items-center py-5 border-b border-gray-100 text-sm"
                >
                  {/* Product (col-span-6 to leave room for other columns) */}
                  <div className="col-span-6 flex items-center gap-3">
                    <button
                      onClick={() => remove(item.id, item.selectedOptions)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                      aria-label="Remove item"
                    >
                      <X size={18} />
                    </button>

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover bg-gray-50"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{item.name}</p>

                      {/* Options as inline tags */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                        {item.selectedOptions.type?.name && (
                          <span>{item.selectedOptions.type.name}</span>
                        )}
                        {item.selectedOptions.color && (
                          <div className="flex items-center gap-1">
                            <span
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.selectedOptions.color.name || 'transparent' }}
                              aria-label={`Color: ${item.selectedOptions.color.name}`}
                            />
                          </div>
                        )}
                        {item.selectedOptions.size && (
                          <span>{item.selectedOptions.size.name}</span>
                        )}
                        {item.selectedOptions.volume && (
                          <span>{item.selectedOptions.volume.name}</span>
                        )}
                        {item.selectedOptions.shape && (
                          <span>{item.selectedOptions.shape.name}</span>
                        )}
                        {item.selectedOptions.weight && (
                          <span>{item.selectedOptions.weight.name}</span>
                        )}
                        {item.selectedOptions.memory && (
                          <span>{item.selectedOptions.memory.name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <span className="col-span-2 text-center text-gray-600">
                    {Number(item.price * (data?.[currency || "USD"] ?? 1)).toFixed(2)}
                    <span className="text-sm">{t("EGP")}</span>
                  </span>

                  {/* Quantity */}
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <button
                      onClick={() => updateQty(item.id, item.selectedOptions, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Image src={minus} alt="" width={12} height={12} />
                    </button>

                    <span className="w-10 h-8 flex items-center justify-center border border-gray-300 rounded-md font-medium text-gray-700">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => updateQty(item.id, item.selectedOptions, item.qty + 1)}
                      disabled={item.maxQty ? item.qty >= item.maxQty : false}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Image src={plus} alt="" width={12} height={12} />
                    </button>
                  </div>

                  {/* Total */}
                  <span className="col-span-2 text-center font-medium text-gray-900">
                    {(item.price * item.qty * (data?.[currency || "USD"] ?? 1)).toFixed(2)}
                    <span className="text-sm">{t("EGP")}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* ================= Mobile Layout ================= */}
            <div className="lg:hidden space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedOptions.type?.id ?? 0}-${item.selectedOptions.color?.name ?? 0}-${item.selectedOptions.weight?.name ?? 0}-${item.selectedOptions.size?.name ?? 0}-${item.selectedOptions.shape?.name ?? 0}-${item.selectedOptions.volume?.name ?? 0}-${item.selectedOptions.memory?.name ?? 0}`}
                  className="border border-gray-100 rounded-xl p-4 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <span className="text-gray-400 text-xs">
                        {item.selectedOptions.type?.name}
                      </span>
                    </div>

                    <button
                      onClick={() => remove(item.id, item.selectedOptions)}
                      className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="text-gray-400 text-xs flex flex-wrap gap-2 justify-center">
                    {item.selectedOptions.type?.name && (
                      <span>{item.selectedOptions.type.name}</span>
                    )}
                    {item.selectedOptions.color && (
                      <div className="flex items-center gap-1">
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.selectedOptions.color.name || 'transparent' }}
                          aria-label={`Color: ${item.selectedOptions.color.name}`}
                        />
                      </div>
                    )}
                    {item.selectedOptions.size && (
                      <span>{item.selectedOptions.size.name}</span>
                    )}
                    {item.selectedOptions.volume && (
                      <span>{item.selectedOptions.volume.name}</span>
                    )}
                    {item.selectedOptions.shape && (
                      <span>{item.selectedOptions.shape.name}</span>
                    )}
                    {item.selectedOptions.weight && (
                      <span>{item.selectedOptions.weight.name}</span>
                    )}
                    {item.selectedOptions.memory && (
                      <span>{item.selectedOptions.memory.name}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span>{t("Quantity")}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQty(item.id, item.selectedOptions, item.qty - 1)
                        }
                        disabled={item.qty <= 1}
                      >
                        <Image src={minus} alt="minus" width={16} height={16} />
                      </button>

                      <span>{item.qty}</span>

                      <button
                        onClick={() =>
                          updateQty(item.id, item.selectedOptions, item.qty + 1)
                        }
                      >
                        <Image src={plus} alt="plus" width={16} height={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between font-bold">
                    <span>{t("Total")}</span>
                    <span>
                      {(item.price * item.qty * (data?.[currency || "USD"] ?? 1)).toFixed(2)}
                      <span className="text-sm">{t("EGP")}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
          : (<NoData />)
      }
    </div>
  );
}