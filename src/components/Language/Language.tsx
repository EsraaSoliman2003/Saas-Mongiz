"use client";

import { setCookie } from "cookies-next";
import { Globe, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  locale: string;
}

const LanguageDropdown = ({ locale }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
  ];

  const changeLanguage = (code: string) => {
    setCookie("NEXT_LOCALE", code, { path: "/" });
    window.location.reload();
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600"
        aria-label="Change language"
      >
        <Globe size={20} />
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.label}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-50 border border-gray-100 animate-fadeIn">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm text-gray-700 group-hover:text-green-600">
                    {lang.label}
                  </span>
                </div>
                {locale === lang.code && (
                  <Check size={16} className="text-green-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageDropdown;