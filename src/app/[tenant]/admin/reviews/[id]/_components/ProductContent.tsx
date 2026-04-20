"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchReviewsByProduct, deleteReview, UserProductReview } from "@/rtk/slices/userProductReviewSlice/userProductReviewSlice";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import SectionHeader from "@/app/admin/_components/SectionHeader";
import NoData from "@/components/noData/NoData";

/* =========================
   Skeleton
========================= */
function CardReviewSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 flex justify-between animate-pulse">
            <div className="flex gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-gray-200" />

                <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-gray-200 rounded" />

                    <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                        ))}
                    </div>

                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-2/3 bg-gray-200 rounded" />
                </div>
            </div>

            <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
    );
}

/* =========================
   Card Review
========================= */
function CardReview({ review }: { review: UserProductReview }) {
    const t = useTranslations();
    const dispatch = useAppDispatch();

    const date = new Date(review.createdAt);
    const formattedDate = `${date.getDate()} ${
        t(`months.${date.getMonth() + 1}`)
    } ${date.getFullYear()}, ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

    const confirmDelete = () => {
        toast.custom((toastId) => (
            <div className="bg-white rounded-xl shadow-lg p-4 w-[320px]">
                <p className="text-sm font-medium mb-3">
                    {t("Are you sure you want to delete this review?")}
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(toastId)}
                        className="px-3 py-1.5 bg-gray-100 rounded-md text-sm"
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
                                toast.error(t("Failed to delete review"));
                            }
                        }}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm"
                    >
                        {t("Delete")}
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 flex justify-between hover:shadow-lg transition">
            
            <div>
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#2B7FFF33] flex items-center justify-center text-[#51A2FF] font-bold">
                        {review.userName.charAt(0)}
                    </div>

                    <div>
                        <div className="font-semibold">{review.userName}</div>

                        <div className="flex gap-1 text-yellow-500">
                            {Array.from({ length: review.rate }).map((_, i) => (
                                <Star key={i} size={16} fill="currentColor" />
                            ))}
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

            <Trash2
                size={18}
                className="cursor-pointer hover:text-red-500 transition"
                onClick={confirmDelete}
            />
        </div>
    );
}

/* =========================
   Page
========================= */
export default function ProductContent() {
    const params = useParams();
    const id = params?.id;

    const t = useTranslations();
    const dispatch = useAppDispatch();

    const { items, loading } = useAppSelector(
        (s) => s.userProductReview
    );

    useEffect(() => {
        if (id) {
            dispatch(fetchReviewsByProduct({ productId: Number(id) }));
        }
    }, [dispatch, id]);

    return (
        <div className="p-4 md:p-8 space-y-6">
            
            <SectionHeader
                title={t("reviewsTitle")}
                subtitle={t("reviewsSubtitle")}
            />

            {/* Loading */}
            {loading && (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <CardReviewSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Data */}
            {!loading && items.length > 0 && (
                <div className="space-y-4">
                    {items.map((review) => (
                        <CardReview
                            key={review.reviewId}
                            review={review}
                        />
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && items.length === 0 && <NoData />}
        </div>
    );
}