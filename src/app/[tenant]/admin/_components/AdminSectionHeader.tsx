"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { FaPlus } from "react-icons/fa";

interface Props {
  title: string;
  addHref?: string;
  text?: string;
}

const AdminSectionHeader = ({
  title,
  addHref,
  text
}: Props) => {
  const t = useTranslations();

  return (
    <div className="flex items-center justify-between">
      {/* Title */}
      <p className="title-color text-lg md:text-xl font-bold">
        {title}
      </p>

      {/* ONE SIMPLE BUTTON */}
      {
        addHref && (
          <Link
            href={addHref || ""}
            className="flex items-center gap-2 bg-main rounded-lg px-3 md:px-4 py-2 hover:opacity-90 transition"
          >
            <FaPlus className="text-white text-sm" />
            <span className="font-bold text-white hidden md:block text-sm">
              {text || t("addNew")}
            </span>
          </Link>
        )
      }
    </div>
  );
};

export default AdminSectionHeader;
