import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types (حسب الباك)
=========================== */

export type AddressApi = {
  id: number;
  country: string | null;
  city: string | null;
  houseNumberAndStreet: string | null;
  isDefault: boolean;
  userId: number;
  governorate: string;
  countryCode: string;
  phoneNumber: string;
};

export type AddressCreateUpdateBody = {
  country: string;
  governrate: string;
  city: string;
  houseNumberAndStreet: string;
  phoneNumber: string;
  countryCode: string;
};

export type AddressesPaginationResponse = {
  items: AddressApi[];
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
};

export type FetchUserAddressesParams = {
  page?: number;
  size?: number;
};

type AddressState = {
  loading: boolean;
  error: string | null;

  // list for user pagination
  items: AddressApi[];
  currentPage: number;
  size: number;
  totalItems: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  // default address
  defaultLoading: boolean;
  defaultAddress: AddressApi | null;
  defaultError: string | null;

  // create / update / delete / setDefault
  mutateLoading: boolean;
  mutateError: string | null;
};

const initialState: AddressState = {
  loading: false,
  error: null,

  items: [],
  currentPage: 1,
  size: 10,
  totalItems: 0,
  pageCount: 0,
  hasNextPage: false,
  hasPreviousPage: false,

  defaultLoading: false,
  defaultAddress: null,
  defaultError: null,

  mutateLoading: false,
  mutateError: null,
};

/* ===========================
   Helpers
=========================== */

const getErrorMessage = (err: unknown, fallback: string) => {
  if (isAxiosError(err)) {
    // swagger عندك بيرجع title غالباً
    const anyData = err.response?.data as any;
    return anyData?.title || anyData?.message || fallback;
  }
  return "حدث خطأ غير متوقع";
};

/* ===========================
   Thunks
=========================== */

// ✅ POST /api/Address
export const createAddress = createAsyncThunk<
  AddressApi,
  AddressCreateUpdateBody,
  { rejectValue: string }
>("address/create", async (body, thunkAPI) => {
  try {
    const res = await axios.post<AddressApi>("/Address", body);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "فشل إضافة العنوان"));
  }
});

// ✅ GET /api/Address/user?page=1&size=10
export const fetchUserAddressesPaginated = createAsyncThunk<
  AddressesPaginationResponse,
  FetchUserAddressesParams,
  { rejectValue: string }
>("address/fetchUserPaginated", async ({ page = 1, size = 10 }, thunkAPI) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });

    const res = await axios.get<AddressesPaginationResponse>(
      `/Address/user?${params.toString()}`,
    );
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "فشل تحميل عناوين المستخدم"),
    );
  }
});

// ✅ GET /api/Address/user/default
export const fetchDefaultAddress = createAsyncThunk<
  AddressApi,
  void,
  { rejectValue: string }
>("address/fetchDefault", async (_, thunkAPI) => {
  try {
    const res = await axios.get<AddressApi>("/Address/user/default");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "فشل تحميل العنوان الافتراضي"),
    );
  }
});

// ✅ PUT /api/Address/set-default/{id}
export const setDefaultAddress = createAsyncThunk<
  { id: number },
  number,
  { rejectValue: string }
>("address/setDefault", async (id, thunkAPI) => {
  try {
    await axios.put(`/Address/set-default/${id}`);
    return { id };
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "فشل تعيين العنوان الافتراضي"),
    );
  }
});

// ✅ DELETE /api/Address/{id}
export const deleteAddress = createAsyncThunk<
  { id: number },
  number,
  { rejectValue: string }
>("address/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`/Address/${id}`);
    return { id };
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "فشل حذف العنوان"));
  }
});

// ✅ PUT /api/Address/{id}
export const updateAddress = createAsyncThunk<
  AddressApi,
  { id: number; body: AddressCreateUpdateBody },
  { rejectValue: string }
>("address/update", async ({ id, body }, thunkAPI) => {
  try {
    const payload = { ...body, id };
    const res = await axios.put<AddressApi>(`/Address/${id}`, payload);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "فشل تعديل العنوان"));
  }
});

/* ===========================
   Slice
=========================== */

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressErrors: (state) => {
      state.error = null;
      state.defaultError = null;
      state.mutateError = null;
    },
    clearDefaultAddress: (state) => {
      state.defaultAddress = null;
      state.defaultError = null;
      state.defaultLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserAddressesPaginated
      .addCase(fetchUserAddressesPaginated.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.size = action.meta.arg.size ?? state.size;
      })
      .addCase(fetchUserAddressesPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.currentPage = action.payload.currentPage ?? 1;
        state.totalItems = action.payload.totalItems ?? 0;
        state.pageCount = action.payload.pageCount ?? 0;
        state.hasNextPage = action.payload.hasNextPage ?? false;
        state.hasPreviousPage = action.payload.hasPreviousPage ?? false;
      })
      .addCase(fetchUserAddressesPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // fetchDefaultAddress
      .addCase(fetchDefaultAddress.pending, (state) => {
        state.defaultLoading = true;
        state.defaultError = null;
      })
      .addCase(fetchDefaultAddress.fulfilled, (state, action) => {
        state.defaultLoading = false;
        state.defaultAddress = action.payload;
      })
      .addCase(fetchDefaultAddress.rejected, (state, action) => {
        state.defaultLoading = false;
        state.defaultError = action.payload || "حدث خطأ";
      })

      // createAddress
      .addCase(createAddress.pending, (state) => {
        state.mutateLoading = true;
        state.mutateError = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.mutateLoading = false;

        // نزودها في الليست لو موجودة
        state.items = [action.payload, ...state.items];
        state.totalItems += 1;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.mutateLoading = false;
        state.mutateError = action.payload || "حدث خطأ";
      })

      // updateAddress
      .addCase(updateAddress.pending, (state) => {
        state.mutateLoading = true;
        state.mutateError = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.mutateLoading = false;

        const idx = state.items.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;

        if (state.defaultAddress?.id === action.payload.id) {
          state.defaultAddress = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.mutateLoading = false;
        state.mutateError = action.payload || "حدث خطأ";
      })

      // deleteAddress
      .addCase(deleteAddress.pending, (state) => {
        state.mutateLoading = true;
        state.mutateError = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.mutateLoading = false;

        state.items = state.items.filter((a) => a.id !== action.payload.id);
        state.totalItems = Math.max(0, state.totalItems - 1);

        if (state.defaultAddress?.id === action.payload.id) {
          state.defaultAddress = null;
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.mutateLoading = false;
        state.mutateError = action.payload || "حدث خطأ";
      })

      // setDefaultAddress
      .addCase(setDefaultAddress.pending, (state) => {
        state.mutateLoading = true;
        state.mutateError = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.mutateLoading = false;

        const newDefaultId = action.payload.id;

        // حدّث flags في list
        state.items = state.items.map((a) => ({
          ...a,
          isDefault: a.id === newDefaultId,
        }));

        // حدّث defaultAddress لو موجود في الليست
        const found = state.items.find((a) => a.id === newDefaultId) || null;
        state.defaultAddress = found;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.mutateLoading = false;
        state.mutateError = action.payload || "حدث خطأ";
      });
  },
});

export const { clearAddressErrors, clearDefaultAddress } = addressSlice.actions;
export default addressSlice.reducer;
