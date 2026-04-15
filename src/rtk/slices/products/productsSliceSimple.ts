import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "@/lib/axios";
import { Product } from "@/utils/dtos";
import { toggleUserFavourite } from "@/rtk/slices/favourite/favouriteSlice";

/* ===========================
   State
=========================== */

export interface ProductsState {
  loading: boolean;
  data: Product[];
  error: string | null;
}

const initialState: ProductsState = {
  loading: false,
  data: [],
  error: null,
};

/* ===========================
   Params
=========================== */

interface FetchProductsParams {
  categoryId: number;
  subCategoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  brandId?: number;
  minRate?: number;
  maxRate?: number;
  userId?: number;
  page?: number;
  pageSize?: number;
  query?: string;
}

/* ===========================
   Thunk
=========================== */

export const fetchProductsByCategory = createAsyncThunk<
  Product[],
  FetchProductsParams,
  { rejectValue: string }
>("products/fetchByCategory", async (params, thunkAPI) => {
  try {
    const { categoryId, ...queryParams } = params;

    const url = params.userId
      ? `/Product/Seller/${params.userId}/ByCategory/${categoryId}`
      : `/Product/ByCategory/${categoryId}`;

    const res = await axios.get(url, {
      params: queryParams,
    });

    // safeguard: ensure array
    const dataArray = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.items)
        ? res.data.items
        : [];

    return dataArray;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل المنتجات",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */

const productsSlice = createSlice({
  name: "productsHome1",
  initialState,
  reducers: {
    resetProductsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // ⭐ update favourite status safely
      .addCase(toggleUserFavourite.fulfilled, (state, action) => {
        const { productId, isFavourite } = action.payload;

        if (Array.isArray(state.data)) {
          state.data = state.data.map((p) =>
            Number(p.id) === Number(productId) ? { ...p, isFavourite } : p,
          );
        }
      });
  },
});

export const { resetProductsState } = productsSlice.actions;
export default productsSlice.reducer;
