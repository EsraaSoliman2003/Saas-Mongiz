"use client";
import { useAppDispatch } from "@/rtk/hooks";
import { setTrue } from "@/rtk/slices/openMenu";
import Link from "next/link";
import {
    HiHome,
    HiOutlinePhotograph,
    HiOutlineCollection,
    HiOutlineShoppingBag,
    HiOutlineViewGrid,
    HiOutlineDotsHorizontal,
} from "react-icons/hi";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Image } from "lucide-react";

export default function SidebarBottomSwiper({
    onNavigate,
}: {
    onNavigate: () => void;
}) {
    const dispatch = useAppDispatch();

    const pathname = usePathname();
    const t = useTranslations();

    const items = [
        {
            name: t("dashboard"),
            icon: <HiHome className="text-xl" />,
            path: "/admin",
        },
        {
            name: t("categories"),
            icon: <HiOutlineViewGrid className="text-xl" />,
            path: `/admin/categories`,
        },
        {
            name: t("products"),
            icon: <HiOutlineShoppingBag className="text-xl" />,
            path: `/admin/products`,
        },
        {
            name: t("More"),
            icon: <HiOutlineDotsHorizontal className="text-xl" />,
            action: () => dispatch(setTrue()),
        },
    ];

    const isActive = (itemPath: string) => {
        if (itemPath === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(itemPath);
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white py-2 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.15)] lg:hidden">
            <div className="px-2 h-12 flex justify-around items-center">
                {items.map((item) => {
                    let active;
                    if (item.path) {
                        active = isActive(item.path);
                    }

                    return (
                        <div key={item.name}>
                            {item.path ? (
                                <Link
                                    href={item.path}
                                    onClick={onNavigate}
                                    className={`flex flex-col items-center text-xs transition ${active ? "text-main" : "text-gray-500"
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 flex items-center justify-center rounded-xl transition ${active ? "text-main" : ""
                                            }`}
                                    >
                                        {item.icon}
                                    </div>
                                    <span>{item.name}</span>
                                </Link>
                            ) : (
                                <button
                                    onClick={item.action}
                                    className={`flex flex-col items-center text-xs transition ${active ? "text-main" : "text-gray-500"
                                        }`}
                                >
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition ${active ? "text-main" : ""
                                        }`}>
                                        {item.icon}
                                    </div>
                                    <span>{item.name}</span>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}