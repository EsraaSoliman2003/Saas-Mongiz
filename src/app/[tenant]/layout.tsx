"use client";

import { useAppDispatch } from "@/rtk/hooks";
import { fetchSettings } from "@/rtk/slices/setting/settingSlice";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function applyThemeColors(primary: string, secondary: string) {
    document.documentElement.style.setProperty("--main-color", primary);
    document.documentElement.style.setProperty("--dark-color", secondary);
}

export default function TenantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    const [notFound, setNotFound] = useState(false);

    const firstSegment = pathname.split("/").filter(Boolean)[0];

    useEffect(() => {
        if (!firstSegment) return;

        const load = async () => {
            try {
                const res = await dispatch(fetchSettings(Number(firstSegment))).unwrap();
                if (res) {
                    applyThemeColors(res.primaryColor, res.secondaryColor);
                }
            } catch {
                setNotFound(true);
            }
        };

        load();
    }, [dispatch, firstSegment]);

    if (notFound) {
        return <div>Tenant not found</div>;
    }

    return <div>{children}</div>;
}