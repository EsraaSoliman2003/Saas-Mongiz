"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

interface Props {
  style?: string
}
export default function Search({ style }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState("");
  const t = useTranslations();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (value) {
        params.set("query", value);
      } else {
        params.delete("query");
      }

      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, pathname, router]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("query") || "";
    setValue(query);
  }, []);

  return (
    <div
      className="
        relative flex items-center gap-2
        h-11 lg:h-[52px]
        rounded-sm border border-[#e8e8e88f]
        transition-colors duration-200
        hover:border-gray-300
      "

    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="grow h-full w-full px-5"
        placeholder={t("Search By Product Name")}

      />
      <div className={`absolute w-6 h-6 ${t("dir") === "rtl" ? "left-5" : "right-5"} top-1/2 transform -translate-y-1/2`}>
        <SearchIcon />
      </div>
    </div>
  );
}
