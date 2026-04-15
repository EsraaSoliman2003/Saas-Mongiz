"use client";

import Image from "next/image";
import { ExternalLink, Type } from "lucide-react";

interface Props {
  id: string;
  image: string;
  link?: string;
  text?: string;
}

const AdminBannerCard: React.FC<Props> = ({ id, image, link, text }) => {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow hover:shadow-md transition">
      <div className="relative w-full aspect-[16/5] bg-gray-50">
        <Image
          src={image || "/placeholder.png"}
          alt={`banner-${id}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Text section */}
      {text && (
        <div className="px-3 py-2 bg-white text-sm text-gray-700 flex items-center gap-2 border-t border-gray-200">
          <Type size={14} className="text-gray-400" />
          <span className="line-clamp-2">{text}</span>
        </div>
      )}

      {/* Link section */}
      <div className="px-3 py-2 bg-white text-sm text-gray-600 flex items-center gap-2 border-t border-gray-200">
        <ExternalLink size={14} className="text-gray-400" />
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-blue-600 hover:underline"
          >
            {link}
          </a>
        ) : (
          <span className="italic text-gray-400">{`No link`}</span>
        )}
      </div>
    </div>
  );
};

export default AdminBannerCard;