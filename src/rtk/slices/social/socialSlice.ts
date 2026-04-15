import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export type SocialItem = {
  id: number;
  url: string;
  name: string; // facebook | instagram | ...
  [key: string]: any;
};

export type CreateSocialPayload = {
  Url: string;
  Name: string;
};

export type UpdateSocialPayload = {
  id: number;
  Url: string;
  Name: string;
};

/* ===========================
   State
=========================== */

interface SocialState {
  loading: boolean;
  list: SocialItem[];
  error: string | null;

  detailsLoading: boolean;
  selected: SocialItem | null;
  detailsError: string | null;

  createLoading: boolean;
  createError: string | null;

  updateLoading: boolean;
  updateError: string | null;
}

const initialState: SocialState = {
  loading: false,
  list: [],
  error: null,

  detailsLoading: false,
  selected: null,
  detailsError: null,

  createLoading: false,
  createError: null,

  updateLoading: false,
  updateError: null,
};

/* ===========================
   Thunks
=========================== */

// GET /api/Social
export const fetchSocialList = createAsyncThunk<
  SocialItem[],
  void,
  { rejectValue: string }
>("social/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get<SocialItem[]>("/Social");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تحميل روابط السوشيال");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// GET /api/Social/{id}
export const fetchSocialById = createAsyncThunk<
  SocialItem,
  number,
  { rejectValue: string }
>("social/fetchById", async (id, thunkAPI) => {
  try {
    const res = await axios.get<SocialItem>(`/Social/${id}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تحميل تفاصيل الرابط");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// POST /api/Social (multipart/form-data)
export const createSocial = createAsyncThunk<
  void,
  CreateSocialPayload,
  { rejectValue: string }
>("social/create", async (payload, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Url", payload.Url);
    formData.append("Name", payload.Name);

    await axios.post("/Social", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // 🔥 ريفريش
    await thunkAPI.dispatch(fetchSocialList());
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل إضافة رابط السوشيال");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// PUT /api/Social/{id} (multipart/form-data)
export const updateSocial = createAsyncThunk<
  void,
  UpdateSocialPayload,
  { rejectValue: string }
>("social/update", async (payload, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Id", String(payload.id));
    formData.append("Url", payload.Url);
    formData.append("Name", payload.Name);

    await axios.put(`/Social/${payload.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // 🔥 ريفريش
    await thunkAPI.dispatch(fetchSocialList());
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تعديل رابط السوشيال");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */

const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    clearSocialErrors: (state) => {
      state.error = null;
      state.detailsError = null;
      state.createError = null;
      state.updateError = null;
    },
    clearSocialSelected: (state) => {
      state.selected = null;
      state.detailsError = null;
      state.detailsLoading = false;
    },
    clearSocialState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetch list
      .addCase(fetchSocialList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSocialList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // fetch by id
      .addCase(fetchSocialById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchSocialById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selected = action.payload;
      })
      .addCase(fetchSocialById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || "حدث خطأ";
      })

      // create
      .addCase(createSocial.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createSocial.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createSocial.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "حدث خطأ";
      })

      // update
      .addCase(updateSocial.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateSocial.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(updateSocial.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || "حدث خطأ";
      });
  },
});

export const { clearSocialErrors, clearSocialSelected, clearSocialState } =
  socialSlice.actions;

export default socialSlice.reducer;
