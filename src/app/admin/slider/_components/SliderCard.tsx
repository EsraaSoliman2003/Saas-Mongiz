"use client";

import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/rtk/hooks";
import { deleteSlider } from "@/rtk/slices/slider/sliderSlice";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface SliderCardProps {
    slider: {
        id: string;
        images: string[];
        text: string;
        link?: string;
    };
}

const SliderCard: React.FC<SliderCardProps> = ({ slider }) => {
    const t = useTranslations();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleEdit = () => {
        router.push(`/admin/slider/edit/${slider.id}`);
    };

    const handleDelete = async () => {
        toast.custom((toastId) => (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-[340px] space-y-4">

                {/* Message */}
                <p className="text-sm font-medium leading-relaxed text-gray-800">
                    {t("Are you sure you want to delete this slider?")}
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
                                await dispatch(deleteSlider(Number(slider.id)));
                                toast.success(t("Slider deleted successfully"));
                            } catch (e) {
                                toast.error(typeof e === "string" ? e : t("Failed to delete Slider"));
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
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 relative">
            {/* First Image */}
            {slider.images && slider.images.length > 0 ? (
                <div className="w-full h-48 relative group">
                    <img
                        src={slider.images[0]}
                        alt={slider.text || "slider image"}
                        className="w-full h-full object-cover"
                    />

                    {/* Edit & Delete Buttons */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                            href={`/admin/slider/edit?id=${slider.id}`}
                            className="bg-white p-1.5 rounded-full shadow hover:bg-blue-500 hover:text-white transition-colors"
                        >
                            <Edit size={16} />
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-white p-1.5 rounded-full shadow hover:bg-red-500 hover:text-white transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                </div>
            )}

            {/* Text & Link */}
            <div className="p-4 text-center space-y-2">
                <p
                    className="text-lg font-medium text-gray-800 truncate"
                    title={slider.text || "Untitled"}
                >
                    {slider.text || "Untitled"}
                </p>
                {slider.link && (
                    <a
                        href={slider.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline truncate block"
                        title={slider.link}
                    >
                        {slider.link}
                    </a>
                )}
            </div>
        </div>
    );
};

export default SliderCard;