import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { toggleUserFavourite } from "@/rtk/slices/favourite/favouriteSlice";
import { getCookie } from "cookies-next";

/* ===========================
   Types
=========================== */

export interface ProductsPaginationResponse {
  items: any[];
  currentPage: number;
  totalItems: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ProductsPaginationState {
  byCategoryLoading: boolean;
  byCategoryError: string | null;

  byCategoryItems: any[];
  byCategoryCurrentPage: number;
  byCategoryPageSize: number;
  byCategoryTotalItems: number;
  byCategoryPageCount: number;
  byCategoryHasNextPage: boolean;
  byCategoryHasPreviousPage: boolean;

  byCategoryCategoryId: number | null;

  deleteLoading: boolean;
  deleteError: string | null;
}

export type ProductsByCategoryParams = {
  categoryId: number;
  subCategoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  brandId?: number;
  minRate?: number;
  maxRate?: number;
  page?: number;
  pageSize?: number;
  query?: string;
};

export interface ProductsByCategoryResponse {
  items: any[];
  currentPage: number;
  nextPage: number;
  previousPage: number;

  firstPageLink?: string;
  lastPageLink?: string;
  nextPageLink?: string;
  previousPageLink?: string;

  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageCount: number;
}

/* ===========================
   Initial State
=========================== */

const initialState: ProductsPaginationState = {
  byCategoryLoading: false,
  byCategoryError: null,
  byCategoryItems: [],
  byCategoryCurrentPage: 1,
  byCategoryPageSize: 8,
  byCategoryTotalItems: 0,
  byCategoryPageCount: 0,
  byCategoryHasNextPage: false,
  byCategoryHasPreviousPage: false,

  byCategoryCategoryId: null,

  deleteLoading: false,
  deleteError: null,
};

/* ===========================
   Thunks
=========================== */

export const fetchProductsByCategory = createAsyncThunk<
  ProductsByCategoryResponse,
  ProductsByCategoryParams,
  { rejectValue: string }
>("products/fetchByCategory", async (args, thunkAPI) => {
  const user = JSON.parse(getCookie("user") as string | undefined as string);
  try {
    const {
      categoryId = 0,
      subCategoryId = 0,
      minPrice = 0,
      maxPrice = 1000000,
      brandId = 0,
      minRate = 0,
      maxRate = 5,
      page = 1,
      pageSize = 8,
      query,
    } = args;

    const params = new URLSearchParams({
      subCategoryId: String(subCategoryId),
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
      brandId: String(brandId),
      minRate: String(minRate),
      maxRate: String(maxRate),
      page: String(page),
      pageSize: String(pageSize),
    });

    if (query) params.append("query", query);

    const res = await axios.get<ProductsByCategoryResponse>(
      `/Product/ByCategory/${categoryId}?${params.toString()}`,
    );

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل منتجات التصنيف",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export const deleteProduct = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("products/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`/Product/${id}`);
    return id;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل حذف المنتج",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */

const productsPaginationSlice = createSlice({
  name: "productsPagination",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // ================= products by category =================
      .addCase(fetchProductsByCategory.pending, (state, action) => {
        state.byCategoryLoading = true;
        state.byCategoryError = null;

        const newCategoryId = action.meta.arg.categoryId;
        if (state.byCategoryCategoryId !== newCategoryId) {
          state.byCategoryCategoryId = newCategoryId;
          state.byCategoryItems = [];
          state.byCategoryCurrentPage = 1;
          state.byCategoryTotalItems = 0;
          state.byCategoryPageCount = 0;
          state.byCategoryHasNextPage = false;
          state.byCategoryHasPreviousPage = false;
        }
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.byCategoryLoading = false;

        state.byCategoryItems = action.payload.items ?? [];
        state.byCategoryCurrentPage = action.payload.currentPage ?? 1;
        state.byCategoryTotalItems = action.payload.totalItems ?? 0;
        state.byCategoryPageCount = action.payload.pageCount ?? 0;
        state.byCategoryHasNextPage = action.payload.hasNextPage ?? false;
        state.byCategoryHasPreviousPage =
          action.payload.hasPreviousPage ?? false;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.byCategoryLoading = false;
        state.byCategoryError = action.payload || "حدث خطأ";
      })
      // ================= delete product =================
      .addCase(deleteProduct.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const deletedId = action.payload;

        state.byCategoryItems = state.byCategoryItems.filter(
          (p) => p.id !== deletedId,
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || "حدث خطأ";
      });
  },
});

export const {} = productsPaginationSlice.actions;

export default productsPaginationSlice.reducer;
