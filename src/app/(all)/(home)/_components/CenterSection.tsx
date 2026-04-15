"use client";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./style.css";
import MainButton from "@/components/MainButton/MainButton";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useAppSelector } from "@/rtk/hooks";
import Image from "next/image";

export default function CenterSection() {
  const t = useTranslations();
  const swiperRef = useRef<any>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const { data: sliderData } = useAppSelector((s) => s.slider);

  if (!sliderData.length) return null;

  return (
    <div className="lg:col-span-12 lg:grid lg:grid-rows-3 gap-4 h-full">
      {/* Center Slider */}
      <div className="row-span-1 lg:row-span-3 relative rounded-lg overflow-hidden h-[350px] lg:h-full group mb-5 lg:mb-0">
        <div className="relative rounded-lg overflow-hidden h-full hover:bg-black/10!">
          <div
            className={`${t("dir") === "rtl" ? "Sponsers" : "Sponsers SponsersLeft"
              } h-full relative hover:bg-black/10!`}
          >
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              className="h-full"
              slidesPerView={1}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet !bg-white !opacity-50",
                bulletActiveClass:
                  "swiper-pagination-bullet-active !opacity-100 !bg-white",
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={true}
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={20}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                // @ts-ignore
                swiper.params.navigation.prevEl = prevRef.current;
                // @ts-ignore
                swiper.params.navigation.nextEl = nextRef.current;
              }}
            >
              {sliderData.map((slide, index) => (
                <SwiperSlide key={slide.id} className="hover:bg-black/10">
                  <Link href={slide.link || "/"} className="block h-full relative">
                    <div className="relative w-full h-full overflow-hidden rounded-lg cursor-pointer">
                      <Image
                        src={slide.images[0] || "/placeholder.png"}
                        alt={slide.text || "slider image"}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover"
                        priority={index === 0}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/placeholder.png";
                        }}
                      />

                      {/* Hover Dark Overlay */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-100 z-10 pointer-events-none" />

                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-[5]" />
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}