import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export type LogoItem = {
  id: number;
  logoDarkMode: string | null;
  logoLightMode: string | null;
};

export type CreateLogoPayload = {
  logoDarkMode?: File;
  logoLightMode?: File;
};

/* ===========================
   State
=========================== */

interface LogoState {
  loading: boolean;
  logo: LogoItem | null;
  error: string | null;

  createLoading: boolean;
  createError: string | null;
}

const initialState: LogoState = {
  loading: false,
  logo: null,
  error: null,

  createLoading: false,
  createError: null,
};

/* ===========================
   Thunks
=========================== */

// GET /api/Logo
export const fetchLogo = createAsyncThunk<
  LogoItem,
  void,
  { rejectValue: string }
>("logo/fetch", async (_, thunkAPI) => {
  try {
    const res = await axios.get<LogoItem>("/Logo");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تحميل اللوجو");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// POST /api/Logo
export const createLogo = createAsyncThunk<
  LogoItem,
  CreateLogoPayload,
  { rejectValue: string }
>("logo/create", async (payload, thunkAPI) => {
  try {
    const formData = new FormData();

    if (payload.logoDarkMode) {
      formData.append("LogoDarkMode", payload.logoDarkMode);
    }

    if (payload.logoLightMode) {
      formData.append("LogoLightMode", payload.logoLightMode);
    }

    const res = await axios.post<LogoItem>("/Logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل رفع اللوجو");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */

const logoSlice = createSlice({
  name: "logo",
  initialState,
  reducers: {
    clearLogoErrors: (state) => {
      state.error = null;
      state.createError = null;
    },
    clearLogoState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchLogo
      .addCase(fetchLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogo.fulfilled, (state, action) => {
        state.loading = false;
        state.logo = action.payload;
      })
      .addCase(fetchLogo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // createLogo
      .addCase(createLogo.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createLogo.fulfilled, (state, action) => {
        state.createLoading = false;
        state.logo = action.payload;
      })
      .addCase(createLogo.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "حدث خطأ";
      });
  },
});

export const { clearLogoErrors, clearLogoState } = logoSlice.actions;
export default logoSlice.reducer;
