"use client";
import React from "react";
import { useTranslations } from "next-intl";
import type { FaqFormItem } from "./useFaqs";

import Field from "./Field";
import TextArea from "./TextArea";

export default function FaqsEditor({
  draft,
  setDraft,
  onUpdateItem,
  onDeleteItem,
}: {
  draft: FaqFormItem[];
  setDraft: React.Dispatch<React.SetStateAction<FaqFormItem[]>>;
  onUpdateItem: (item: FaqFormItem) => void;
  onDeleteItem: (item: FaqFormItem) => void;
}) {
  const t = useTranslations();

  const addItem = () => {
    setDraft((prev) => [
      ...prev,
      {
        id: Date.now(),
        Question: "",
        Answer: "",
        _isNew: true,
      },
    ]);
  };

  const updateItem = (
    idx: number,
    key: keyof Omit<FaqFormItem, "id" | "_isNew">,
    value: string
  ) => {
    setDraft((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold title-color">{t("Questions")}</p>

        <button
          type="button"
          onClick={addItem}
          className="rounded-lg px-4 py-2 bg-main text-white font-semibold text-sm hover:opacity-90 transition"
        >
          {t("Add Question")}
        </button>
      </div>

      {draft.map((item, idx) => (
        <div key={item.id} className="rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm title-color">
              {t("Question")} #{idx + 1}
            </p>

            <button
              type="button"
              onClick={() => onDeleteItem(item)}
              className="rounded-lg px-3 py-2 text-sm font-semibold border border-gray-200 bg-white hover:bg-[#F4F6F8] transition"
            >
              {t("Delete")}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label={`${t("Question")}`}
              value={item.Question}
              onChange={(v) => updateItem(idx, "Question", v)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextArea
              label={`${t("Answer")}`}
              value={item.Answer}
              onChange={(v) => updateItem(idx, "Answer", v)}
              rows={4}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onUpdateItem(item)}
              className="rounded-lg px-4 py-2 bg-main text-white font-semibold text-sm hover:opacity-90 transition"
            >
              {item._isNew ? t("Add") : t("Update")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
