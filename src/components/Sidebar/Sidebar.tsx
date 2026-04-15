"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { setCookie } from "cookies-next/client";

import SidebarToggle from "./_components/SidebarToggle";
import SidebarOverlay from "./_components/SidebarOverlay";
import SidebarHeader from "./_components/SidebarHeader";
import SidebarMenu from "./_components/SidebarMenu";
import SidebarUser from "./_components/SidebarUser";

import { cn } from "@/utils/cn";
import { useAppSelector, useAppDispatch } from "@/rtk/hooks";
import { setFalse } from "@/rtk/slices/openMenu";
import SidebarBottomSwiper from "./_components/SidebarBottomSwiper";

export default function Sidebar() {
  const pathname = usePathname();
  const lang = useLocale() as "ar" | "en";
  const router = useRouter();
  const t = useTranslations();

  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.menu.value);

  const changeLanguage = (nextLang: "ar" | "en" | "zh") => {
    setCookie("NEXT_LOCALE", nextLang, { path: "/" });
    window.location.reload();
  };

  return (
    <>
      <SidebarToggle />
      <SidebarOverlay />

      <aside
        className={cn(
          "sidebar-scroll w-full lg:min-w-[280px] lg:max-w-[280px] text-[#E5E7EB] bg-[#14161A] h-screen fixed top-0 lg:sticky px-4 pt-5 transition-all duration-500 z-[100] flex flex-col",
          open ? "start-0" : "start-[-100%] lg:start-0"
        )}
      >
        <SidebarHeader />
        <SidebarMenu
          pathname={pathname}
          onNavigate={() => dispatch(setFalse())}
        />
        <SidebarUser onChangeLanguage={changeLanguage} />
      </aside>

      <SidebarBottomSwiper
        onNavigate={() => dispatch(setFalse())}
      />
    </>
  );
}