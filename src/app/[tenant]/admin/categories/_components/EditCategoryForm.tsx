"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import {
  fetchCategoryById,
  fetchCategoryByIdFull,
  updateCategory,
} from "@/rtk/slices/category/categoriesSlice";

import FormInput from "../../_components/FormInput";
import FormImageUpload from "../../_components/FormImageUpload";
import FormSubmitButton from "../../_components/FormSubmitButton";

const EditCategoryForm = () => {
  const params = useParams();
  const id = Number(params?.id);
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading, updateLoading, selectedSimpleCategory } = useAppSelector((state) => state.categories);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Fetch category
  useEffect(() => {
    if (!id || Number.isNaN(id)) return;
    dispatch(fetchCategoryById(id));
  }, [id, dispatch]);

  // Populate form when data arrives
  useEffect(() => {
    if (!selectedSimpleCategory) return;
    setName(selectedSimpleCategory.name);
    setImageFile(null);
  }, [selectedSimpleCategory]);

  // Validation
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = t("This field is required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await dispatch(
        updateCategory({
          id,
          name: name.trim(),
          image: imageFile ?? undefined,
        })
      ).unwrap();

      toast.success(t("Category updated successfully"));
      router.push(`/admin/categories/${id}`);
    } catch {
      toast.error(t("Failed to update category"));
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-pulse">
        {/* Inputs skeleton */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-5">
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
          </div>

          {/* Image skeleton */}
          <div className="flex-1">
            <div className="aspect-square w-full max-w-[250px] bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Submit button skeleton */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <div className="h-11 w-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Inputs section - takes remaining space */}
            <div className="flex-1 flex flex-col justify-between lg:justify-around py-4 lg:pb-10">
              <FormInput
                label={t("name")}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                placeholder={t("Enter name in English")}
              />
            </div>

            {/* Image upload section - fixed square size on large screens, smaller on mobile */}
            <div className="lg:w-64 w-full max-w-xs mx-auto lg:mx-0 flex-shrink-0">
              <FormImageUpload
                previewUrl={selectedSimpleCategory?.image as string}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                showClearButton
                onClear={() => setImageFile(null)}
                square // makes the upload area square
                className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <FormSubmitButton
              text={t("Update Category")}
              loading={updateLoading}
              className="min-w-[160px]"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryForm;