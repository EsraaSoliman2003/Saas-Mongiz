// sellerSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

// ===========================
// Types
// ===========================
export interface Seller {
  id?: number;
  name?: string;
  fullName?: string;
  email: string;
  phone?: string;
  address?: string;
  countryCode?: string;
  password?: string;
  image?: string;
  imageUrl?: any; // multipart response
  commercialRegisterImage?: string;
  commercialRegisterText?: string;
  taxCardImage?: string;
  taxCardText?: string;
  isApproved?: boolean;
}

interface SellerState {
  loading: boolean;
  profile: Seller | null;
  pending: Seller[];
  error: string | null;
  allSellers: Seller[]; // 👈 جديد
  loadingUpdate: boolean;
}

// ===========================
// Initial State
// ===========================
const initialState: SellerState = {
  loading: false,
  profile: null,
  pending: [],
  error: null,
  allSellers: [], // 👈 جديد
  loadingUpdate: false
};

// ===========================
// Async Thunks
// ===========================

// 1️⃣ Fetch current seller profile
export const fetchSellerProfile = createAsyncThunk<
  Seller,
  void,
  { rejectValue: string }
>("seller/fetchProfile", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/SellerProfile/profile");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل بيانات البائع",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// 5️⃣ Fetch all sellers (Admin)
export const fetchAllSellers = createAsyncThunk<
  Seller[],
  void,
  { rejectValue: string }
>("seller/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/SellerProfile/all-sellers");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل جميع البائعين",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// 2️⃣ Register new seller
export const registerSeller = createAsyncThunk<
  Seller,
  FormData,
  { rejectValue: string }
>("seller/register", async (formData, thunkAPI) => {
  try {
    const res = await axios.post("/SellerProfile/register-seller", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تسجيل البائع",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// 6️⃣ Update seller profile
export const updateSellerProfile = createAsyncThunk<
  Seller,
  FormData,
  { rejectValue: string }
>("seller/updateProfile", async (formData, thunkAPI) => {
  try {
    const res = await axios.put("/SellerProfile/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحديث بيانات البائع",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// 3️⃣ Fetch pending sellers
export const fetchPendingSellers = createAsyncThunk<
  Seller[],
  void,
  { rejectValue: string }
>("seller/fetchPending", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/SellerProfile/pending-sellers");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل البائعين المعلقين",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// 4️⃣ Approve seller
export const approveSeller = createAsyncThunk<
  string,
  number,
  { rejectValue: string }
>("seller/approve", async (userId, thunkAPI) => {
  try {
    const res = await axios.post(`/SellerProfile/approve-seller/${userId}`);
    return res.data; // "Seller approved successfully"
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل الموافقة على البائع",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// 7️⃣ Fetch public seller profile
export const fetchPublicSellerProfile = createAsyncThunk<
  Seller,
  number,
  { rejectValue: string }
>("seller/fetchPublicProfile", async (userId, thunkAPI) => {
  try {
    const res = await axios.get(
      `/SellerProfile/profile-public?userId=${userId}`,
    );
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل بيانات البائع",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// ===========================
// Slice
// ===========================
const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    resetSellerState: () => initialState,
  },
  extraReducers: (builder) => {
    // fetchSellerProfile
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      });

    // fetchAllSellers
    builder
      .addCase(fetchAllSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.allSellers = action.payload;
      })
      .addCase(fetchAllSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      });

    // registerSeller
    builder
      .addCase(registerSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      });

    // updateSellerProfile
    builder
      .addCase(updateSellerProfile.pending, (state) => {
        state.loadingUpdate = true;
        state.error = null;
      })
      .addCase(updateSellerProfile.fulfilled, (state, action) => {
        state.loadingUpdate = false;

        state.profile = action.payload;
      })
      .addCase(updateSellerProfile.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload || "حدث خطأ";
      });

    // fetchPendingSellers
    builder
      .addCase(fetchPendingSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = action.payload;
      })
      .addCase(fetchPendingSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      });

    // approveSeller
    builder
      .addCase(approveSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveSeller.fulfilled, (state, action) => {
        state.loading = false;

        const sellerId = action.meta.arg;

        const seller = state.allSellers.find((s) => s.id === sellerId);

        if (seller) {
          seller.isApproved = true;
        }

        // remove seller from pending list
        state.pending = state.pending.filter((s) => s.id !== sellerId);
      })
      .addCase(approveSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      });

    // fetchPublicSellerProfile
    builder
      .addCase(fetchPublicSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchPublicSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      });
  },
});

export const { resetSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
