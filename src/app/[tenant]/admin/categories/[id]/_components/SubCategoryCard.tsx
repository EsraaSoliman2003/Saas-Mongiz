"use client";

import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { IoExtensionPuzzle } from "react-icons/io5";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { deleteSubCategory } from "@/rtk/slices/subCategories/subCategoriesSlice";
import { useState } from "react";

interface Props {
  id: number;
  name: string;
  categoryId: number;
  onEdit: () => void;
}

const SubCategoryCard: React.FC<Props> = ({ id, name, categoryId, onEdit }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  // Get delete loading state for this specific subcategory
  const isDeleting = useAppSelector(
    (state) => state.subCategories.loading.delete[id] || false
  );

  const handleDelete = () => {
    if (isDeleting) return; // prevent multiple clicks

    // Show confirmation toast
    toast.custom(
      (tId) => (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          <p className="text-sm text-gray-800 mb-3">
            {t("Are you sure you want to delete this subcategory?")}
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              onClick={() => toast.dismiss(tId)}
            >
              {t("Cancel")}
            </button>
            <button
              className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
              onClick={async () => {
                toast.dismiss(tId);
                try {
                  await dispatch(deleteSubCategory({ categoryId, id })).unwrap();
                  toast.success(t("Sub Category deleted successfully"));
                } catch (err) {
                  toast.error(typeof err === "string" ? err : t("Failed to delete"));
                }
              }}
            >
              {t("Delete")}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity } // keep until user action
    );
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-5">
      <div className="flex items-center gap-4">
        {/* Icon with gradient background */}
        <div className="shrink-0 w-12 h-12 bg-linear-to-br from-(--main-color)/10 to-(--main-color)/10 rounded-lg flex items-center justify-center">
          <IoExtensionPuzzle className="text-(--main-color) w-6 h-6" />
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-800 line-clamp-1 transition-colors">
            {name}
          </h3>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-(--main-color) hover:bg-(--main-color)/10 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            title={t("Edit")}
            disabled={isDeleting}
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`
              p-2 rounded-full transition flex items-center justify-center
              ${isDeleting
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-500 hover:text-red-600 hover:bg-red-50"
              }
            `}
            title={t("Delete")}
          >
            {isDeleting ? (
              <svg
                className="animate-spin h-4 w-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <FiTrash2 size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryCard;