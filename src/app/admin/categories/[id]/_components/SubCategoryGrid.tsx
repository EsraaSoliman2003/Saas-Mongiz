"use client";

import SubCategoryCard from "./SubCategoryCard";
import SubCategoryModal from "./SubCategoryModal";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FaPlus } from "react-icons/fa6";
import { toast } from "sonner";

import {
  createSubCategory,
  fetchSubCategoryByCategory,
  fetchSubCategoryById,
  updateSubCategory,
} from "@/rtk/slices/subCategories/subCategoriesSlice";
import AdminSectionHeader from "../../../_components/AdminSectionHeader";
import { SubCategory } from "@/utils/dtos";
import { subCategory } from "@/rtk/slices/categoriesMenu/categoriesMenuSlice";

const EMPTY_ARRAY: any[] = [];

const SubCategoryGrid = ({ categoryId }: { categoryId: number }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");

  const [selected, setSelected] = useState<subCategory>()

  const subCategoriesData = useAppSelector(
    (state) => state.subCategories.data[categoryId] ?? EMPTY_ARRAY
  );

  const subCategoriesLoading = useAppSelector(
    (state) => state.subCategories.loading.fetchByCategory[categoryId] || false
  );

  const createLoading = useAppSelector((state) => state.subCategories.loading.create);
  const updateLoading = useAppSelector((state) => state.subCategories.loading.update);

  useEffect(() => {
    dispatch(fetchSubCategoryByCategory(categoryId));
  }, [dispatch, categoryId]);

  const handleAdd = () => {
    setMode("add");
    setOpen(true);
  };

  const handleEdit = async (sub: SubCategory) => {
    setMode("edit");
    setSelected(sub)
    setOpen(true); // open modal after fetching
  };

  const handleSave = async (payload: { name: string }) => {
    if (!payload.name) {
      toast.warning(t("This field is required"));
      return;
    }

    try {
      if (mode === "add") {
        await dispatch(
          createSubCategory({
            name: payload.name,
            categoryId,
          })
        ).unwrap();
        toast.success(t("Sub Category created successfully"));
      } else if (mode === "edit" && selected) {
        await dispatch(
          updateSubCategory({
            id: selected.id,
            name: payload.name,
          })
        ).unwrap();
        toast.success(t("Sub Category updated successfully"));
      }

      setOpen(false);
      dispatch(fetchSubCategoryByCategory(categoryId));
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("Something went wrong"));
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <AdminSectionHeader title={t("Sub Categories")} />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-main rounded-lg px-3 md:px-4 py-2 hover:opacity-90 transition"
        >
          <FaPlus className="text-white text-sm" />
          <span className="font-bold text-white hidden md:block text-sm">
            {t("addNew")}
          </span>
        </button>
      </div>

      <div className="relative">
        <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {subCategoriesLoading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 animate-pulse rounded-xl"
              />
            ))
            : subCategoriesData.map((sub) => (
              <SubCategoryCard
                key={sub.id}
                id={sub.id}
                categoryId={categoryId}
                name={sub.name || ""}
                onEdit={() => handleEdit(sub)}
              />
            ))}
        </div>
      </div>

      <SubCategoryModal
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        data={
          mode === "edit" && selected
            ? { id: selected.id, name: selected.name }
            : undefined
        }
        loading={mode === "add" ? createLoading : updateLoading} // pass the correct loading
        onSave={handleSave}
      />
    </>
  );
};

export default SubCategoryGrid;