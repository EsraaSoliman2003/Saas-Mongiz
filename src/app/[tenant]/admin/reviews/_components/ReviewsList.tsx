"use client";
import { Star, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

type ReviewStatus = "verified" | "pendingReview";

type Review = {
  name: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
};

export default function ReviewsList() {
  const t = useTranslations();

  const reviews: Review[] = [
    {
      name: "احمد على",
      rating: 5,
      comment: "منتح ممتاز وتوصيل سريع",
      date: "2024-01-15",
      status: "verified",
    },
    {
      name: "اسراء سليمان",
      rating: 4,
      comment: "منتح ممتاز وتوصيل سريع",
      date: "2024-01-15",
      status: "verified",
    },
  ];

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <div
          key={index}
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
                {review.name.charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {review.name}
                  </span>
                </div>

                <div className="text-yellow-500 flex gap-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill="currentColor"
                        strokeWidth={1}
                      />
                    ))}
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full
                      ${
                        review.status === "verified"
                          ? "bg-green-100 text-green-700"
                          : "bg-(--main-color)/10 text-main"
                      }
                    `}
                  >
                    {t(review.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 mt-2">
              {review.comment}
            </div>

            <div className="text-xs text-gray-400 mt-1">
              {review.date}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 text-gray-400">
            <ThumbsUp
              size={18}
              className="cursor-pointer hover:text-green-600 transition-colors duration-200"
            />

            <ThumbsDown
              size={18}
              className="cursor-pointer hover:text-red-600 transition-colors duration-200"
            />

            <Trash2
              size={18}
              className="cursor-pointer hover:text-red-500 transition-colors duration-200"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
