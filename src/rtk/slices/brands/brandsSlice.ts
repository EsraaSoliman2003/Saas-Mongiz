import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export type BrandApi = {
  id: number;
  name: string;
};

export type BrandFullApi = {
  id: string;
  name: string;
};

export type CreateBrandPayload = {
  name: string;
};

export type UpdateBrandPayload = {
  id: number;
  name: string;
};

interface BrandsState {
  loading: boolean;
  items: BrandApi[];
  error: string | null;

  selectedLoading: boolean;
  selectedBrand: BrandApi | null;
  selectedError: string | null;

  // ✅ /Brand/{id}/full
  selectedFullLoading: boolean;
  selectedBrandFull: BrandFullApi | null;
  selectedFullError: string | null;

  createLoading: boolean;
  createError: string | null;

  updateLoading: boolean;
  updateError: string | null;

  deleteLoading: boolean;
  deleteError: string | null;
}

/* ===========================
   Initial State
=========================== */

const initialState: BrandsState = {
  loading: false,
  items: [],
  error: null,

  selectedLoading: false,
  selectedBrand: null,
  selectedError: null,

  selectedFullLoading: false,
  selectedBrandFull: null,
  selectedFullError: null,

  createLoading: false,
  createError: null,

  updateLoading: false,
  updateError: null,

  deleteLoading: false,
  deleteError: null,
};

/* ===========================
   Thunks
=========================== */

// ✅ GET /api/Brand
export const fetchBrands = createAsyncThunk<
  BrandApi[],
  void,
  { rejectValue: string }
>("brands/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get<BrandApi[]>("/Brand");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل البراندات",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// ✅ GET /api/Brand/{id}
export const fetchBrandById = createAsyncThunk<
  BrandApi,
  number,
  { rejectValue: string }
>("brands/fetchById", async (id, thunkAPI) => {
  try {
    const res = await axios.get<BrandApi>(`/Brand/${id}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل بيانات البراند",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// ✅ GET /api/Brand/{id}/full
export const fetchBrandFullById = createAsyncThunk<
  BrandFullApi,
  number,
  { rejectValue: string }
>("brands/fetchFullById", async (id, thunkAPI) => {
  try {
    const res = await axios.get<BrandFullApi>(`/Brand/${id}/full`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل بيانات البراند كاملة",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// ✅ POST /api/Brand (multipart/form-data)
export const createBrand = createAsyncThunk<
  BrandApi,
  CreateBrandPayload,
  { rejectValue: string }
>("brands/create", async (data, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Name", data.name);

    const res = await axios.post<BrandApi>("/Brand", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل إنشاء البراند",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// ✅ PUT /api/Brand/{id} (multipart/form-data)
export const updateBrand = createAsyncThunk<
  BrandApi,
  UpdateBrandPayload,
  { rejectValue: string }
>("brands/update", async (data, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Id", String(data.id));
    formData.append("Name", data.name);

    const res = await axios.put<BrandApi>(`/Brand/${data.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تعديل البراند",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// ✅ DELETE /api/Brand/{id}
export const deleteBrand = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("brands/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`/Brand/${id}`);
    return id;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل حذف البراند",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    clearBrandsError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.selectedError = null;
      state.selectedFullError = null;
    },
    clearSelectedBrand: (state) => {
      state.selectedBrand = null;
      state.selectedError = null;
      state.selectedLoading = false;
    },
    clearSelectedBrandFull: (state) => {
      state.selectedBrandFull = null;
      state.selectedFullError = null;
      state.selectedFullLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBrands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((b) => ({
          ...b,
          id: Number(b.id),
        }));
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // fetchBrandById
      .addCase(fetchBrandById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchBrandById.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedBrand = action.payload;
      })
      .addCase(fetchBrandById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload || "حدث خطأ";
      })

      // fetchBrandFullById
      .addCase(fetchBrandFullById.pending, (state) => {
        state.selectedFullLoading = true;
        state.selectedFullError = null;
      })
      .addCase(fetchBrandFullById.fulfilled, (state, action) => {
        state.selectedFullLoading = false;
        state.selectedBrandFull = action.payload;
      })
      .addCase(fetchBrandFullById.rejected, (state, action) => {
        state.selectedFullLoading = false;
        state.selectedFullError = action.payload || "حدث خطأ";
      })

      // createBrand
      .addCase(createBrand.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.createLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "حدث خطأ";
      })

      // updateBrand
      .addCase(updateBrand.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updated = action.payload;

        const idx = state.items.findIndex(
          (b) => String(b.id) === String(updated.id),
        );
        if (idx !== -1) state.items[idx] = updated;

        if (
          state.selectedBrand &&
          String(state.selectedBrand.id) === String(updated.id)
        ) {
          state.selectedBrand = updated;
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || "حدث خطأ";
      })

      // deleteBrand
      .addCase(deleteBrand.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const deletedId = action.payload;

        state.items = state.items.filter(
          (b) => String(b.id) !== String(deletedId),
        );

        if (
          state.selectedBrand &&
          String(state.selectedBrand.id) === String(deletedId)
        ) {
          state.selectedBrand = null;
        }

        if (
          state.selectedBrandFull &&
          String(state.selectedBrandFull.id) === String(deletedId)
        ) {
          state.selectedBrandFull = null;
        }
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || "حدث خطأ";
      });
  },
});

export const { clearBrandsError, clearSelectedBrand, clearSelectedBrandFull } =
  brandsSlice.actions;

export default brandsSlice.reducer;
