"use client";

import { createBrand } from "@/rtk/slices/brands/brandsSlice";
import FormSubmitButton from "../../_components/FormSubmitButton";
import { useTranslations } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/rtk/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateBrandForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { createLoading } = useAppSelector((s) => s.brands);
  const [value, setValue] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.trim()) return;

    try {
      await dispatch(createBrand({ name: value })).unwrap();

      setValue("");
      toast.success(t("success"));
      router.push("/admin/brands");

    } catch (err) {
      toast.error(typeof err === "string" ? err : t("error"));
    }
  };


  return (
    <div className="w-full">
      <div className="rounded-xl p-5 lg:p-8 w-full">
        <form onSubmit={submit} className="space-y-6">
          <div className="w-full mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("name")}
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              className="
                w-full px-4 py-3 rounded-lg
                text-gray-900 text-sm placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-(--main-color) focus:border-(--main-color)
                disabled:bg-gray-100 disabled:text-gray-400
                transition bg-white
              "
            />
          </div>

          <div className="flex justify-end">
            <FormSubmitButton text={t("Send")} loading={createLoading} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBrandForm;
