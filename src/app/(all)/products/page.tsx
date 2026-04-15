"use client";

import ProductsSectionWithPagination from './_components/ProductsSectionWithPagination'
import ProductsSection from '@/components/productsSection/ProductsSection';
import FiltersDesktop from './_components/FiltersDesktop';
import FiltersMobile from './_components/FiltersMobile';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { useEffect } from 'react';
import ProductSkeleton from '@/skeleton/ProductSkeleton';
import NoData from '@/components/noData/NoData';
import { fetchProductsByCategory } from '@/rtk/slices/products/productsSliceSimple';

type Props = {}

export default function page({ }: Props) {
    const t = useTranslations();
    const dispatch = useAppDispatch();

    const { data, loading } = useAppSelector(
        (s) => s.products
    );

    return (
        <>
            <div className='container'>
                <div className='grid grid-cols-12 py-0 gap-5 sm:gap-5 md:gap-6 lg:gap-8 mb-20 mt-0 md:mt-10'>
                    <div className='hidden md:block col-span-3'>
                        <FiltersDesktop />
                    </div>
                    <div className='col-span-12 md:col-span-9'>
                        <FiltersMobile />
                        <ProductsSectionWithPagination />
                    </div>
                </div>

                <div className="mb-26 pt-20 md:pt-0">
                    <h2 className="text-xl font-medium px-5"> {t("RecentlyViewed")} </h2>
                    {loading ? (
                        <div className="container">
                            <ProductSkeleton count={5} />
                        </div>
                    ) : data?.length > 0 ? (
                        <ProductsSection products={data} className="container" />
                    ) : (
                        <NoData />
                    )}
                </div>
            </div>
        </>

    )
}
