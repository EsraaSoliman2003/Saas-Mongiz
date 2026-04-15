"use client";

import { useState, useRef, useEffect } from "react";
import MobileSidebar from "./MobileSidebar";
import {
    Menu,
    ShoppingCart,
    Heart,
    LogOut,
    User,
    Grid,
    Package
} from "lucide-react";
import Link from "next/link";
import { useLogout } from "@/hooks/useLogout";
import { useTranslations } from "next-intl";
import SafeImage from "@/components/safeImage/SafeImage";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import Currency from "./Currency";
import { useAppSelector } from "@/rtk/hooks";
import Image from "next/image";

const MobileNavbar = ({ locale }: { locale: string }) => {
    const { items } = useCart();
    const t = useTranslations();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const logout = useLogout();
    const menuRef = useRef<HTMLDivElement>(null);
    const { token, role } = useAuth();
    const router = useRouter();
    const rolesArray = role ? JSON.parse(role) : [];

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const { logo, loading } = useAppSelector((s) => s.logo)

    return (
        <>
            {/* Mobile Navigation Bar */}
            <div className="md:hidden bg-dark border-b border-white/10">
                <div className="flex items-center justify-between px-3 py-2 text-sm text-white">
                    {/* Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-0 rounded-lg hover:bg-white/10 transition cursor-pointer"
                    >
                        <Menu size={22} />
                    </button>

                    {/* Logo */}
                    <Link href={"/"}>


                        {loading ? (
                            <div className="w-40 h-10 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                            <div className="relative w-20 h-8">
                                <Image
                                    src={logo?.logoDarkMode || "/default-logo.png"}
                                    alt="logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </Link>

                    <div className="flex items-center relative" ref={menuRef}>
                        {/* Account Dropdown Trigger */}
                        <button
                            onClick={() => {
                                if (token) {
                                    setMenuOpen((prev) => !prev)
                                } else {
                                    router.push("/login")
                                }
                            }}
                            className={`p-2 rounded-full hover:bg-white/10 transition cursor-pointer ${t("dir") === "rtl" ? "mr-2" : "ml-2"}`}
                            aria-label="Account"
                        >
                            <User size={16} className="text-white" />
                        </button>

                        {/* Dropdown */}
                        {menuOpen && (
                            <div className={`absolute ${t("dir") === "rtl" ? "left-0" : "right-0"} top-9 w-44 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 overflow-hidden z-99`}>
                                {/* Wishlist */}
                                <Link
                                    href="/favourite"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 transition"
                                >
                                    <Heart size={16} className="text-main" />
                                    {t("Favorite")}
                                </Link>
                                {
                                    rolesArray.includes("SELLER") && (
                                        <Link
                                            href="/seller"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 transition"
                                        >
                                            <Grid size={16} className="text-main" />
                                            {t("dashboard")}
                                        </Link>
                                    )
                                }
                                {
                                    rolesArray.includes("ADMIN") && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 transition"
                                        >
                                            <Grid size={16} className="text-main" />
                                            {t("dashboard")}
                                        </Link>
                                    )
                                }
                                {/* Profile */}
                                <Link
                                    href="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 transition"
                                >
                                    <User size={16} className="text-main" />
                                    {t("Profile")}
                                </Link>

                                {/* Orders */}
                                <Link
                                    href="/orders"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 transition"
                                >
                                    <Package size={16} className="text-main" />
                                    {t("Orders")}
                                </Link>

                                {/* Logout */}
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        logout();
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                                >
                                    <LogOut size={16} />
                                    {t("Logout")}
                                </button>
                            </div>
                        )}

                        {/* Cart */}
                        <Link
                            href="/cart"
                            onClick={() => setSidebarOpen(false)}
                            className="relative p-2 pr-2 rounded-full hover:bg-white/10 transition"
                            aria-label="Cart"
                        >
                            <ShoppingCart size={15} className="text-white" />
                            {
                                items.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-main text-white text-[10px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center">
                                        {items.length}
                                    </span>
                                )
                            }
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                locale={locale}
            />
        </>
    );
};

export default MobileNavbar;
