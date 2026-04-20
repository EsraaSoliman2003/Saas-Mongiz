"use client";

import { useParams, useRouter } from "next/navigation";
import FormSubmitButton from "../../_components/FormSubmitButton";
import LoadingSpinner from "../../_components/LoadingSpinner";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { useTranslations } from "next-intl";
import { clearSelectedBrand, fetchBrandById, updateBrand } from "@/rtk/slices/brands/brandsSlice";
import { toast } from "sonner";

const EditBrandForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const params = useParams();
  const id = Number(params?.id);
  const { selectedBrand, selectedLoading } =
    useAppSelector((s) => s.brands);
  const [name, setName] = useState(selectedBrand?.name);

  useEffect(() => {
    if (!Number.isFinite(id)) return;

    dispatch(clearSelectedBrand());
    dispatch(fetchBrandById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!selectedBrand) return;

    setName(selectedBrand.name ?? "");
  }, [selectedBrand]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedBrand());
    };
  }, [dispatch]);


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !name.trim()) return;

    try {
      await dispatch(updateBrand({ id, name })).unwrap();

      setName("");
      toast.success(t("success"));
      router.push(`/${useAppSelector((s) => s.settings.data?.id)}/admin/brands`);

    } catch (err) {
      toast.error(typeof err === "string" ? err : t("error"));
    }
  };


  if (selectedLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-xl p-5 lg:p-8 w-full">
        <form onSubmit={submit} className="mt-7 space-y-6 w-full">
          <div className="w-full mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("name")}
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div className="flex items-center justify-end gap-3 pt-2">
            <FormSubmitButton text={t("Send")} loading={selectedLoading} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBrandForm;
