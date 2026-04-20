"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { createCategory } from "@/rtk/slices/category/categoriesSlice";

import FormInput from "../../_components/FormInput";
import FormImageUpload from "../../_components/FormImageUpload";
import FormSubmitButton from "../../_components/FormSubmitButton";

const CreateCategoryForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.categories);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ nameEN?: string; nameAR?: string; image?: string }>({});

  // Validation
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.nameEN = t("This field is required");
    if (!imageFile) newErrors.image = t("Please upload an image");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await dispatch(
        createCategory({
          name: name.trim(),
          image: imageFile!,
        })
      ).unwrap();

      toast.success(t("Category created successfully"));
      router.push("/admin/categories"); // redirect to categories list
    } catch {
      toast.error(t("Failed to create category"));
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Inputs */}
            <div className="flex-1 flex flex-col justify-between lg:justify-around py-4 lg:pb-10">
              <FormInput
                label={t("nameEN")}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.nameEN}
                placeholder={t("Enter name in English")}
              />

            </div>

            {/* Image upload */}
            <div className="lg:w-64 w-full max-w-xs mx-auto lg:mx-0 shrink-0">
              <FormImageUpload
                previewUrl={null}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                showClearButton
                onClear={() => setImageFile(null)}
                square
                className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
                error={errors.image}
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <FormSubmitButton text={t("Create Category")} loading={loading} className="min-w-40" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryForm;