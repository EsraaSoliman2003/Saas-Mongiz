"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { fetchProductDetails, clearProductDetails } from "@/rtk/slices/productDetails/productDetailsSlice";
import ImagesPart from "../_components/ImagesPart";
import InfoPart from "../_components/InfoPart";
import ReviewsPart from "../_components/ReviewsPart";
import ProductsSection from "@/components/productsSection/ProductsSection";
import DescPartWithStyles from "../_components/DescPartWithStyles";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import NoData from "@/components/noData/NoData";
import ProductDetailsSkelton from "@/skeleton/ProductDetailsSkelton";

export default function ProductPage() {
  const t = useTranslations();
  const params = useParams();
  const productId = Number(params.id);
  const dispatch = useAppDispatch();
  const { product, reviewsSummary, reviews, featuredProducts, loading, error } =
    useAppSelector((state) => state.productDetails);
  const [tab, setTab] = useState<"description" | "specs" | "reviews">("description");

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails({ productId }));
    }
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, productId]);

  if (loading) return <ProductDetailsSkelton />;
  if (error) return <div className="text-center py-10 text-red-500">  <NoData /> </div>;
  if (!product) return null;

  // Motion variants for sliding
  const tabVariants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div className="container max-w-5xl mx-auto p-4 mb-16 mt-0 md:mt-4">
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <ImagesPart product={product} images={[product.mainImage, ...(product.images || [])]} />
        <InfoPart product={product} />
      </div>

      {/* TABS with smooth sliding */}
      <div className="mt-8 md:mt-16">
        <div className="relative flex gap-6 text-base font-medium border-b border-gray-200">
          {["description", "specs", "reviews"].map((item) => {
            const isActive = tab === item;
            return (
              <button
                key={item}
                onClick={() => setTab(item as typeof tab)}
                className={`pb-2 transition-colors duration-200 ${isActive ? "text-main" : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                {t(item.charAt(0).toUpperCase() + item.slice(1))}
              </button>
            );
          })}

          {/* Animated Indicator */}
          <motion.div
            className="absolute bottom-0 h-0.5 bg-main"
            layoutId="tab-indicator"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              width: `${document.querySelector(`[data-tab="${tab}"]`)?.clientWidth || 0}px`,
              x: document.querySelector(`[data-tab="${tab}"]`)?.getBoundingClientRect().left || 0,
            }}
          />
        </div>

        {/* Tab content container – uses AnimatePresence + motion */}
        <div className="mt-6 relative">
          <AnimatePresence mode="wait" initial={false}>
            {tab === "description" && (
              <motion.div
                key="description"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="w-full"
                layout // important: allows smooth height adjustment
              >
                <DescPartWithStyles desc={product.description} />
              </motion.div>
            )}

            {tab === "specs" && (
              <motion.div
                key="specs"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="w-full"
                layout
              >
                <div className="rounded-lg border border-gray-100 overflow-hidden">
                  {product.additionalData && (
                    <div>
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <span className="font-medium text-gray-700">
                          {t("Information")}
                        </span>
                      </div>

                      {product.additionalData
                        .filter((item) => {
                          // For types 1–6, only include if there's exactly 1 value
                          if ([1, 2, 3, 4, 5, 6].includes(item.type)) {
                            return item.values?.length === 1;
                          }
                          // For other types, include regardless of value count
                          return true;
                        })
                        .map((item, index, arr) => (
                          <div
                            key={item.key}
                            className={`flex justify-between items-center px-3 py-2 text-sm ${index !== arr.length - 1 ? "border-b border-gray-100" : ""
                              }`}
                          >
                            <span className="font-medium text-gray-600">
                              {item.key}
                            </span>
                            {item.type !== 1 ? (
                              <span className="text-gray-800">
                                {item.values?.[0]}
                              </span>
                            ) : (
                              <span
                                className="inline-block w-8 h-8  hover:border-gray-400 transition-all"
                                style={{ backgroundColor: item.values?.[0] }}
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {tab === "reviews" && (
              <motion.div
                key="reviews"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="w-full"
                layout
              >
                <ReviewsPart productId={product.id} reviewsSummary={reviewsSummary} reviews={reviews} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FEATURED / RECENTLY VIEWED */}
      {featuredProducts && featuredProducts.items.length > 0 && (
        <div className="mt-12 md:mt-20">
          <h2 className="text-lg font-medium text-gray-800 mb-4">{t("RecentlyViewed")}</h2>
          <ProductsSection products={featuredProducts.items} />
        </div>
      )}
    </div>
  );
}