"use client";

import Image from "next/image";
import Link from "next/link";
import { pen } from "@/assets";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { deleteProduct } from "@/rtk/slices/products/productsPaginationSlice";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Props {
  id: string;
  name: string;
  price: number;
  image?: string;
  status?: string;
}

const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  image,
  status = "Active",
}) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const { deleteLoading } = useAppSelector((s) => s.productsCrud);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toast.custom((toastId) => (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-[340px] space-y-4">

        {/* Message */}
        <p className="text-sm font-medium leading-relaxed text-gray-800">
          {t("deleteConfirmTitle")}
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
                setLoadingId(id);
                await dispatch(deleteProduct(Number(id))).unwrap();
                toast.success(t("deleteSuccess"));
              } catch (e) {
                toast.error(typeof e === "string" ? e : t("deleteError"));
              } finally {
                setLoadingId(null);
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
    <Link href={`/admin/reviews/${id}`} className="rounded-xl bg-white box-shadow">
      {/* Image */}
      <div className="px-2 pt-2">
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-50">
          {image && (
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex items-center justify-between">
        <div>
          <p className={`w-fit py-0.5 px-1.5 font-bold text-xs rounded-[6px] ${status === "Active" ? "bg-[#50EE7029] text-[#50EE70]" : "bg-red-100 text-red-600"}`}>
            {status === "Active" ? t("statusActive") : t("statusInactive")}
          </p>

          <h3 className="mt-2 text-sm title-color line-clamp-1">{name}</h3>
          {/* <p className="text-sm text-gray-600 mt-1">${price.toFixed(2)}</p> */}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {/* Edit */}
          {/* <Link
            href={`/seller/products/addproduct?id=${id}`}
            className="relative w-5 h-5 block"
            aria-label={t("edit")}
          >
            <Image src={pen} alt={t("edit")} fill sizes="20px" />
          </Link> */}

          {/* Delete */}
          <button
            type="button"
            onClick={(e) => handleDelete(e)}
            className="text-red-500 hover:text-red-600 transition relative"
            aria-label={t("deleteLabel")}
            disabled={deleteLoading && loadingId === id}
          >
            {deleteLoading && loadingId === id ? (
              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiTrash2 size={20} />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
