"use client"
import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { fetchCouponsData } from '@/rtk/slices/coupon/couponSlice';
import { useEffect } from 'react';
import CouponGrid from './_components/CouponGrid';

export default function page() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCouponsData())
  }, [dispatch])

  return (
    <section className="p-4 lg:p-10">
      <CouponGrid />
    </section>
  )
}
