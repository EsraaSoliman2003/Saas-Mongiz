"use client"
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import ProductSkeleton from '@/skeleton/ProductSkeleton';
import ProductsSection from '@/components/productsSection/ProductsSection';
import { fetchUserFavourites } from '@/rtk/slices/favourite/favouriteSlice';
import { useTranslations } from 'next-intl';
import Title from '@/components/title/Title';
import NoData from '@/components/noData/NoData';

export default function Products() {
    const t = useTranslations();
    const dispatch = useAppDispatch();
    const { favourites, loading } = useAppSelector((s) => s.favourite)

    useEffect(() => {
        dispatch(fetchUserFavourites())
    }, [])

    return (
        <>
            {/* Styled title */}
            <Title text={t("myFavourite")} />

            <div>
                {
                    loading
                        ? (<ProductSkeleton />)
                        : favourites?.length === 0
                            ? <NoData />
                            : (<ProductsSection products={favourites} />)
                }
            </div>
        </>
    )
}
