"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function HomeSliderSkeleton() {
  return (
    <section className="">
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        centeredSlides
        loop={false}
        className="h-full"
      >
        {Array.from({ length: 3 }).map((_, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative h-104.5 md:h-50 lg:h-75 xl:h-140 w-full overflow-hidden bg-gray-200 animate-pulse" />
          </SwiperSlide>
        ))}
        <div className="h-10"></div>
      </Swiper>
    </section>
  );
}
