import React from 'react'
import { toast } from 'sonner';
import { Star, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { deleteReview, UserProductReview } from '@/rtk/slices/userProductReviewSlice/userProductReviewSlice';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/rtk/hooks';

type Props = {
    review: UserProductReview;
}

export default function CardReview({ review }: Props) {
    const t = useTranslations();
    const dispatch = useAppDispatch();

    const date = new Date(review.createdAt);
    const day = date.getDate();
    const month = t(`months.${date.getMonth() + 1}`);
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes}`;

    const confirmDelete = () => {
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
                            const res = await dispatch(deleteReview(review.reviewId));

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
        <div
            className="
                    bg-white rounded-2xl p-5 border border-gray-100
                    flex justify-between items-start
                    transition-all duration-300 ease-in-out
                    hover:shadow-lg
                "
        >
            {/* Right Side */}
            <div>
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#2B7FFF33] flex items-center justify-center text-[#51A2FF] font-bold">
                        {review.userName.charAt(0)}
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">
                                {review.userName}
                            </span>
                        </div>

                        <div className="text-yellow-500 flex gap-3">
                            <div className="flex items-center gap-1 text-yellow-500">
                                {Array.from({ length: review.rate }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill="currentColor"
                                        strokeWidth={1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-gray-500 mt-2">
                    {review.comment}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                    {formattedDate}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 text-gray-400">
                <Trash2
                    size={18}
                    className="cursor-pointer hover:text-red-500 transition-colors duration-200"
                    onClick={confirmDelete}
                />
            </div>
        </div>

    )
}
