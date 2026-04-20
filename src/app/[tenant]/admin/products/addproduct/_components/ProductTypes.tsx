"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Tag, Plus, X } from 'lucide-react';
import { addType, removeType } from '@/rtk/slices/ui/ProductSlice';
import { RootState } from '@/rtk/store';

export default function ProductTypes() {
  const t = useTranslations('addProduct');
  const dispatch = useDispatch();
  const types = useSelector((state: RootState) => state.productDraft.types);
  const [typeInput, setTypeInput] = useState('');

  const addTypeHandler = () => {
    if (typeInput.trim()) {
      dispatch(addType(typeInput.trim()));
      setTypeInput('');
    }
  };

  const removeTypeHandler = (tag: string) => dispatch(removeType(tag));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTypeHandler();
    }
  };

  return (
    <section className="bg-white p-6 lg:p-8 w-full border border-gray-200">
      {/* Header unchanged */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-main bg-clip-text text-transparent">
          {t('types.title')}
        </h3>
      </div>

      {/* Tags list */}
      {types.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {types.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-gray-50 text-sm text-gray-700"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTypeHandler(tag)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input and add button */}
      <div className="flex gap-3">
        <input
          type="text"
          value={typeInput}
          onChange={(e) => setTypeInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('types.placeholder')}
          className="flex-1 py-2 px-4 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
        />
        <button
          type="button"
          onClick={addTypeHandler}
          disabled={!typeInput.trim()}
          className="py-2 px-6 font-semibold text-white bg-main transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('types.add')}
        </button>
      </div>
    </section>
  );
}