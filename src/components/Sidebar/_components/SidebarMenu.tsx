"use client";

import Link from "next/link";
import {
  HiHome,
  HiOutlinePhotograph,
  HiOutlineCollection,
  HiOutlineQuestionMarkCircle,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlinePhone,
  HiOutlineSupport,
  HiOutlineTag,
  HiOutlineTicket,
  HiOutlineStar,
  HiOutlineClipboardList,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchPendingSellers } from "@/rtk/slices/seller/sellerSlice";
import { useEffect } from "react";
import { Bell, BookOpen, Image, Share2 } from "lucide-react";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type MenuItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

export default function SidebarMenu({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const t = useTranslations();
  const { pending } = useAppSelector((s) => s.seller);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPendingSellers());
  }, [dispatch]);

  const allMenuItems: MenuItem[] = [
    {
      name: t("dashboard"),
      icon: <HiHome className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin`,
    },
    {
      name: t("settings"),
      icon: <HiOutlineCog className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/settings`,
    },
    // {
    //   name: t("Logo"),
    //   icon: <Image className="text-xl" />,
    //   path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/logo`,
    // },
    {
      name: t("Slider"),
      icon: <HiOutlinePhotograph className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/slider`,
    },
    {
      name: t("Banners"),
      icon: <HiOutlineCollection className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/banner`,
    },
    {
      name: t("Coupon"),
      icon: <HiOutlineTicket className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/coupon`,
    },
    {
      name: t("Brand"),
      icon: <HiOutlineTag className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/brands`,
    },
    {
      name: t("categories"),
      icon: <HiOutlineCollection className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/categories`,
    },
    {
      name: t("products"),
      icon: <HiOutlineShoppingBag className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/products`,
    },
    {
      name: t("Orders"),
      icon: <HiOutlineClipboardList className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/orders`,
    },
    {
      name: t("customers"),
      icon: <HiOutlineUsers className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/customers`,
    },
    {
      name: t("reviews"),
      icon: <HiOutlineStar className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/reviews`,
    },
    {
      name: t("FAQs"),
      icon: <HiOutlineQuestionMarkCircle className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/faq`,
    },
    {
      name: t("Contact Info"),
      icon: <HiOutlinePhone className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/contact-info`,
    },
    // {
    //   name: t("How It Work"),
    //   icon: <BookOpen className="text-xl" />,
    //   path: `/${useAppSelector((s} => s.settings.data?.id)}/admin/how-it-work`,
    // },
    {
      name: t("Notification Mobile"),
      icon: <Bell className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/notification-mobile`,
    },
    // {
    //   name: t("Social"),
    //   icon: <Share2 className="text-xl" />,
    //   path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/social`,
    // },
    {
      name: t("Support"),
      icon: <HiOutlineSupport className="text-xl" />,
      path: `/${useAppSelector((s) => s.settings.data?.id)}/admin/support`,
    },
  ];


  return (
    <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
      {allMenuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={onNavigate}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition",
              isActive
                ? "bg-main text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>

            {item.name === t("Sellers") &&
              pending &&
              pending.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full">
                  {pending.length}
                </span>
              )}
          </Link>
        );
      })}
    </nav>
  );
}