"use client";
import CenterSection from './CenterSection';
import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { useEffect } from 'react';
import { fetchBanners } from '@/rtk/slices/banner/bannerSlice';
import { fetchSlider } from '@/rtk/slices/slider/sliderSlice';

export default function HomeHeroSection() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchBanners());
        dispatch(fetchSlider());
    }, [dispatch]);

    // const { loading: bannerLoading } = useAppSelector((s) => s.banner);
    const { loading: sliderLoading } = useAppSelector((s) => s.slider);

    if (sliderLoading) {
        return (
            <section className="container mx-auto py-6 px-4 lg:px-2 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-auto lg:h-138">
                {/* Center Skeleton */}
                <div className="lg:col-span-12 lg:grid lg:grid-rows-3 gap-4 h-full">
                    {/* Slider Skeleton */}
                    <div className="row-span-1 lg:row-span-3 relative rounded-lg overflow-hidden h-87.5 lg:h-full mb-5 lg:mb-0">
                        <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="container mx-auto py-6 px-2 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-auto lg:h-138">
            <CenterSection />
        </section>
    );
}
