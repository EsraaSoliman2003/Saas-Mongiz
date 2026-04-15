"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/rtk/hooks";
import type { FaqItem } from "@/rtk/slices/faq/faqSlice";

export type FaqFormItem = {
  id: number;
  Question: string;
  Answer: string;
  _isNew?: boolean;
};

const toForm = (x: any): FaqFormItem => ({
  id: Number(x.id),
  Question: x.Question ?? x.question ?? "",
  Answer: x.Answer ?? x.answer ?? "",
});

export function useFaqs() {
  const faqsFromStore = useAppSelector((s) => s.faq.faqs) as FaqItem[];

  const storeForm = useMemo(() => faqsFromStore.map(toForm), [faqsFromStore]);

  const [edit, setEdit] = useState(false);
  const [data, setData] = useState<FaqFormItem[]>(storeForm);
  const [draft, setDraft] = useState<FaqFormItem[]>(storeForm);

  useEffect(() => {
    if (edit) return;

    setData(storeForm);
    setDraft(storeForm);
  }, [storeForm, edit]);

  const cancel = () => {
    setDraft(data);
    setEdit(false);
  };

  return {
    edit,
    setEdit,
    data,
    setData, 
    draft,
    setDraft,
    cancel,
  };
}
