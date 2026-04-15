import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

export interface Coupon {
  id: number;
  code: string;
  discount: number;
}

interface CouponState {
  loading: boolean;
  data: Coupon[] | null;
  currentCoupon: Coupon | null;
  error: string | null;
}

const initialState: CouponState = {
  loading: false,
  data: null,
  currentCoupon: null,
  error: null,
};

// ===================== GET ALL =====================
export const fetchCouponsData = createAsyncThunk<Coupon[]>(
  "coupon/fetchCouponsData",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("Coupon");
      return res.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.title || "فشل تحميل البيانات",
        );
      }
      return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
    }
  },
);

// ===================== GET ONE =====================
export const fetchCouponData = createAsyncThunk<Coupon, number>(
  "coupon/fetchCouponData",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`Coupon/${id}`);
      return res.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.title || "فشل تحميل البيانات",
        );
      }
      return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
    }
  },
);

// ===================== GET BY CODE =====================
export const fetchCouponByCode = createAsyncThunk<Coupon, string>(
  "coupon/fetchCouponByCode",
  async (code, thunkAPI) => {
    try {
      const res = await axios.get(`Coupon/Code/${code}`);
      return res.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.title || "فشل التحقق من الكود",
        );
      }
      return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
    }
  },
);

// ===================== CREATE =====================
export interface CreateCouponPayload {
  code: string;
  discount: number;
}
export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (payload: CreateCouponPayload, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("Code", payload.code);
      formData.append("Discount", payload.discount.toString());
      const res = await axios.post("Coupon", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.title || "فشل إنشاء قسيمة الخصم",
        );
      }
      return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
    }
  },
);

// ===================== EDIT =====================
export interface EditCouponPayload {
  id: number;
  code: string;
  discount: number;
}
export const editCoupon = createAsyncThunk(
  "coupon/editCoupon",
  async (payload: EditCouponPayload, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("Id", payload.id.toString());
      formData.append("Code", payload.code);
      formData.append("Discount", payload.discount.toString());
      const res = await axios.put(`Coupon/${payload.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.title || "فشل تعديل قسيمة الخصم",
        );
      }
      return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
    }
  },
);

// ===================== DELETE =====================
export const deleteCoupon = createAsyncThunk<number, number>(
  "coupon/deleteCoupon",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`Coupon/${id}`);
      return id;
    } catch (err) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.title || "فشل حذف قسيمة الخصم",
        );
      }
      return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
    }
  },
);

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      // GET coupons
      .addCase(fetchCouponsData.pending, (state) => {
        state.loading = true;
        state.data = null;
        state.error = null;
      })
      .addCase(fetchCouponsData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchCouponsData.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload as string;
      })

      // GET coupon
      .addCase(fetchCouponData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCouponData.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoupon = action.payload;
      })
      .addCase(fetchCouponData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE coupon
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // EDIT coupon
      .addCase(editCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCoupon.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ===================== GET coupon by code =====================
      .addCase(fetchCouponByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentCoupon = null;
      })
      .addCase(fetchCouponByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoupon = action.payload;
        state.error = null;
      })
      .addCase(fetchCouponByCode.rejected, (state, action) => {
        state.loading = false;
        state.currentCoupon = null;
        state.error = action.payload as string;
      })

      // DELETE coupon ✅
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.data) {
          state.data = state.data.filter((c) => c.id !== action.payload);
        }
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default couponSlice.reducer;
