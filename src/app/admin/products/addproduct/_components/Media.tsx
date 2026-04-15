"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { Image, X } from "lucide-react";
import { setMainImageUrl, setField } from "@/rtk/slices/ui/ProductSlice";
import { RootState } from "@/rtk/store";

type Props = {
  mainFile: File | null;
  setMainFile: React.Dispatch<React.SetStateAction<File | null>>;
  imageFiles: File[];
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function Media({
  mainFile,
  setMainFile,
  imageFiles,
  setImageFiles,
}: Props) {
  const t = useTranslations("addProduct");
  const dispatch = useDispatch();
  const { mainImageUrl, imageUrls: oldImages } = useSelector(
    (state: RootState) => state.productDraft
  );

  /* ---------------- Main Preview ---------------- */

  const mainPreview = mainFile ? URL.createObjectURL(mainFile) : mainImageUrl;

  /* ---------------- Gallery Preview ---------------- */

  const galleryPreviews = useMemo(() => {
    const newImages = imageFiles.map((file) => URL.createObjectURL(file));
    return [...(oldImages || []), ...newImages];
  }, [imageFiles, oldImages]);

  /* ---------------- Handlers ---------------- */

  const handleMainImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;
    setMainFile(file);

    if (file) {
      dispatch(setMainImageUrl(URL.createObjectURL(file)));
    } else {
      dispatch(setMainImageUrl(null));
    }
  };

  const handleImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImageHandler = (index: number) => {
    const oldLength = oldImages?.length || 0;

    if (index < oldLength) {
      // Removing an old image
      const newOldImages = [...(oldImages || [])];
      newOldImages.splice(index, 1);
      dispatch(setField({ key: "imageUrls", value: newOldImages }));
    } else {
      // Removing a new uploaded image
      const newIndex = index - oldLength;
      setImageFiles((prev) => prev.filter((_, i) => i !== newIndex));
    }
  };

  const removeMainImageHandler = () => {
    setMainFile(null);
    dispatch(setMainImageUrl(null));
  };

  const clearAllImages = () => {
    setImageFiles([]);
    dispatch(setField({ key: "imageUrls", value: [] }));
  };

  /* ---------------- UI ---------------- */

  return (
    <section className="bg-white p-6 lg:p-8 w-full border border-gray-200">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-main bg-clip-text text-transparent">
          {t("media.title")}
        </h3>
      </div>

      <div className="space-y-10">
        {/* Main Image */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-gray-700">
              {t("media.mainImage")} <span className="text-red-500">*</span>
            </span>
          </div>

          {!mainPreview ? (
            <label className="cursor-pointer block border-2 border-dashed border-emerald-300 bg-emerald-50 p-8 text-center hover:border-emerald-400 transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-emerald-100">
                  <Image className="text-2xl text-emerald-600" />
                </div>
                <p className="text-sm font-semibold text-emerald-700">
                  {t("media.uploadMainImage") || "Upload main image"}
                </p>
                <p className="text-xs text-emerald-600">
                  {t("media.mainImageHint") ||
                    "This image will be the primary product image"}
                </p>
              </div>
            </label>
          ) : (
            <div className="relative w-full max-w-sm aspect-square overflow-hidden border-2 border-emerald-300 shadow-sm">
              <img
                src={mainPreview!}
                alt="Main preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeMainImageHandler}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white hover:bg-red-600 shadow-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-emerald-600 text-white text-xs px-3 py-1">
                {t("media.mainBadge") || "Main"}
              </div>
            </div>
          )}
        </div>

        {/* Additional Images */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-gray-700">
              {t("media.additionalImages")}
            </span>
          </div>

          <label className="cursor-pointer block border-2 border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-white p-8 text-center hover:border-gray-400 transition-all">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-100">
                <Image className="text-2xl text-gray-600" />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {t("media.uploadAdditional") || "Upload additional images"}
              </p>
              <p className="text-xs text-gray-500">
                {t("media.additionalHint") || "You can select multiple images"}
              </p>
            </div>
          </label>

          {galleryPreviews.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-700">
                  {t("media.newImages") || "Images"} ({galleryPreviews.length})
                </p>
                <button
                  type="button"
                  onClick={clearAllImages}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  {t("media.clearAll") || "Clear All"}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryPreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <img
                      src={src}
                      alt={`Preview ${idx}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageHandler(idx)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}