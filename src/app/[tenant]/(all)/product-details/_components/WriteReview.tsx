"use client";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { addUserProductReview } from "@/rtk/slices/productDetails/productDetailsSlice";
import Image from "next/image";
import Rating from "./StarRating";
import { X } from "lucide-react";

type Props = {
  productId?: number;
};

const WriteReview = ({ productId }: Props) => {
  const { token } = useAuth();
  const { push } = useRouter();
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const { addReviewLoading, addReviewError } = useAppSelector(
    (s) => s.productDetails
  );

  const [rate, setRate] = useState<number>(5);
  const [review, setReview] = useState<string>("");
  const [open, setOpen] = useState(false);

  const canSend = useMemo(() => {
    return !!productId && rate >= 1 && rate <= 5 && review.trim().length > 0;
  }, [productId, rate, review]);

  const onSend = async () => {
    if (!canSend || !productId) return;
    try {
      await dispatch(addUserProductReview({ productId, rate, review })).unwrap();
      // success → close modal and reset form
      setReview("");
      setRate(5);
      setOpen(false);
    } catch (error) {
      // error is already in store, modal stays open to show the message
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-3000 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity"
          onClick={() => setOpen(false)} // close on backdrop click
        >
          {/* Modal Card */}
          <div
            className="w-full max-w-md bg-white rounde shadow-2xl pt-12 md:pt-14 px-8 md:px-5 pb-5 relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Close Icon (top right) */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X />
            </button>

            <h3 className="font-semibold text-xl text-gray-800 mt-4 text-center">
              {t("Session Feedback")}
            </h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              {t("Rate the product and help us improve")}
            </p>

            {/* Rating Section */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col items-center gap-2">
              <Rating value={rate} onChange={setRate} />
              <span className="ml-2">{rate}/5 {t("stars")}</span>
            </div>

            {/* Review Input */}
            <textarea
              placeholder={t("Write your review")}
              className="w-full px-6 py-4 border border-gray-200 h-51.5 mt-6 resize-none focus:outline-none  transition-shadow disabled:bg-gray-50 disabled:text-gray-400"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={addReviewLoading}
            />

            {/* Error Message with subtle animation */}
            {addReviewError && (
              <p className="text-sm text-red-500 mt-3 animate-shake">
                {addReviewError}
              </p>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-6 font-semibold text-sm">
              <button
                type="button"
                className="h-11.5 flex-1 bg-main text-white hover:bg-main-(--dark-color) transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-main shadow-md hover:shadow-lg"
                onClick={onSend}
                disabled={addReviewLoading || !canSend}
              >
                {addReviewLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-pulse">{t("Send")}</span>
                  </span>
                ) : (
                  t("Send")
                )}
              </button>
              <button
                type="button"
                className="h-11.5 flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        className="text-main font-semibold underline hover:text-main-(--dark-color) transition-colors"
        onClick={() => {
          token ? setOpen(true) : push(`/${useAppSelector((s) => s.settings.data?.id)}/login`);
        }}
      >
        {t("Write a Review")}
      </button>
    </>
  );
};

export default WriteReview;