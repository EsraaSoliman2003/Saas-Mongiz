import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import type { HowItWorkApi } from "@/rtk/slices/howItWork/howItWork";

export default function HowItWorksPreview({ data }: { data: HowItWorkApi }) {
  const arr = [0, 1, 2, 3];
  const t = useTranslations();

  return (
    <div className={`flex flex-col md:flex-row items-center gap-5 lg:gap-10 ${styles.root}`}>
      <div className="grid grid-cols-4 gap-1 lg:gap-2 h-[275px] lg:h-[373px] w-full md:min-w-[224px] lg:min-w-[424px]">
        {arr.map((idx) => (
          <div key={idx} className={`relative h-[220px] lg:h-[320px] rounded-xl overflow-hidden ${styles.img}`}>
            <Image
              src={data.images?.[idx] || "/placeholder.png"}
              alt="Image"
              fill
              sizes="(min-width: 1024px) 320px, 220px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="w-full">
        <h2 className="font-semibold text-sm text-main ps-[10px] relative before:content-[''] before:absolute before:top-0 before:start-0 before:h-full before:w-[4px] before:bg-[#093800] before:rounded-xl">
          {t("How it Work")}
        </h2>

        <p className="font-semibold text-xl md:text-2xl mt-2 max-w-[520px]">
          <span>{data.title}</span>{" "}
          <span className="text-[#168500]">{data.highlight}</span>
        </p>

        <p className="font-semibold text-xs lg:text-base text-[#545454] mt-2 lg:mt-5">
          {data.description}
        </p>
      </div>
    </div>
  );
}
