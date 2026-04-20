"use client";

import Link from "next/link";
import Image from "next/image";
import { pen } from "@/assets";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

import { useAppDispatch } from "@/rtk/hooks";
import { deleteBrand } from "@/rtk/slices/brands/brandsSlice";
import { useTranslations } from "next-intl";

interface Props {
  id: string;
  name: string;
}

const AdminBrandCard: React.FC<Props> = ({ id, name }) => {
  const t = useTranslations()
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    toast.custom((toastId) => (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-[340px] space-y-4">

        {/* Message */}
        <p className="text-sm font-medium leading-relaxed text-gray-800">
          {t("deleteConfirmBrand")} <span className="font-semibold">"{name}"</span>؟
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-900 text-sm hover:bg-gray-300 transition"
            onClick={() => toast.dismiss(toastId)}
          >
            {t("Cancel")}
          </button>

          <button
            type="button"
            className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition"
            onClick={async () => {
              toast.dismiss(toastId);
              try {
                await dispatch(deleteBrand(Number(id))).unwrap();
                toast.success(t("Brand deleted successfully"));
              } catch (e) {
                toast.error(typeof e === "string" ? e : t("Failed to delete brand"));
              }
            }}
          >
            {t("Delete")}
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="rounded-xl bg-white box-shadow p-5 flex items-center justify-between">
      <div>
        <h3 className="text-sm title-color line-clamp-1">{name}</h3>
      </div>

      <div className="flex items-center gap-6">
        <Link href={`/admin/brands/${id}/edit`} className="relative w-5 h-5 block">
          <Image src={pen} alt="edit" fill sizes="20px" />
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600 transition"
          aria-label="Delete brand"
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default AdminBrandCard;
