"use client";
import { Product } from "@/utils/dtos";
import { Heart, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { toggleUserFavourite } from "@/rtk/slices/favourite/favouriteSlice";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const { token } = useAuth();
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((s) => s.currency)
  const { currency } = useAppSelector((s) => s.currencyValue)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (token) {
      dispatch(toggleUserFavourite(product.id));
    } else {
      router.push("/login")
    }
  };

  return (
    <Link
      href={`/product-details/${product.id}`}
      className="group block w-full bg-white rounded-xl border border-gray-100 transition-all duration-300 ease-out cursor-pointer hover:shadow-lg active:scale-[0.97]"
    >
      <div className="relative flex items-center justify-center h-62 overflow-hidden rounded-t-xl">
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleFavorite(e);
          }}
          className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Heart
            size={20}
            className={`transition-colors duration-200 ${product.isFavourite ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-400"}`}
          />
        </button>

        <Image
          src={product.mainImage}
          alt={product.name || "Product image"}
          width={300}
          height={350}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div
        className={`p-3 space-y-1 text-center ${t("dir") === "rtl" ? "md:text-right" : "md:text-left"
          }`}
      >
        <h3 className="text-sm font-medium text-gray-800 line-clamp-1 transition-colors duration-200 hover:text-blue-600">
          {product.name}
        </h3>

        {product.rate || product.rate != 0 && (
          <div className="inline-flex items-center gap-1 text-sm bg-[#F5F6F9] px-2 py-1 rounded-md">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{product.rate}</span>
          </div>
        )}

        <div className="text-sm text-center md:text-left space-y-1">
          {/* Main Price */}
          <div className="font-bold text-base flex items-center justify-center md:justify-start">
            {(product.price * (data?.[currency || "USD"] ?? 1)).toFixed(2)}
            <span className="text-xs ml-1">{t("EGP")}</span>
          </div>

          {/* Old Price + Discount */}
          {(product.discount != null && product.discount > 0) ? (
            <div className="flex items-center gap-2 justify-center md:justify-start text-xs text-gray-400">
              <span className="line-through">
                {(product.mainPrice * (data?.[currency || "USD"] ?? 1)).toFixed(2)}{" "}
                {t("EGP")}
              </span>
              <span className="text-green-600 font-bold">{product.discount}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-center md:justify-start text-xs text-gray-400">
              <span className="line-through">
                &nbsp;
              </span>
              <span className="text-green-600 font-bold">{""}</span>
            </div>
          )}

        </div>

        <div className="text-[#858585] text-xs">بواسطة {product.seller?.sellerName}</div>
      </div>
    </Link>
  );
}
