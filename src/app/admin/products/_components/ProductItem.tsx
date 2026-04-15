"use client";

import { Eye, Pencil, Trash2, GripVertical } from "lucide-react";
import Image from "next/image";

type ProductItemProps = {
  name: string;
  description: string;
  price: string;
};

export default function ProductItem({ name, description, price }: ProductItemProps) {
  return (
    <div
      className="
        group 
        flex flex-col sm:flex-row 
        sm:items-center 
        justify-between 
        bg-white 
        rounded-xl 
        p-3 sm:p-4 
        transition-all duration-300 
        border border-gray-100 
        hover:border-(--main-color)/10
        gap-3
      "
    >
      {/* Image + Info */}
      <div className="flex items-center gap-3 flex-1">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#CBCBCB1A] flex items-center justify-center overflow-hidden">
          <Image
            src="/electronic.png"
            alt="electronic"
            width={40}
            height={40}
            className="object-contain w-8 h-8 sm:w-10 sm:h-10"
          />
        </div>

        <div>
          <h3 className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-[#FF6900] transition-colors">
            {name}
          </h3>

          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {description}
          </p>

          <p className="text-sm sm:text-base font-bold text-main mt-2">
            {price}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3 text-gray-400 justify-end">
        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group/btn">
          <Trash2 size={16} className="group-hover/btn:text-red-500 transition-colors" />
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn">
          <Pencil size={16} className="group-hover/btn:text-gray-700 transition-colors" />
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn">
          <Eye size={16} className="group-hover/btn:text-gray-700 transition-colors" />
        </button>

        <div className="p-2 cursor-move hover:bg-gray-100 rounded-lg transition-colors">
          <GripVertical size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
