import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export type ProductApi = {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  mainPrice: number;
  price: number;
  discount: number;
  quantity: number;
  reviewCount: number;
  rate: number;
  isFavourite: boolean;
  mainImage: string;
  images: string[];
  averageRate: number;
};

export type ToggleFavouriteResponse = {
  id: number;
  productId: number;
  isFavourite: boolean;
};

/* ===========================
   State
=========================== */

interface FavouriteState {
  loading: boolean;
  favourites: ProductApi[];
  error: string | null;

  toggleLoading: boolean;
  toggleError: string | null;
}

/* ===========================
   Initial State
=========================== */

const initialState: FavouriteState = {
  loading: false,
  favourites: [],
  error: null,

  toggleLoading: false,
  toggleError: null,
};

/* ===========================
   Thunks
=========================== */

// ✅ GET /api/UserProductFavourite
export const fetchUserFavourites = createAsyncThunk<
  ProductApi[],
  void,
  { rejectValue: string }
>("favourite/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get<ProductApi[]>("/UserProductFavourite");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل المفضلة",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// ✅ POST /api/UserProductFavourite/toggle/{productId}
export const toggleUserFavourite = createAsyncThunk<
  ToggleFavouriteResponse,
  number,
  { rejectValue: string }
>("favourite/toggle", async (productId, thunkAPI) => {
  try {
    const res = await axios.post<ToggleFavouriteResponse>(
      `/UserProductFavourite/toggle/${productId}`,
    );
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحديث المفضلة",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */

const favouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {
    clearFavouriteErrors: (state) => {
      state.error = null;
      state.toggleError = null;
    },
    clearFavouriteState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ================= fetchUserFavourites =================
      .addCase(fetchUserFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUserFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // ================= toggleUserFavourite =================
      .addCase(toggleUserFavourite.pending, (state) => {
        state.toggleLoading = true;
        state.toggleError = null;
      })
      .addCase(toggleUserFavourite.fulfilled, (state, action) => {
        state.toggleLoading = false;

        const { productId, isFavourite } = action.payload;

        const item = state.favourites.find((p) => p.id === productId);
        if (item) {
          item.isFavourite = isFavourite;
        } else if (isFavourite) {
          // optional: refetch or append to favourites
        }
      })
      .addCase(toggleUserFavourite.rejected, (state, action) => {
        state.toggleLoading = false;
        state.toggleError = action.payload || "حدث خطأ";
      });
  },
});

export const { clearFavouriteErrors, clearFavouriteState } =
  favouriteSlice.actions;

export default favouriteSlice.reducer;
