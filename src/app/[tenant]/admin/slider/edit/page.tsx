"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchSliderById, updateSlider, clearSelectedSlider } from "@/rtk/slices/slider/sliderSlice";
import FormInput from "../../_components/FormInput";
import FormImageUpload from "../../_components/FormImageUpload";
import FormSubmitButton from "../../_components/FormSubmitButton";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function EditSliderPage() {
    const t = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sliderId = searchParams.get("id");
    const dispatch = useAppDispatch();
    const { selected: slider, loading } = useAppSelector((state) => state.slider);

    const [link, setLink] = useState("");
    const [text, setText] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ link?: string; image?: string }>({});

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (sliderId) dispatch(fetchSliderById(Number(sliderId)));

        // Cleanup
        return () => {
            dispatch(clearSelectedSlider()); // this is fine now
        };
    }, [dispatch, sliderId]);

    useEffect(() => {
        if (slider) {
            setLink(slider.link || "");
            setText(slider.text || "");
            if (slider.images && slider.images[0]) setPreviewUrl(slider.images[0]);
        }
    }, [slider]);

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!link.trim()) newErrors.link = t("This field is required");
        if (!imageFile && !previewUrl) newErrors.image = t("Please upload an image");
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await dispatch(
                updateSlider({
                    Id: Number(sliderId),
                    Link: link.trim(),
                    Text: text.trim(),
                    NewImages: imageFile ? [imageFile] : undefined,
                    ExistingImages: !imageFile && previewUrl ? [previewUrl] : undefined,
                })
            ).unwrap();

            toast.success(t("Slider updated successfully"));
            router.push(`/${useAppSelector((s) => s.settings.data?.id)}/admin/slider`);
        } catch {
            toast.error(t("Failed to update slider"));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-4xl">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">

                        {/* Image Preview */}
                        <FormImageUpload
                            previewUrl={previewUrl || (imageFile ? URL.createObjectURL(imageFile) : null)}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImageFile(e.target.files[0]);
                                    setPreviewUrl(null);
                                }
                            }}
                            onClear={() => {
                                setImageFile(null);
                                setPreviewUrl(null);
                            }}
                            showClearButton
                            square
                            error={errors.image}
                            className="max-h-[300px]"
                        />

                        {/* Inputs */}
                        <div className="space-y-4">
                            <FormInput
                                label={t("Link")}
                                required
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                error={errors.link}
                                placeholder="https://example.com"
                            />
                            <FormInput
                                label={t("Text")}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={t("Optional")}
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <FormSubmitButton
                                text={t("Update Slider")}
                                loading={loading}
                                className="min-w-40"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}