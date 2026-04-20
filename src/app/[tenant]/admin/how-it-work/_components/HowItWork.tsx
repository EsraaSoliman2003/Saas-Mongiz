"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import HowItWorksPreview from "./Preview";
import HowItWorksEditor from "./Editor";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import {
  fetchHowItWorkAll,
  fetchHowItWorkFullById,
  editHowItWork,
} from "@/rtk/slices/howItWork/howItWork";

import type { AboutHowItWorkData } from "@/utils/dtos";
import type { HowItWorkFullApi } from "@/rtk/slices/howItWork/howItWork";

const EMPTY_IMAGES = ["", "", "", ""] as string[];

const toUIFromFull = (full: HowItWorkFullApi): AboutHowItWorkData => ({
  images: full.images?.slice(0, 4) ?? [...EMPTY_IMAGES],
  titleTextEN: full.titleEN ?? "",
  titleTextAR: full.titleAR ?? "",
  titleHighlightEN: full.highlightEN ?? "",
  titleHighlightAR: full.highlightAR ?? "",
  paragraphEN: full.descriptionEN ?? "",
  paragraphAR: full.descriptionAR ?? "",
});

export default function HowItWork() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const items = useAppSelector((s) => s.howItWork.items);
  const loading = useAppSelector((s) => s.howItWork.loading);
  const fullItem = useAppSelector((s) => s.howItWork.fullItem);
  const fullLoading = useAppSelector((s) => s.howItWork.fullLoading);

  const apiItem = items?.[0];

  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState<AboutHowItWorkData | null>(null);

  const [serverImages, setServerImages] = useState<string[]>([...EMPTY_IMAGES]);
  const [newFiles, setNewFiles] = useState<(File | null)[]>([null, null, null, null]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchHowItWorkAll());
  }, [dispatch]);

  // لما fullItem يوصل بعد Edit: جهّزي draft
  useEffect(() => {
    if (!edit) return;
    if (!fullItem) return;

    const ui = toUIFromFull(fullItem);
    setDraft(ui);
    setServerImages(ui.images);
    setNewFiles([null, null, null, null]);
  }, [edit, fullItem]);

  const startEdit = async () => {
    if (!apiItem?.id) return;

    setEdit(true); // ندخل وضع الايديت
    await dispatch(fetchHowItWorkFullById(Number(apiItem.id))).unwrap();
    // draft هيتجهّز في useEffect فوق لما fullItem يوصل
  };

  const cancel = () => {
    setEdit(false);
    setDraft(null);
    setServerImages([...EMPTY_IMAGES]);
    setNewFiles([null, null, null, null]);
  };

  const pickImage = (idx: number, file: File | null) => {
    if (!file) return;
    setDraft((p) => {
      if (!p) return p;
      const url = URL.createObjectURL(file);
      const images = [...p.images];
      images[idx] = url;
      return { ...p, images };
    });

    setNewFiles((prev) => {
      const arr = [...prev];
      arr[idx] = file;
      return arr;
    });
  };

  const removeImage = (idx: number) => {
    setDraft((p) => {
      if (!p) return p;
      const images = [...p.images];
      images[idx] = "";
      return { ...p, images };
    });

    setNewFiles((prev) => {
      const arr = [...prev];
      arr[idx] = null;
      return arr;
    });

    setServerImages((prev) => {
      const arr = [...prev];
      arr[idx] = "";
      return arr;
    });
  };

  const onSave = async () => {
    if (!apiItem?.id) return;
    if (!draft) return;

    setSaving(true);
    try {
      const exists = serverImages.filter(Boolean);
      const files = newFiles.filter(Boolean) as File[];

      await dispatch(
        editHowItWork({
          Id: Number(apiItem.id),
          TitleEN: draft.titleTextEN,
          TitleAR: draft.titleTextAR,
          HighlightEN: draft.titleHighlightEN,
          HighlightAR: draft.titleHighlightAR,
          DescriptionEN: draft.paragraphEN,
          DescriptionAR: draft.paragraphAR,
          ExistsImages: exists.length ? exists : undefined,
          Images: files.length ? files : undefined,
        }),
      ).unwrap();

      await dispatch(fetchHowItWorkAll());
      setEdit(false);
      setDraft(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-base title-color">{t("How it Work")}</h2>
        </div>

        {!edit ? (
          <button
            type="button"
            onClick={startEdit}
            className="rounded-lg px-4 py-2 bg-main text-white font-semibold text-sm"
            disabled={!apiItem?.id || loading}
          >
            {t("Edit")}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={cancel}
                className="rounded-lg px-4 py-2 border border-gray-200 bg-white font-semibold text-sm"
            >
              {t("Cancel")}
            </button>
            <button
              type="button"
              onClick={onSave}
              className="rounded-lg px-4 py-2 bg-main text-white font-semibold text-sm"
              disabled={saving}
            >
              {saving ? t("Loading") : t("Save")}
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      {apiItem ? <HowItWorksPreview data={apiItem} /> : null}

      {/* Editor */}
      {edit && draft && (
        <div className="mt-6">
          <HowItWorksEditor
            draft={draft}
            setDraft={setDraft as any}
            onPickImage={pickImage}
            onRemoveImage={removeImage}
          />
        </div>
      )}

      {edit && !draft && (
        <div className="mt-6 text-sm opacity-70">
          {fullLoading ? t("Loading") : t("Loading")}
        </div>
      )}
    </div>
  );
}
