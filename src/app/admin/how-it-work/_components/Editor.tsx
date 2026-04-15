import React from "react";
import { useTranslations } from "next-intl";
import type { AboutHowItWorkData } from "@/utils/dtos";

import ImagePickerGrid from "./ImagePickerGrid";
import Field from "./Field";
import TextArea from "./TextArea";

import { about_how_it } from "@/assets";

export default function HowItWorksEditor({
  draft,
  setDraft,
  onPickImage,
  onRemoveImage,
}: {
  draft: AboutHowItWorkData;
  setDraft: React.Dispatch<React.SetStateAction<AboutHowItWorkData>>;
  onPickImage: (idx: number, file: File | null) => void;
  onRemoveImage: (idx: number) => void;
}) {
  const t = useTranslations();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 space-y-6">
      <h2 className="font-semibold text-base title-color">{t("Edit Section")}</h2>

      <ImagePickerGrid
        images={draft.images}
        fallbackSrc={about_how_it}
        onPickImage={onPickImage}
        onRemoveImage={onRemoveImage}
        max={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label={`${t("Title Text")} (EN)`}
            value={draft.titleTextEN}
            onChange={(v) => setDraft((p) => ({ ...p, titleTextEN: v }))}
          />
          <Field
            label={`${t("Title Text")} (AR)`}
            value={draft.titleTextAR}
            onChange={(v) => setDraft((p) => ({ ...p, titleTextAR: v }))}
          />

          <Field
            label={`${t("Highlighted Text")} (EN)`}
            value={draft.titleHighlightEN}
            onChange={(v) => setDraft((p) => ({ ...p, titleHighlightEN: v }))}
          />
          <Field
            label={`${t("Highlighted Text")} (AR)`}
            value={draft.titleHighlightAR}
            onChange={(v) => setDraft((p) => ({ ...p, titleHighlightAR: v }))}
          />
        </div>

        <TextArea
          label={`${t("Paragraph")} (EN)`}
          value={draft.paragraphEN}
          onChange={(v) => setDraft((p) => ({ ...p, paragraphEN: v }))}
          className="md:col-span-2"
        />
        <TextArea
          label={`${t("Paragraph")} (AR)`}
          value={draft.paragraphAR}
          onChange={(v) => setDraft((p) => ({ ...p, paragraphAR: v }))}
          className="md:col-span-2"
        />
      </div>
    </div>
  );
}
