"use client";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchFaqs } from "@/rtk/slices/faq/faqSlice";
import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import NoData from "@/components/noData/NoData";
import FAQSkeleton from "@/skeleton/FAQSkeleton";

export default function Page() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { faqs, loading } = useAppSelector((s) => s.faq);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  if (loading) {
    return (
      <FAQSkeleton />
    );
  }

  return (
    <div className="py-10 sm:py-10 mb-10 mt-0 md:mt-5">
      <div className="container flex flex-col md:flex-row gap-10 md:gap-16">

        {/* Left column: Title */}
        <div className="md:w-1/3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark">
            {t("faq")}
          </h1>
        </div>

        {/* Right column: FAQ list */}
        <div className="md:w-2/3 space-y-4 sm:space-y-5">
          {faqs.length > 0 ? faqs?.map((item) => (
            <div key={item.id} className="border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden">
              {/* Question button */}
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full bg-gray-50 px-6 sm:px-8 py-3 sm:py-3 flex justify-between items-center text-left transition hover:bg-gray-100 focus:outline-none"
              >
                <span className="font-medium text-gray-800 text-base sm:text-lg">
                  {item.question}
                </span>

                {/* Chevron icon with rotation animation */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-dark text-white transition-transform duration-300 ${openId === item.id ? "rotate-180" : ""
                    }`}
                >
                  <ChevronDown size={18} />
                </div>
              </button>

              {/* Answer with collapsible animation */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${openId === item.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 sm:px-8 py-5 sm:py-6 bg-white border-t border-gray-100 text-gray-600 text-sm sm:text-base leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          ))
            : (<NoData />)
          }
        </div>
      </div>
    </div>
  );
}