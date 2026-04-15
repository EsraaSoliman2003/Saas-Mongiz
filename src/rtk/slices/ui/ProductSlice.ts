import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Type
// Color  = 1
// Volume = 2
// Size   = 3
// Shape  = 4
// Weight = 5
// Memory = 6
// Custom = 7

export type AdditionalDataItem = {
  id: number;
  type: number;
  key: string;
  values: string[];
};

export type Variant = {
  attributes: Record<string, string>;
  quantity: number;
};

export type ProductDraft = {
  name: string;
  brandId: number;
  categoryId: number;
  subCategoryId: number;
  description: string;

  mainPrice: number;
  discount: number;
  quantity: number;
  limitProducts: number;
  limitStock: number;

  mainImageUrl: string | null;
  imageUrls: string[];

  types: string[];
  keywords: string[];

  additionalData: AdditionalDataItem[];
  variants: Variant[];
};

const initialState: ProductDraft = {
  name: "",
  brandId: 0,
  categoryId: 0,
  subCategoryId: 0,
  description: "",

  mainPrice: 0,
  discount: 0,
  quantity: 0,
  limitProducts: 0,
  limitStock: 0,

  mainImageUrl: null,
  imageUrls: [],

  types: [],
  keywords: [],

  // Add one empty Custom type item
  additionalData: [
    { id: 0, type: 7, key: "", values: [""] }  // <-- placeholder here
  ],
  variants: [],
};

const typeToKeyMap: Record<number, string> = {
  1: "الألوان",
  2: "السعة",
  3: "الحجم",
  4: "الشكل",
  5: "الوزن",
  6: "الذاكرة",
};

const productSlice = createSlice({
  name: "productDraft",
  initialState,
  reducers: {
    setField<K extends keyof ProductDraft>(
      state: ProductDraft,
      action: PayloadAction<{ key: K; value: ProductDraft[K] }>,
    ) {
      const { key, value } = action.payload;
      state[key] = value;
    },

    resetDraft(): ProductDraft {
      return initialState;
    },

    setMainImageUrl(state, action: PayloadAction<string | null>) {
      state.mainImageUrl = action.payload;
    },

    addImageUrls(state, action: PayloadAction<string[]>) {
      state.imageUrls.push(...action.payload);
    },

    removeImageUrl(state, action: PayloadAction<number>) {
      state.imageUrls = state.imageUrls.filter((_, i) => i !== action.payload);
    },

    clearImages(state) {
      state.imageUrls = [];
      state.mainImageUrl = null;
    },

    addType(state: ProductDraft, action: PayloadAction<string>) {
      const v = action.payload.trim();
      if (v && !state.types.includes(v)) state.types.push(v);
    },

    removeType(state: ProductDraft, action: PayloadAction<string>) {
      state.types = state.types.filter((t) => t !== action.payload);
    },

    addKeyword(state: ProductDraft, action: PayloadAction<string>) {
      const v = action.payload.trim();
      if (v && !state.keywords.includes(v)) state.keywords.push(v);
    },

    removeKeyword(state: ProductDraft, action: PayloadAction<string>) {
      state.keywords = state.keywords.filter((k) => k !== action.payload);
    },

    addAdditionalData(state: ProductDraft) {
      state.additionalData.push({
        id: 0,
        type: 7,
        key: "",
        values: [],
      });
    },

    updateAdditionalData(
      state,
      action: PayloadAction<{
        index: number;
        field: "type" | "key" | "values";
        value: any;
      }>,
    ) {
      const { index, field, value } = action.payload;

      if (!state.additionalData[index]) return;

      if (field === "values") {
        state.additionalData[index].values = value;
        return;
      }

      if (field === "type") {
        const numType = Number(value);
        state.additionalData[index].type = numType;

        if (typeToKeyMap[numType]) {
          state.additionalData[index].key = typeToKeyMap[numType];
        }

        return;
      }

      state.additionalData[index].key = value;
    },

    removeAdditionalData(state: ProductDraft, action: PayloadAction<number>) {
      state.additionalData = state.additionalData.filter(
        (_, i) => i !== action.payload,
      );
    },

    addVariant(state) {
      const newVariant: Variant = { attributes: {}, quantity: 0 };
      state.variants.push(newVariant);
    },

    updateVariantAttribute(
      state,
      action: PayloadAction<{
        variantIndex: number;
        attributeKey: string;
        value: string;
      }>,
    ) {
      const { variantIndex, attributeKey, value } = action.payload;
      if (state.variants[variantIndex]) {
        state.variants[variantIndex].attributes[attributeKey] = value;
      }
    },

    updateVariantQuantity(
      state,
      action: PayloadAction<{ variantIndex: number; quantity: number }>,
    ) {
      const { variantIndex, quantity } = action.payload;
      if (state.variants[variantIndex]) {
        state.variants[variantIndex].quantity = quantity;
      }
    },

    removeVariant(state, action: PayloadAction<number>) {
      state.variants = state.variants.filter((_, i) => i !== action.payload);
    },
  },
});

export const {
  setField,
  resetDraft,
  setMainImageUrl,
  addImageUrls,
  removeImageUrl,
  clearImages,
  addType,
  removeType,
  addKeyword,
  removeKeyword,
  addAdditionalData,
  updateAdditionalData,
  removeAdditionalData,
  addVariant,
  updateVariantAttribute,
  updateVariantQuantity,
  removeVariant,
} = productSlice.actions;

export default productSlice.reducer;
