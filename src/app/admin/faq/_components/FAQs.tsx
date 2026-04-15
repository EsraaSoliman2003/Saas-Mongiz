"use client";

import { useTranslations } from "next-intl";
import FaqsPreview from "./Preview";
import FaqsEditor from "./Editor";
import { useFaqs } from "./useFaqs";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { useEffect } from "react";
import { toast } from "sonner";

import {
  fetchFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  fetchFaqById,
} from "@/rtk/slices/faq/faqSlice";
import type { FaqFormItem } from "./useFaqs";

export default function FAQs() {
  const t = useTranslations();
  const faq = useFaqs();

  const dispatch = useAppDispatch();
  const faqsView = useAppSelector((s) => s.faq.faqs);

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  const validateItem = (x: FaqFormItem) => {
    if (!x.Question?.trim()) return t("faq_requiredQuestion");
    if (!x.Answer?.trim()) return t("faq_requiredAnswer");
    return null;
  };

  const onStart = async () => {
    faq.setEdit(true);

    try {
      const fullItems = await Promise.all(
        faqsView.map(async (x: any) => {
          const id = Number(x.id);
          const res = await dispatch(fetchFaqById(id)).unwrap();

          return {
            id: Number(res.id),
            Question: res.question ?? "",
            Answer: res.answer ?? "",
            _isNew: false,
          } as FaqFormItem;
        }),
      );

      faq.setDraft(fullItems);
      faq.setData(fullItems);

    } catch (e: any) {
      faq.setEdit(false);
      toast.error(typeof e === "string" ? e : t("faq_loadFailed"), {
        id: "faqs-load",
      });
    }
  };

  const onUpdateItem = async (item: FaqFormItem) => {
    const err = validateItem(item);
    if (err) {
      toast.error(err);
      return;
    }

    const toastId = `faq-save-${item.id}`;
    toast.loading(t("faq_saving"), { id: toastId });

    try {
      if (item._isNew) {
        await dispatch(
          createFaq({
            Question: item.Question,
            Answer: item.Answer,
          }),
        ).unwrap();

        toast.success(t("faq_created"), { id: toastId });
      } else {
        await dispatch(
          updateFaq({
            id: item.id,
            Question: item.Question,
            Answer: item.Answer,
          }),
        ).unwrap();

        toast.success(t("faq_updated"), { id: toastId });
      }

      await dispatch(fetchFaqs()).unwrap();

      faq.setDraft((prev) =>
        prev.map((x) => (x.id === item.id ? { ...item, _isNew: false } : x)),
      );
    } catch (e: any) {
      toast.error(typeof e === "string" ? e : t("faq_saveFailed"), {
        id: toastId,
      });
    }
  };

  const onDeleteItem = async (item: FaqFormItem) => {
    if (item._isNew) {
      faq.setDraft((prev) => prev.filter((x) => x.id !== item.id));
      toast.success(t("faq_deletedLocal"));
      return;
    }

    const toastId = `faq-del-${item.id}`;
    toast.loading(t("faq_deleting"), { id: toastId });

    try {
      await dispatch(deleteFaq({ id: item.id })).unwrap();
      await dispatch(fetchFaqs()).unwrap();

      faq.setDraft((prev) => prev.filter((x) => x.id !== item.id));

      toast.success(t("faq_deleted"), { id: toastId });
    } catch (e: any) {
      toast.error(typeof e === "string" ? e : t("faq_deleteFailed"), {
        id: toastId,
      });
    }
  };

  const onCancel = () => {
    faq.cancel();
  };

  return (
    <div className="rounded-2xl bg-white p-5 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-base title-color">{t("FAQs")}</h2>
        </div>

        {!faq.edit ? (
          <button
            type="button"
            onClick={onStart}
            className="rounded-lg px-4 py-2 bg-main text-white font-semibold text-sm hover:opacity-90 transition"
          >
            {t("Edit")}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-4 py-2 border border-gray-200 bg-white hover:bg-[#F4F6F8] transition font-semibold text-sm"
            >
              {t("Cancel")}
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      <FaqsPreview data={faqsView as any} />

      {/* Editor */}
      {faq.edit && (
        <div className="mt-6">
          <FaqsEditor
            draft={faq.draft}
            setDraft={faq.setDraft}
            onUpdateItem={onUpdateItem}
            onDeleteItem={onDeleteItem}
          />
        </div>
      )}
    </div>
  );
}
