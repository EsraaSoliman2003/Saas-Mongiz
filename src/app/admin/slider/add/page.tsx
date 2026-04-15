"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { createSlider } from "@/rtk/slices/slider/sliderSlice";

import FormInput from "../../_components/FormInput";
import FormImageUpload from "../../_components/FormImageUpload";
import FormSubmitButton from "../../_components/FormSubmitButton";

const CreateSliderForm = () => {
    const t = useTranslations();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.slider);

    const [link, setLink] = useState("");
    const [text, setText] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ link?: string; image?: string }>({});

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!link.trim()) newErrors.link = t("This field is required");
        if (!imageFile) newErrors.image = t("imageRequired"); // use your key here
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // prevent default first

        if (!validate()) return; // validate will check link & image

        try {
            await dispatch(
                createSlider({
                    Images: [imageFile!],
                    Link: link.trim(),
                    Text: text.trim(),
                })
            ).unwrap();

            toast.success(t("Slider created successfully"));
            router.push("/admin/slider");
        } catch {
            toast.error(t("Failed to create slider"));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-4xl">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">

                        {/* Image Upload - centered at top */}
                        <FormImageUpload
                            previewUrl={imageFile ? URL.createObjectURL(imageFile) : null}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                            onClear={() => setImageFile(null)}
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
                                text={t("Create Slider")}
                                loading={loading}
                                className="min-w-40"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateSliderForm;