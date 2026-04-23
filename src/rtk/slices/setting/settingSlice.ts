import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "@/lib/axios";

/* ===========================
   Types
=========================== */

export interface Setting {
  id: number;
  name: string;
  logoDark: string;
  logoLight: string;
  primaryColor: string;
  secondaryColor: string;
  isActive?: boolean;
}

/* ===========================
   State
=========================== */

interface SettingState {
  loading: boolean;
  data: Setting | null;
  list: Setting[];
  error: string | null;
}

const initialState: SettingState = {
  loading: false,
  data: null,
  list: [],
  error: null,
};

/* ===========================
   GET ALL TENANTS (NEW)
=========================== */

export const fetchTenants = createAsyncThunk<
  Setting[],
  void,
  { rejectValue: string }
>("settings/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get(`/Tenant`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل البيانات",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   GET BY ID (existing)
=========================== */

export const fetchSettings = createAsyncThunk<
  Setting,
  number,
  { rejectValue: string }
>("settings/fetchById", async (id, thunkAPI) => {
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
   CREATE TENANT (NEW)
=========================== */

type CreateTenantPayload = {
  name: string;
  logoDark?: File;
  logoLight?: File;
  primaryColor: string;
  secondaryColor: string;
  isActive?: boolean;
};

export const createTenant = createAsyncThunk<
  Setting,
  CreateTenantPayload,
  { rejectValue: string }
>("settings/create", async (payload, thunkAPI) => {
  try {
    const formData = new FormData();

    formData.append("Name", payload.name);
    formData.append("PrimaryColor", payload.primaryColor);
    formData.append("SecondaryColor", payload.secondaryColor);

    if (payload.logoDark) formData.append("LogoDark", payload.logoDark);
    if (payload.logoLight) formData.append("LogoLight", payload.logoLight);
    if (payload.isActive !== undefined)
      formData.append("IsActive", String(payload.isActive));

    const res = await axios.post(`/Tenant`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل الإنشاء",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   UPDATE (existing)
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
  Setting,
  UpdateSettingsPayload,
  { rejectValue: string }
>("settings/update", async (payload, thunkAPI) => {
  try {
    const formData = new FormData();

    formData.append("Id", payload.id.toString());
    formData.append("Name", payload.name);
    formData.append("PrimaryColor", payload.primaryColor);
    formData.append("SecondaryColor", payload.secondaryColor);

    if (payload.logoDark) formData.append("LogoDark", payload.logoDark);
    if (payload.logoLight) formData.append("LogoLight", payload.logoLight);
    if (payload.isActive !== undefined)
      formData.append("IsActive", String(payload.isActive));

    const res = await axios.put(`/Tenant/${payload.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل التحديث",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   DELETE TENANT (NEW)
=========================== */

export const deleteTenant = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("settings/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`/Tenant/${id}`);
    return id;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(err.response?.data?.title || "فشل الحذف");
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

      /* =======================
         GET ALL (3 cases)
      ======================= */
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "error";
      })

      /* =======================
         GET BY ID (3 cases)
      ======================= */
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
        state.error = action.payload || "error";
      })

      /* =======================
         CREATE (3 cases)
      ======================= */
      .addCase(createTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "error";
      })

      /* =======================
         UPDATE (3 cases)
      ======================= */
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;

        const index = state.list.findIndex((t) => t.id === action.payload.id);

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "error";
      })

      /* =======================
         DELETE (3 cases)
      ======================= */
      .addCase(deleteTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "error";
      });
  },
});

export const { resetSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;
