"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import ProductCard from "../productCard/ProductCard";
import { Product } from "@/utils/dtos";
import "./style.css";

interface props {
  products: Product[];
  className?: string;
}

export default function ProductsSection({ products, className }: props) {
  return (
    <div className={`mt-8 ${className}`}>
      <Swiper
        modules={[Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 2 },
          480: { slidesPerView: 3 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
      >
        {products?.map((product) => (
          <SwiperSlide key={product.id} className="pb-9">
            <ProductCard
              product={product}
            // onAddToCart={(p) => console.log("add to cart", p)}
            // onToggleFavorite={(p) => console.log("favorite", p)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
