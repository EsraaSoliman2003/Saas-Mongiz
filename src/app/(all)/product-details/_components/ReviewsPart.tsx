"use client";

import React, { useState } from "react";
import Rating from "@/utils/StarRating";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ReviewsSummaryApi, PaginationResponse, ProductReviewApi, removeReviewFromDetails } from "@/rtk/slices/productDetails/productDetailsSlice";
import { useAppDispatch } from "@/rtk/hooks";
import WriteReview from "./WriteReview";
import { Trash2 } from "lucide-react";
import { deleteReview } from "@/rtk/slices/userProductReviewSlice/userProductReviewSlice";
import { toast } from "sonner";

interface ReviewsPartProps {
  productId: number;
  reviewsSummary: ReviewsSummaryApi | null;
  reviews: PaginationResponse<ProductReviewApi> | null;
}

export default function ReviewsPart({ productId, reviewsSummary, reviews }: ReviewsPartProps) {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  if (!reviewsSummary || !reviews) {
    return <p>No reviews yet.</p>;
  }

  const { averageRate, totalReviews, ratesBreakdown } = reviewsSummary;
  const reviewItems = reviews.items || [];

  // Helper to get count for each star (1-5)
  const getCountForStar = (star: number) => ratesBreakdown[star] || 0;
  const confirmDelete = (id: number) => {
    toast.custom((toastId) => (
      <div className="bg-white rounded-xl shadow-lg p-4 w-[320px]">
        <p className="text-sm font-medium mb-3">
          {t("Are you sure you want to delete this review?")}
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
              const res = await dispatch(deleteReview(id));
              dispatch(removeReviewFromDetails(id));

              if (deleteReview.fulfilled.match(res)) {
                toast.success(t("Review deleted successfully"));
              } else {
                toast.error(res.payload as string || t("Failed to delete review"));
              }
            }}
            className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-50"
          >
            {t("Delete")}
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full">
      {/* Review Summary */}
      <h3 className="font-semibold mb-6">{t("Review")}</h3>

      <div className="flex flex-col md:flex-row gap-10 mb-10 items-center">
        {/* Average */}
        <div className="w-40 text-center">
          <p className="text-3xl font-bold">{averageRate.toFixed(1)}</p>
          <p className="text-sm text-gray-500 mb-4">
            {totalReviews} {t("Rating")}
          </p>
          <div dir="ltr" className="flex justify-center">
            <Rating value={averageRate} />
          </div>
        </div>

        {/* Distribution */}
        <div className="flex-1 space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = getCountForStar(star);
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3">
                <div dir="ltr">
                  <Rating value={star} />
                </div>
                <div className="flex-1 h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-main rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-14">
                  {count} {t("Rating")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comments */}
      <div className="flex justify-between w-full items-center  mb-6">
        <h3 className="font-semibold">{t("Comments")}</h3>
        <WriteReview productId={productId} />
      </div>

      <div className="space-y-12">
        {reviewItems.map((review) => (
          <div key={review.reviewId} className="space-y-3">
            {/* Header */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image
                  src={"/person.jpg"}
                  alt={review.userName}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>

              {/* User info + rating */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 w-full">
                    <div className="flex justify-between">
                      <p className="font-medium leading-tight">{review.userName}</p>
                      <div dir="ltr">
                        <Rating value={review.rate} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 justify-between">
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {/* If you have color/supplier fields, display them here */}
                      {
                        review.isMe && (
                          <Trash2
                            size={18}
                            className="cursor-pointer hover:text-red-500 transition-colors duration-200"
                            onClick={() => { confirmDelete(review.reviewId) }}
                          />
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment */}
            <p className="text-sm text-gray-600 leading-relaxed pr-14">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Load More */}
      {reviews.hasNextPage && (
        <div className="mt-20 text-center">
          <button
            onClick={() => {
              // Dispatch fetchProductDetails with next page
              // You'll need to manage pagination state
            }}
            className="bg-gray-900 text-white px-20 py-2 rounded-md text-sm hover:bg-gray-800 cursor-pointer"
          >
            {t("ShowMore")}
          </button>
        </div>
      )}
    </div>
  );
}