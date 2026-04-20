"use client";

import Image from "next/image";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

interface Props {
  id: string;
  name: string;
  image: string;
}

const AdminCategoryCard: React.FC<Props> = ({ id, name, image }) => {

  return (
    <Link href={`/admin/categories/${id}`} className="block">
      <div className="rounded-lg bg-white box-shadow hover:shadow-md transition cursor-pointer">
        <div className="p-1.5">
          <div className="relative w-full aspect-[4/3] rounded overflow-hidden bg-gray-50">
            <Image src={image} alt={name} fill className="object-contain" />
          </div>
        </div>

        <div className="px-3 pb-3 flex items-center justify-between gap-2">
          <h3 className="text-xs title-color line-clamp-1">{name}</h3>
          <FiExternalLink size={16} className="opacity-70 hover:opacity-100 transition" />

        </div>
      </div>
    </Link>
  );
};

export default AdminCategoryCard;
