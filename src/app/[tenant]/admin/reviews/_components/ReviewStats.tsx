"use client";

import { useTranslations } from "next-intl";

export default function ReviewStats() {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title={t("totalReviews")}
        value="5"
        bg="#FFFFFF"
        text="#393939"
        borderColor="#3939391A"
      />

      <StatCard
        title={t("pendingReview")}
        value="2"
        bg="#FE9A001A"
        text="#FE9A00"
        borderColor="#FE9A0033"
      />

      <StatCard
        title={t("approvedReviews")}
        value="3"
        bg="#00BC7D1A"
        text="#00BC7D"
        borderColor="#00BC7D33"
      />

      <StatCard
        title={t("averageRating")}
        value="4.4"
        bg="#F0B1001A"
        text="#F0B100"
        borderColor="#F0B10033"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  bg,
  text,
  borderColor,
}: {
  title: string;
  value: string;
  bg: string;
  text: string;
  borderColor: string;
}) {
  return (
    <div
      className="
        rounded-2xl p-5 cursor-pointer
        transition-all duration-300 ease-out
        hover:shadow-lg
      "
      style={{
        backgroundColor: bg,
        border: `1px solid ${borderColor}`,
      }}
    >
      <p
        className="text-xs opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{ color: text }}
      >
        {title}
      </p>

      <p
        className="text-xl font-bold mt-2 transition-all duration-300"
        style={{ color: text }}
      >
        {value}
      </p>
    </div>
  );
}
