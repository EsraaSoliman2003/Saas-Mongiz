"use client";

import { Mic, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import SearchSection from "../desktopNavbar/SearchSection";

interface SidebarHeaderProps {
  title: string;
  onClose?: () => void;
}

export const SidebarHeader = ({ title, onClose }: SidebarHeaderProps) => {
  const t = useTranslations();
  return (
    <>
      <div className="bg-dark p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/80
                       hover:text-main hover:bg-white/10
                       transition-all duration-200 ease-out"
          >
            <X size={18} />
          </button>

          <h2 className="text-white text-lg font-medium">{title}</h2>
          <div className="w-10" />
        </div>
      </div>
      <div className="p-4 bg-dark">
        <SearchSection onClose={onClose} />
      </div>
    </>
  );
};
