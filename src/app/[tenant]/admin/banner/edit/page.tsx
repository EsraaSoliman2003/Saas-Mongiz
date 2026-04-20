"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiUpload, FiX, FiLink, FiType } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { updateBanner, fetchBanners } from "@/rtk/slices/banner/bannerSlice";
import { toast } from "sonner";
import FormSubmitButton from "../../_components/FormSubmitButton";

const BannerEditForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data, loading } = useAppSelector((s) => s.banner);
  const banner = Array.isArray(data) ? data[0] : data;

  // تحويل البيانات للشكل الجديد
  const formattedBanners = useMemo(() => {
    if (!banner?.images?.length) return [];
    return banner.images.map((img, idx) => ({
      id: banner.id,
      image: img,
      title: banner.titles?.[idx] || "",
      link: banner.links?.[idx] || "",
    }));
  }, [banner]);

  // states لكل بانر
  const [images, setImages] = useState<(File | string | null)[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [objectUrls, setObjectUrls] = useState<string[]>([]); // لتخزين روابط المعاينة لتحرير الذاكرة

  // تحميل البيانات عند التغيير
  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  useEffect(() => {
    if (formattedBanners.length) {
      setImages(formattedBanners.map((b) => b.image || null));
      setTitles(formattedBanners.map((b) => b.title || ""));
      setLinks(formattedBanners.map((b) => b.link || ""));
    }
  }, [formattedBanners]);

  // تنظيف روابط object URLs عند إزالة المكون أو تغيير الصور
  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  // handlers
  const handleImageChange = useCallback((idx: number, file: File | null) => {
    if (!file) return;

    // إنشاء رابط معاينة مؤقت وتخزينه للتنظيف لاحقاً
    const url = URL.createObjectURL(file);
    setObjectUrls((prev) => [...prev, url]);

    // تحديث الصورة مع الاحتفاظ بالرابط للمعاينة (لكننا سنعرض من file مباشرة)
    setImages((prev) => {
      const updated = [...prev];
      updated[idx] = file;
      return updated;
    });
  }, []);

  const handleClearImage = useCallback((idx: number) => {
    setImages((prev) => {
      const updated = [...prev];
      const old = updated[idx];
      if (old instanceof File) {
        // إذا كان هناك object URL سابق، يمكننا إزالته (لكننا لم نخزنه مرتبطاً بالمؤشر، لذا قد نتركه للتنظيف الشامل)
      }
      updated[idx] = null;
      return updated;
    });
  }, []);

  const handleTitleChange = useCallback((idx: number, value: string) => {
    setTitles((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  }, []);

  const handleLinkChange = useCallback((idx: number, value: string) => {
    setLinks((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner) return;

    const formData = new FormData();

    images.forEach((item, idx) => {
      if (item instanceof File) formData.append(`Image${idx + 1}`, item);
      else if (typeof item === "string") formData.append("ExistingImages", item);
    });

    titles.forEach((title, idx) => {
      if (title) formData.append(`Title${idx + 1}`, title);
    });

    links.forEach((link, idx) => {
      if (link) formData.append(`Link${idx + 1}`, link);
    });

    try {
      await dispatch(updateBanner({ id: banner.id, formData })).unwrap();
      await dispatch(fetchBanners()); // تحديث البيانات بعد الحفظ

      toast.success(t("Banners updated successfully!"));
      router.back();
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to update banners"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("Loading")}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{t("Edit Banners")}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {images.map((img, idx) => {
            // تحديد مصدر المعاينة: إذا كان File، استخدم object URL مؤقت، وإذا كان string استخدمه مباشرة
            const previewSrc = img instanceof File
              ? URL.createObjectURL(img)
              : (typeof img === "string" ? img : null);

            return (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                {/* منطقة الصورة */}
                <div className="relative aspect-video bg-gray-100">
                  {previewSrc ? (
                    <>
                      <Image
                        src={previewSrc}
                        alt={`Banner ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <button
                        type="button"
                        onClick={() => handleClearImage(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg transition-colors z-10"
                        title={t("Remove image")}
                      >
                        <FiX size={16} />
                      </button>
                    </>
                  ) : (
                    <label
                      htmlFor={`image-upload-${idx}`}
                      className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-(--main-color)/10 transition-colors"
                    >
                      <FiUpload className="text-3xl text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">{t("Upload image")}</span>
                    </label>
                  )}
                  <input
                    id={`image-upload-${idx}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleImageChange(idx, e.target.files[0]);
                    }}
                  />
                </div>

                {/* حقول الإدخال */}
                <div className="p-4 space-y-3">
                  {/* العنوان */}
                  <div className="relative">
                    <FiType className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={titles[idx] || ""}
                      onChange={(e) => handleTitleChange(idx, e.target.value)}
                      placeholder={t("Banner Title")}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* الرابط */}
                  <div className="relative">
                    <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={links[idx] || ""}
                      onChange={(e) => handleLinkChange(idx, e.target.value)}
                      placeholder={t("Banner Link")}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* أزرار التحكم */}
        <div className="flex justify-end gap-4 pt-4">
          <FormSubmitButton
            text={t("EditBanners")}
            loading={loading}
            className="min-w-[160px]"
          />
        </div>
      </form>
    </div>
  );
};

export default BannerEditForm;