"use client";

import { useState } from "react";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useLogout";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/rtk/hooks";

const UserMenu = () => {
    const t = useTranslations();
    const { token } = useAuth();
    const logOut = useLogout();

    const [open, setOpen] = useState(false);

    // ✅ ALWAYS call hook here (top level)
    const tenantId = useAppSelector((s) => s.settings.data?.id);

    return (
        <div className="relative inline-block"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {/* Not logged in */}
            {!token ? (
                <Link
                    href={`/${tenantId}/login`}
                    className="flex items-center gap-1 text-gray-600"
                >
                    <User size={22} />
                </Link>
            ) : (
                <>
                    <button className="flex items-center gap-1 text-gray-600">
                        <User size={22} />
                    </button>

                    {open && (
                        <div className="absolute right-0 w-40 bg-white border rounded shadow-lg z-50 text-sm">
                            <Link
                                href={`/${tenantId}/favourite`}
                                className="block px-4 py-2 hover:bg-gray-100"
                            >
                                {t("Favorite")}
                            </Link>

                            <Link
                                href={`/${tenantId}/profile`}
                                className="block px-4 py-2 hover:bg-gray-100"
                            >
                                {t("Profile")}
                            </Link>

                            <button
                                onClick={logOut}
                                className="w-full flex items-center justify-center px-4 py-2 text-red-700 hover:bg-gray-100"
                            >
                                <LogOut size={16} />
                                {t("Logout")}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserMenu;