"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Coins } from "lucide-react";
import { SidebarHeader } from "./SidebarHeader";
import { SocialLinks } from "./SocialLinks";
import Link from "next/link";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { setCurrency } from "@/rtk/slices/ui/Currency";
import { categoriesMenu, fetchMenu } from "@/rtk/slices/categoriesMenu/categoriesMenuSlice";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

const currencies = [
  { code: "USD", label: "USD" },
  { code: "EGP", label: "EGP" },
  { code: "SAR", label: "SAR" },
  { code: "AED", label: "AED" },
  { code: "JOD", label: "JOD" },
  { code: "CNY", label: "CNY" },
];

const MobileSidebar = ({ isOpen, onClose, locale }: MobileSidebarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { currency: selectedCurrency } = useAppSelector((s) => s.currencyValue);

  const [activeCategory, setActiveCategory] = useState<categoriesMenu | null>(null);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleClose = () => {
    setActiveCategory(null);
    setShowCurrencySelector(false);
    onClose();
  };

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const { data, loading } = useAppSelector((s) => s.categoriesMenu);

  const changeCurrency = (currencyCode: string) => {
    setCookie("currency", currencyCode);
    dispatch(setCurrency(currencyCode));
    setShowCurrencySelector(false); // go back to main menu after selection
  };

  const openCurrencySelector = () => {
    setShowCurrencySelector(true);
    // scroll to top
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCategory = (cat: categoriesMenu) => {
    setActiveCategory(cat)
    // scroll to top
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 ${t("dir") === "rtl" ? "right-0" : "left-0"} h-full w-full max-w-sm bg-white z-50
          md:hidden transition-transform duration-300
          ${isOpen ? (t("dir") === "rtl" ? "translate-x-0" : "translate-x-0") : (t("dir") === "rtl" ? "translate-x-full" : "-translate-x-full")}
          `}
      >
        <div className="h-full flex flex-col">
          <SidebarHeader title={t("Menu")} onClose={handleClose} />

          <div className="flex-1 overflow-y-auto" ref={scrollRef}>
            {/* Main Menu: Categories + Currency */}
            {!activeCategory && !showCurrencySelector && (
              <>
                {/* Categories Section */}
                <div className="p-4">
                  <h3 className="font-bold text-sm text-dark mb-3">
                    {t("Categories")}
                  </h3>
                  <div className="space-y-2">
                    {data?.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => openCategory(cat)}
                        className={`w-full p-3 text-sm text-dark
                          ${t("dir") === "rtl" ? "text-right" : "text-left"}
                          border border-gray-100 rounded-md
                          hover:bg-gray-50 transition
                          flex items-center justify-between`}
                      >
                        {cat.name}
                        <ChevronLeft size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Sub Categories View */}
            {activeCategory && (
              <div className="p-4">
                <button
                  onClick={() => setActiveCategory(null)}
                  className="flex items-center gap-2 text-sm mb-4 text-gray-600 hover:bg-gray-50 py-1 pb-2 px-3 cursor-pointer rounded-md"
                >
                  <ChevronLeft size={16} />
                  {t("Back")}
                </button>
                <div className="space-y-1">
                  {activeCategory.subCategories?.map((sub) => (
                    <Link
                      href={`/products?category=${sub.categoryId}&subCategory=${sub.id}`}
                      onClick={onClose}
                      key={sub.id}
                      className={`w-full p-3 text-sm text-dark
                        ${t("dir") === "rtl" ? "text-right" : "text-left"}
                        border border-gray-100 rounded-md
                        hover:bg-gray-50 transition
                        flex items-center justify-between`}
                    >
                      {sub.name}
                      <ChevronLeft size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Currency List View (like subcategories) */}
            {showCurrencySelector && (
              <div className="p-4">
                <button
                  onClick={() => setShowCurrencySelector(false)}
                  className="flex items-center gap-2 text-sm mb-4 text-gray-600 hover:bg-gray-50 py-1 pb-2 px-3 rounded-md"
                >
                  <ChevronLeft size={16} />
                  {t("Back")}
                </button>
                <div className="space-y-1">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => changeCurrency(c.code)}
                      className={`w-full p-3 text-sm text-dark border border-gray-100 rounded-md hover:bg-gray-50 transition text-start
                        ${selectedCurrency === c.code ? "bg-main/10 text-main font-medium" : ""}`}
                    >
                      {t(`${c.label}text`)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Always visible sections */}
            <SocialLinks />

            
            <div className="mt-6 px-4 flex flex-col gap-3 mb-15">
              {[
                { code: "ar", label: "العربية" },
                { code: "en", label: "English" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCookie("NEXT_LOCALE", lang.code, { path: "/" });
                    window.location.reload();
                    onClose();
                  }}
                  className={`
                    w-full py-2.5 rounded-xl
                    text-sm font-semibold
                    active:scale-95
                    transition-all duration-300
                    ${locale === lang.code
                      ? "bg-main text-white"
                      : "bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default MobileSidebar;