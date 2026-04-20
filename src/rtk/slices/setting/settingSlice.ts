import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "@/lib/axios";

export interface Setting {
  id: number;
  name: string;
  logoDark: string;
  logoLight: string;
  primaryColor: string;
  secondaryColor: string;
}

/* ===========================
   Initial State
=========================== */
interface SettingState {
  loading: boolean;
  data: Setting;
  error: string | null;
}

const initialState: SettingState = {
  loading: false,
  data: {} as Setting,
  error: null,
};

/* ===========================
   Async Thunks
=========================== */
export const fetchSettings = createAsyncThunk<
  Setting,
  number,
  { rejectValue: string }
>("settings/fetchAll", async (id, thunkAPI) => {
  try {
    const res = await axios.get(`/Tenant/${id}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل الإعدادات",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Update Settings
=========================== */

type UpdateSettingsPayload = {
  id: number;
  name: string;
  logoDark?: File;
  logoLight?: File;
  primaryColor: string;
  secondaryColor: string;
  isActive?: boolean;
};

export const updateSettings = createAsyncThunk<
  { id: number },
  UpdateSettingsPayload,
  { rejectValue: string }
>("settings/update", async (payload, thunkAPI) => {
  try {
    const formData = new FormData();

    formData.append("Id", payload.id.toString());
    formData.append("Name", payload.name);
    formData.append("PrimaryColor", payload.primaryColor);
    formData.append("SecondaryColor", payload.secondaryColor);

    if (payload.logoDark) {
      formData.append("LogoDark", payload.logoDark);
    }

    if (payload.logoLight) {
      formData.append("LogoLight", payload.logoLight);
    }

    if (payload.isActive !== undefined) {
      formData.append("IsActive", String(payload.isActive));
    }

    await axios.put(`/Tenant/${payload.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { id: payload.id };
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحديث الإعدادات"
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetSettingsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      });
  },
});

export const { resetSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;
