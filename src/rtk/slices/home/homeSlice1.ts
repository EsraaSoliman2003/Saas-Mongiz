"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "@/lib/axios";
import { Category, SubCategory, Product } from "@/utils/dtos";

export const fetchCategoryByIdHome1 = createAsyncThunk<
  Category,
  number,
  { rejectValue: string }
>("home1/fetchCategory", async (id, thunkAPI) => {
  try {
    const res = await axios.get(`Category/${id}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to load category",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

export const fetchSubCategoriesHome1 = createAsyncThunk<
  SubCategory[],
  number,
  { rejectValue: string }
>("home1/fetchSubCategory", async (categoryId, thunkAPI) => {
  try {
    const res = await axios.get(`/SubCategory/by-category/${categoryId}`);
    return res.data?.items || res.data || [];
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to load subcategories",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

export const fetchProductsByCategoryHome1 = createAsyncThunk<
  Product[],
  { categoryId: number; subCategoryId?: number },
  { rejectValue: string }
>("home1/fetchProducts", async ({ categoryId, subCategoryId }, thunkAPI) => {
  try {
    const res = await axios.get(`/Product/ByCategory/${categoryId}`, {
      params: { subCategoryId },
    });
    return res.data.items || [];
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to load products",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

interface HomeState {
  category: Category | null;
  subCategories: SubCategory[];
  products: Product[];
  loadingCategory: boolean;
  loadingSubCategories: boolean;
  loadingProducts: boolean;
  error: string | null;
}

const initialState: HomeState = {
  category: null,
  subCategories: [],
  products: [],
  loadingProducts: false,
  loadingCategory: false,
  loadingSubCategories: false,
  error: null,
};

const homeSlice1 = createSlice({
  name: "home1",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryByIdHome1.pending, (state) => {
        state.loadingCategory = true;
        state.error = null;
      })
      .addCase(fetchCategoryByIdHome1.fulfilled, (state, action) => {
        state.category = action.payload;
        state.loadingCategory = false;
      })
      .addCase(fetchCategoryByIdHome1.rejected, (state, action) => {
        state.loadingCategory = false;
        state.error = action.payload || "Failed to load category";
      })

      // ===== SUBCATEGORIES =====
      .addCase(fetchSubCategoriesHome1.pending, (state) => {
        state.loadingSubCategories = true;
        state.error = null;
      })
      .addCase(fetchSubCategoriesHome1.fulfilled, (state, action) => {
        state.subCategories = action.payload;
        state.loadingSubCategories = false;
      })
      .addCase(fetchSubCategoriesHome1.rejected, (state, action) => {
        state.loadingSubCategories = false;
        state.error = action.payload || "Failed to load subcategories";
      })

      // ===== PRODUCTS =====
      .addCase(fetchProductsByCategoryHome1.pending, (state) => {
        state.loadingProducts = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategoryHome1.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loadingProducts = false;
      })
      .addCase(fetchProductsByCategoryHome1.rejected, (state, action) => {
        state.loadingProducts = false;
        state.error = action.payload || "Failed to load products";
      });
  },
});

export const home1Reducer = homeSlice1.reducer;
export default homeSlice1.reducer;
