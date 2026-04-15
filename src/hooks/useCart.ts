"use client";

import { useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import {
  CartItem,
  SelectedOptions,
  setCart,
  addOrOverwrite,
  setQty,
  removeItem,
  clearCart,
  setAddress,
  setCoupon,
  Address,
} from "@/rtk/slices/ui/cartSlice";

const COOKIE = "addcart";

export function useCart() {
  const dispatch = useAppDispatch();
  const { items, hydrated, address, coupon } = useAppSelector((s) => s.cart);

  // Load cart from cookie on mount
  useEffect(() => {
    const data = getCookie(COOKIE);
    if (data) {
      dispatch(setCart(JSON.parse(String(data))));
    } else {
      dispatch(setCart([]));
    }
  }, [dispatch]);

  // Save cart to cookie whenever items change
  useEffect(() => {
    if (!hydrated) return;
    setCookie(COOKIE, JSON.stringify(items), { path: "/" });
  }, [items, hydrated]);

  // Generate key for each product + options
  const getKey = (id: number, options: SelectedOptions) =>
    `${id}-${options.type?.id ?? 0}-${options.color?.name ?? 0}-${options.size?.name ?? 0}-${options.volume?.name ?? 0}-${options.shape?.name ?? 0}-${options.weight?.name ?? 0}-${options.memory?.name ?? 0}`;

  const hasItem = (id: number, options: SelectedOptions) =>
    items.some((item) => getKey(item.id, item.selectedOptions) === getKey(id, options));

  const add = (item: CartItem) => dispatch(addOrOverwrite(item));

  const updateQty = (id: number, options: SelectedOptions, qty: number) => {
    const item = items.find((i) => getKey(i.id, i.selectedOptions) === getKey(id, options));
    if (!item) return;
    const newQty = item.maxQty ? Math.min(qty, item.maxQty) : qty;
    dispatch(setQty({ id, selectedOptions: options, qty: newQty }));
  };

  const remove = (id: number, options: SelectedOptions) =>
    dispatch(removeItem({ id, selectedOptions: options }));

  const clear = () => dispatch(clearCart());
  const setAddressInfo = (addr: Address | null) => dispatch(setAddress(addr));
  const setCouponCode = (code: string | null) => dispatch(setCoupon(code));

  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = 0;
  const totalPrice = itemsTotal + deliveryFee;

  return {
    items,
    hydrated,
    hasItem,
    add,
    updateQty,
    remove,
    clear,
    deliveryFee,
    itemsTotal,
    totalPrice,
    address,
    setAddressInfo,
    coupon,
    setCouponCode,
  };
}