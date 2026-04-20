"use client";

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { setField } from '@/rtk/slices/ui/ProductSlice';
import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { fetchBrands } from '@/rtk/slices/brands/brandsSlice';
import { fetchCategories } from '@/rtk/slices/category/categoriesSlice';
import { fetchSubCategories } from '@/rtk/slices/subCategories/subCategoriesSliceHome1';
import Description from './TextEditor';
import Media from './Media';
import Pricing from './Pricing';

type Props = {
  mainFile: File | null;
  setMainFile: React.Dispatch<React.SetStateAction<File | null>>;
  imageFiles: File[];
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
};


export default function BasicInformation({
  mainFile,
  setMainFile,
  imageFiles,
  setImageFiles,
}: Props) {
  const t = useTranslations('addProduct');
  const dispatch = useAppDispatch();
  const { name, brandId, categoryId, subCategoryId } = useAppSelector(
    (state) => state.productDraft
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Convert to appropriate type (number for ids)
    let parsedValue: string | number | null = value;
    if (name === 'categoryId') {
      parsedValue = value ? Number(value) : null;
    } else if (name === 'subCategoryId' || name === 'brandId') {
      parsedValue = value || null;
    }
    dispatch(setField({ key: name as any, value: parsedValue }));
  };


  const { items: brands, loading: brandsLoading } = useAppSelector((s) => s.brands);
  const { data: categories, loading: categoriesLoading } = useAppSelector((s) => s.categories);
  const {
    data: subCategoriesData,
    loading: subCategoriesLoading,
  } = useAppSelector((s) => s.subCategoriesHome1);

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCategories());
    if (categoryId) {
      dispatch(fetchSubCategories(categoryId));
    }
  }, [dispatch, categoryId]);


  return (
    <>
      <section className="bg-white p-6 lg:p-8 w-full border border-gray-200">
        {/* Header unchanged */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-main bg-clip-text text-transparent">
            {t('basicInfo.title')}
          </h3>
        </div>

        {/* Form fields */}
        <div className="space-y-6">
          {/* Name and Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('basicInfo.name')} <span className='text-red-600'>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
                placeholder={t('basicInfo.namePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('basicInfo.brand')}
              </label>
              <select
                name="brandId"
                value={brandId || ''}
                onChange={handleChange}
                className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all cursor-pointer appearance-none"
              >
                <option value="">{t('basicInfo.selectBrand')}</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('basicInfo.category')} <span className='text-red-600'>*</span>
              </label>
              <select
                name="categoryId"
                value={categoryId || 0}
                onChange={handleChange}
                className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all cursor-pointer appearance-none"
              >
                <option value={0}>{t('basicInfo.selectCategory')}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('basicInfo.subcategory')} <span className='text-red-600'>*</span>
              </label>
              <select
                name="subCategoryId"
                value={subCategoryId || ''}
                onChange={handleChange}
                className="w-full py-2 px-4 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all cursor-pointer appearance-none"
              >
                <option value="">{t('basicInfo.selectSubcategory')}</option>
                {subCategoriesData
                  .filter((sub) => sub.categoryId === categoryId)
                  .map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <Description />

      <Media
        mainFile={mainFile}
        setMainFile={setMainFile}
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
      />

      <Pricing />
    </>
  );
}