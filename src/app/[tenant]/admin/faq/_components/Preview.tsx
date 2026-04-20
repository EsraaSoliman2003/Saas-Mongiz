"use client";
import React from "react";
import type { Faqs } from "@/utils/dtos";
import FaqsAccordion from "./Accordion";

export default function FaqsPreview({ data }: { data: Faqs[] }) {
  return (
    <section className="pt-2">
      <div className="overflow-hidden">
        <div className="mt-8 md:mt-12">
          <FaqsAccordion items={data} />
        </div>
      </div>
    </section>
  );
}
