"use client";

import Link from "next/link";
import Image from "next/image";
import { pen } from "@/assets";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { deleteCoupon } from "@/rtk/slices/coupon/couponSlice";

interface Props {
  id: number;
  code: string;
  discount: number;
}

const CouponCard: React.FC<Props> = ({ id, code, discount }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.coupon);

  const confirmDelete = () => {
    toast.custom((toastId) => (
      <div className="bg-white rounded-xl shadow-lg p-4 w-[320px]">
        <p className="text-sm font-medium mb-3">
          {t("Are you sure you want to delete this coupon?")}
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => toast.dismiss(toastId)}
            className="px-3 py-1.5 rounded-md text-sm bg-gray-100"
          >
            {t("Cancel")}
          </button>

          <button
            onClick={async () => {
              toast.dismiss(toastId);
              const res = await dispatch(deleteCoupon(id));

              if (deleteCoupon.fulfilled.match(res)) {
                toast.success(t("Coupon deleted successfully"));
              } else {
                toast.error(res.payload as string || t("Failed to delete coupon"));
              }
            }}
            disabled={loading}
            className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-50"
          >
            {t("Delete")}
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="rounded-2xl bg-white b-c p-5 flex items-center justify-between hover:shadow-md transition">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-main/10 flex items-center justify-center font-extrabold text-main text-lg">
          {discount}%
        </div>

        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold title-color">{code}</h3>
          <span className="text-xs text-gray-500">
            {t("Percentage off total order")}
          </span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/coupon/${id}`} className="relative w-6 h-6 block">
          <Image src={pen} alt="edit" fill sizes="24px" />
        </Link>

        <button
          type="button"
          onClick={confirmDelete}
          disabled={loading}
          className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete coupon"
        >
          <FiTrash2 size={24} />
        </button>
      </div>
    </div>
  );
};

export default CouponCard;
