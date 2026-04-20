"use client";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import type { Faqs } from "@/utils/dtos";

export default function FaqsAccordion({ items }: { items: Faqs[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {items.map((item, idx) => {
        const opened = openIndex === idx;

        return (
          <div
            key={item.id}
            className={`min-h-[80px] md:min-h-[63px] flex flex-col justify-center border-s-4 px-5 ${
              opened ? "border-[#093800]" : "border-[#B4C1BC]"
            }`}
          >
            <div
              className="flex items-center justify-between gap-4 cursor-pointer"
              onClick={() => setOpenIndex(opened ? null : idx)}
            >
              <h4 className="font-semibold text-sm md:text-xl">
                {item.question || "—"}
              </h4>
              <div className={`transition text-xl ${opened ? "rotate-180" : ""}`}>
                <IoIosArrowDown />
              </div>
            </div>

            {opened && (
              <p className="font-medium text-xs md:text-base mt-4 md:mt-5">
                {item.answer || "—"}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
