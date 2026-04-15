"use client";

import AdminCategoryCard from "./AdminCategoryCard";
import SectionHeader from "../../_components/SectionHeader";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { useEffect } from "react";
import { fetchCategories } from "@/rtk/slices/category/categoriesSlice";
import CategorySkeleton from "@/skeleton/CategorySkeleton";
import NoData from "@/components/noData/NoData";
import { useTranslations } from "next-intl";

const CategoryGrid = () => {
  const t = useTranslations();
  const { data, loading } = useAppSelector((s) => s.categories);
  const dispatch = useAppDispatch();

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <>
        <SectionHeader
          title={t("Categories")}
          buttonText={t("addNew")}
          link="/admin/categories/create"
          subtitle={t("Manage your categories here")} // <-- your subtitle
        />
        <CategorySkeleton />
      </>
    );
  }

  return (
    <>
      <SectionHeader
        title={t("Categories")}
        buttonText={t("addNew")}
        link="/admin/categories/create"
        subtitle={t("Manage your categories here")} // <-- your subtitle
      />

      {data && data.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {data.map((cat) => (
            <AdminCategoryCard
              key={cat.id}
              id={String(cat.id)}
              name={cat.name}
              image={cat.image ?? "/test.jpg"}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <NoData />
        </div>
      )}
    </>
  );
};

export default CategoryGrid;