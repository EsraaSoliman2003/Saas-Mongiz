// bannerSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "@/lib/axios";

export interface Banner {
  id: number;
  images: string[];
  links: string[];
  titles: string[];
}

/* ===========================
   Initial State
=========================== */
interface BannerState {
  loading: boolean;
  data: Banner[];
  error: string | null;
}

const initialState: BannerState = {
  loading: false,
  data: [],
  error: null,
};

/* ===========================
   Async Thunks
=========================== */
export const fetchBanners = createAsyncThunk<
  Banner[],
  void,
  { rejectValue: string }
>("banner/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/Banner");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل البانرات",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Update Banner
=========================== */
export const updateBanner = createAsyncThunk<
  void,
  { id: number; formData: FormData },
  { rejectValue: string }
>("banner/update", async ({ id, formData }, thunkAPI) => {
  try {
    await axios.put(`/Banner/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحديث البانر",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */
const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    resetBannerState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      });
  },
});

export const { resetBannerState } = bannerSlice.actions;
export default bannerSlice.reducer;
