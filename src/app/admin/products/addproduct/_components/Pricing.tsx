"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { DollarSign } from 'lucide-react';
import { setField } from '@/rtk/slices/ui/ProductSlice';
import { RootState } from '@/rtk/store';

export default function Pricing() {
  const t = useTranslations('addProduct');
  const dispatch = useDispatch();
  const { mainPrice, discount, quantity, limitProducts, limitStock } = useSelector(
    (state: RootState) => state.productDraft
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(setField({ key: name as any, value: value ? Number(value) : "" }));
  };

  return (
    <section className="bg-white p-6 lg:p-8 w-full border border-gray-200">
      {/* Header unchanged */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-main bg-clip-text text-transparent">
          {t('pricing.title')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('pricing.mainPrice')} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="mainPrice"
            value={mainPrice}
            onChange={handleChange}
            required
            min="0"
            className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('pricing.discount')}
          </label>
          <input
            type="number"
            name="discount"
            value={discount}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('pricing.quantity')}
          </label>
          <input
            type="number"
            name="quantity"
            value={quantity}
            onChange={handleChange}
            required
            min="0"
            className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
          />
        </div>

        {/* Limit Products */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('pricing.limitProducts')}
          </label>
          <input
            type="number"
            name="limitProducts"
            value={limitProducts}
            onChange={handleChange}
            min="0"
            className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
          />
        </div>

        {/* Limit Stock */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('pricing.limitStock')}
          </label>
          <input
            type="number"
            name="limitStock"
            value={limitStock}
            onChange={handleChange}
            min="0"
            className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
          />
        </div>
      </div>
    </section>
  );
}