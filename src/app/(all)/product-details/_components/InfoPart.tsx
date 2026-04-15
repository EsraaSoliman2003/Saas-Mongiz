"use client";

import React, { useState } from "react";
import Rating from "@/utils/StarRating";
import { Heart, ShoppingBag, Check, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { plus, minus } from "@/assets";
import MainButton from "@/components/MainButton/MainButton";
import { useTranslations } from "next-intl";
import { ProductApi } from "@/rtk/slices/productDetails/productDetailsSlice";
import { toggleUserFavourite } from "@/rtk/slices/favourite/favouriteSlice";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProductSetting from "./ProductSetting";
import ProductTypes from "./ProductTypes";
import { CartItem, SelectedOptions } from "@/rtk/slices/ui/cartSlice";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import AddToCartPopup from "@/components/cart/AddToCartPopup";

interface InfoPartProps {
  product: ProductApi;
}


export default function InfoPart({ product }: InfoPartProps) {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(product.isFavourite ?? false);
  const { token } = useAuth();
  const router = useRouter();

  type ProductSelections = {
    color?: { id: number; name: string | null };
    size?: { id: number; name: string | null };
    volume?: { id: number; name: string | null };
    shape?: { id: number; name: string | null };
    weight?: { id: number; name: string | null };
    memory?: { id: number; name: string | null };
  };
  const [productWillAdd, setProductWillAdd] = useState<ProductSelections>({});

  const { add } = useCart();

  const [showPopup, setShowPopup] = useState(false);
  const handleAddToCart = () => {
    const selectedOptions: SelectedOptions = {
      color: productWillAdd.color,
      size: productWillAdd.size,
      volume: productWillAdd.volume,
      shape: productWillAdd.shape,
      weight: productWillAdd.weight,
      memory: productWillAdd.memory,
    };

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.mainImage,
      qty: quantity,
      maxQty: product.limitProducts || product.quantity,
      selectedOptions,
    };

    add(cartItem);

    setShowPopup(true);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFav(!isFav);
    dispatch(toggleUserFavourite(product.id));
  };

  const isOutOfStock = (product.quantity ?? 0) <= 0;

  const { data } = useAppSelector((s) => s.currency)
  const { currency } = useAppSelector((s) => s.currencyValue)

  const priceSpan = () => {
    const selectedCurrency = t("EGP");

    const rate = data?.[selectedCurrency] ?? 1;

    const price = product.price * rate;
    const mainPrice = product.mainPrice * rate;

    return (
      <>
        {/* Price and Discount */}
        <div className="mt-6 flex items-baseline flex-wrap gap-3">
          <span className="text-3xl md:text-4xl font-bold text-gray-900">
            {price.toFixed(2)}
            <span className="text-xl">{t(selectedCurrency)}</span>
          </span>
          {product.mainPrice && product.mainPrice > product.price && (
            <>
              <span className="text-lg text-gray-400 line-through">
                {mainPrice.toFixed(2)} {selectedCurrency}
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                {product.discount}% OFF
              </span>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Header Section */}
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{t("Brand")}:</span>
              <span className="text-gray-800">{product.brand?.name || "—"}</span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <Rating value={product.averageRate || 0} />
              <span className="text-sm text-gray-500">
                ({product.reviewCount} {t("reviews")})
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              if (token) {
                handleToggleFavorite(e)
              } else {
                router.push("/login")
              }
            }}
            className={`p-3 hidden lg:inline-block rounded-full transition-all duration-300 ${isFav
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={20}
              className={isFav ? "fill-red-500 text-red-500" : ""}
            />
          </button>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success(t("copySucces"));
              } catch (error) {
                toast.error("Error copying link");
              }
            }}
            className={`p-3 hidden lg:inline-block rounded-full transition-all duration-300 bg-gray-50 text-gray-400 hover:bg-gray-100`}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            disabled={isOutOfStock}
            title={t("Share")}
          >
            <Share2 size={20} />
          </button>
        </div>

        {priceSpan()}
      </div>

      {/* Product Setting */}
      <ProductSetting product={product} productWillAdd={productWillAdd} setProductWillAdd={setProductWillAdd} />

      {/* Quantity and Add to Cart */}
      <div className="px-6 md:px-8 py-6 border-t border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-medium text-gray-700">{t("Quantity")}:</span>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <div className="w-3.5 h-3.5 relative">
                <Image src={minus} alt="minus" fill className="object-contain" />
              </div>
            </button>
            <span className="w-12 text-center font-semibold text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => {
                if (quantity < (product.limitProducts || 99)) {
                  setQuantity((prev) => prev + 1);
                }
              }}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity >= (product.limitProducts || 99)}
              aria-label="Increase quantity"
            >
              <div className="w-3.5 h-3.5 relative">
                <Image src={plus} alt="plus" fill className="object-contain" />
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <MainButton
            text={t("AddToCart")}
            className="flex-1 py-3.5 bg-main hover:bg-(--main-color) text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-(--main-color) focus:ring-offset-2"
            onClick={handleAddToCart}
            icon={<ShoppingBag size={18} className="mr-2" />}
            disabled={isOutOfStock}
          />
        </div>

        {isOutOfStock && (
          <p className="mt-3 text-sm text-red-600 font-medium">
            {t("outOfStock")}
          </p>
        )}
      </div>

      <AddToCartPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}