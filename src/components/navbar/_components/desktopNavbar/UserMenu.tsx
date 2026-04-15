import { useState } from "react";
import { Heart, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useLogout";
import { useTranslations } from "next-intl";

const UserMenu = () => {
    const t = useTranslations();
    const { token } = useAuth();
    const logOut = useLogout();

    const [open, setOpen] = useState(false);

    if (!token) {
        return (
            <Link
                href="/login"
                className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-gray-400 transition"
            >
                <User size={22} />
            </Link>
        );
    }

    return (
        // Parent container handles hover for both button and menu
        <div
            className="relative inline-block"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {/* Trigger button */}
            <button className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-gray-400 transition">
                <User size={22} />
            </button>

            {/* Dropdown menu */}
            {open && (
                <div
                    className={`absolute ${t("dir") === "rtl" ? "left-0" : "right-0"
                        } w-40 bg-white border border-gray-200 rounded shadow-lg z-50 text-center text-sm`}
                >
                    <Link
                        href="/favourite"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        {t("Favorite")}
                    </Link>
                    <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        {t("Profile")}
                    </Link>
                    <button
                        onClick={logOut}
                        className="w-full flex items-center justify-center px-4 py-2 gap-2 text-red-700 hover:bg-gray-100"
                    >
                        <LogOut size={16} />
                        {t("Logout")}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;